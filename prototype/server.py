#!/usr/bin/env python3
"""
Palmetto EI Companion (v9) — Cloud Sync & PWA Application Server
- Zero local LLM / homebase calls (instant <5ms responses)
- Serves PWA static assets, Apple Touch Icons, and manifest.json
- Provides real-time cross-device sync via GET/POST /api/sync backed by cloud_vault.json
"""
import json
import os
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from datetime import datetime, timezone
from urllib.parse import urlparse, parse_qs

PORT = int(os.environ.get("PORT", "8765"))
BASE_DIR = "/workspace/ei-app/prototype"
VAULT_FILE = os.path.join(BASE_DIR, "cloud_vault.json")
VAULT_LOCK = threading.Lock()


def read_vault():
    with VAULT_LOCK:
        if not os.path.exists(VAULT_FILE):
            return {"workspaces": {}}
        try:
            with open(VAULT_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {"workspaces": {}}


def write_vault(data):
    with VAULT_LOCK:
        tmp_path = VAULT_FILE + ".tmp"
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)
        os.replace(tmp_path, VAULT_FILE)


class PalmettoEIServer(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        if self.path.startswith("/api/") or self.path.endswith(".html") or self.path == "/":
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path in ("/api/sync", "/api/state"):
            qs = parse_qs(parsed.query)
            ws_id = (qs.get("workspace", ["mcmakin-family-ei"])[0] or "mcmakin-family-ei").strip()
            vault = read_vault()
            record = vault.get("workspaces", {}).get(ws_id)
            payload = {
                "status": "ok",
                "workspace": ws_id,
                "hasData": bool(record and record.get("state")),
                "updatedAt": record.get("updatedAt") if record else None,
                "version": record.get("version", 0) if record else 0,
                "state": record.get("state") if record else None,
            }
            body = json.dumps(payload).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if parsed.path == "/api/health":
            body = json.dumps({
                "status": "ok",
                "app": "Palmetto EI Companion v9",
                "local_llm_enabled": False,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path in ("/api/sync", "/api/state"):
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
            try:
                req = json.loads(raw)
            except Exception:
                req = {}
            ws_id = (req.get("workspace") or "mcmakin-family-ei").strip()
            state = req.get("state")
            if not isinstance(state, dict):
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Invalid state"}).encode("utf-8"))
                return

            vault = read_vault()
            if "workspaces" not in vault:
                vault["workspaces"] = {}
            prev = vault["workspaces"].get(ws_id, {})
            new_version = int(prev.get("version", 0)) + 1
            now_iso = datetime.now(timezone.utc).isoformat()
            vault["workspaces"][ws_id] = {
                "updatedAt": now_iso,
                "version": new_version,
                "state": state,
            }
            write_vault(vault)

            resp = {
                "status": "ok",
                "workspace": ws_id,
                "updatedAt": now_iso,
                "version": new_version,
            }
            body = json.dumps(resp).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        self.send_response(404)
        self.end_headers()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), PalmettoEIServer)
    print(f"Palmetto EI v9 Server listening on http://0.0.0.0:{PORT}")
    server.serve_forever()
