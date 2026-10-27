#!/usr/bin/env python3
"""Bundles v9.css + v9.js + red squircle icon into /workspace/ei-app/prototype/index.html and /workspace/ei-app/EarlyNote.html."""
import base64
import json
import pathlib

proto = pathlib.Path("/workspace/ei-app/prototype")
css = (proto / "v9.css").read_text(encoding="utf-8")
js = (proto / "v9.js").read_text(encoding="utf-8")
icon_b64 = base64.b64encode((proto / "icon-192.png").read_bytes()).decode("ascii")
icon_data_uri = f"data:image/png;base64,{icon_b64}"

# Update manifest.json theme color
manifest_path = proto / "manifest.json"
if manifest_path.exists():
    try:
        m = json.loads(manifest_path.read_text(encoding="utf-8"))
        m["theme_color"] = "#7A2E22"
        m["background_color"] = "#FAF5EF"
        manifest_path.write_text(json.dumps(m, indent=2), encoding="utf-8")
    except Exception:
        pass

bundled = f"""<!DOCTYPE html>
<html lang="en" data-theme="terracotta">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>EarlyNote — Early Intervention Workspace</title>
  <link rel="manifest" href="manifest.json" />
  <link rel="apple-touch-icon" href="apple-touch-icon.png" />
  <link rel="icon" type="image/png" href="favicon.png" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="EarlyNote" />
  <meta name="theme-color" content="#7A2E22" />
  <style>
{css}
  </style>
</head>
<body>
  <div class="mobile-topbar">
    <div style="display:flex;align-items:center;gap:10px;">
      <div class="brand-icon" style="width:32px;height:32px;border-radius:8px;">
        <img src="{icon_data_uri}" alt="EarlyNote" style="width:100%;height:100%;object-fit:cover;border-radius:8px;display:block;" />
      </div>
      <div>
        <div style="font-weight:700;font-size:15px;line-height:1.15;">EarlyNote</div>
        <div style="font-size:11px;color:var(--text-muted);">Family Visit Journal</div>
      </div>
    </div>
    <button class="btn btn-primary btn-sm" onclick="openVisitNote(null, 'c1')">+ New Visit</button>
  </div>

  <div class="app-shell">
    <!-- CLEAN LEFT SIDEBAR -->
    <aside class="left-sidebar">
      <div>
        <div class="brand-box">
          <div class="brand-icon">
            <img src="{icon_data_uri}" alt="EarlyNote" style="width:100%;height:100%;object-fit:cover;border-radius:10px;display:block;" />
          </div>
          <div>
            <div class="brand-title">EarlyNote</div>
            <div class="brand-sub">Family Visit Journal</div>
          </div>
        </div>

        <button class="sidebar-cta" onclick="openVisitNote(null, 'c1')">
          <span>+ New Visit</span>
        </button>

        <nav class="nav-list">
          <button class="nav-btn active" data-nav="today" onclick="navTab('today')">
            <span class="nav-btn-left">Today</span>
            <span class="nav-badge" id="badge-today">6</span>
          </button>
          <button class="nav-btn" data-nav="caseload" onclick="navTab('caseload')">
            <span class="nav-btn-left">Caseload</span>
            <span class="nav-badge" id="badge-caseload">6</span>
          </button>
          <button class="nav-btn" data-nav="notes" onclick="navTab('notes')">
            <span class="nav-btn-left">All Notes</span>
            <span class="nav-badge" id="badge-notes">8</span>
          </button>
          <button class="nav-btn" data-nav="units" onclick="navTab('units')">
            <span class="nav-btn-left">Units &amp; Calendar</span>
            <span class="nav-badge" id="badge-units">16/20</span>
          </button>
        </nav>

        <div id="sidebar-quick-panel" class="sidebar-quick-panel"></div>
      </div>

      <div class="sidebar-footer">
        <button class="nav-btn" data-nav="settings" onclick="navTab('settings')">
          <span class="nav-btn-left">Settings</span>
        </button>
        <div class="sync-pill">
          <span><span class="sync-dot"></span><span id="sidebar-sync-label">Synced · AES-256</span></span>
          <span>EarlyNote</span>
        </div>
      </div>
    </aside>

    <!-- CALM SINGLE-COLUMN MAIN VIEW -->
    <main class="main-stage" id="main-stage"></main>
  </div>

  <!-- MOBILE BOTTOM TAB BAR (INSET FLOATING DOCK FOR FULL-SCREEN IPHONE) -->
  <nav class="mobile-tabbar">
    <button class="mob-tab active" data-nav="today" onclick="navTab('today')">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none"/></svg>
      <span>Today</span>
    </button>
    <button class="mob-tab" data-nav="caseload" onclick="navTab('caseload')">
      <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      <span>Caseload</span>
    </button>
    <button class="mob-tab" data-nav="notes" onclick="navTab('notes')">
      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>
      <span>Notes</span>
    </button>
    <button class="mob-tab" data-nav="units" onclick="navTab('units')">
      <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      <span>Units</span>
    </button>
    <button class="mob-tab" data-nav="settings" onclick="navTab('settings')">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      <span>Settings</span>
    </button>
  </nav>

  <script>
{js}
  </script>
</body>
</html>
"""

(proto / "index.html").write_text(bundled, encoding="utf-8")
pathlib.Path("/workspace/ei-app/EarlyNote.html").write_text(bundled, encoding="utf-8")
pathlib.Path("/workspace/ei-app/Palmetto-EI.html").write_text(bundled, encoding="utf-8")
print("Built /workspace/ei-app/prototype/index.html and /workspace/ei-app/EarlyNote.html:", len(bundled), "bytes")
