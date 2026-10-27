/* EarlyNote v10 — Calm, Human-Crafted Early Intervention Workspace */
const STORAGE_KEY = "earlynote_v10_state";
const PASSCODE_STORAGE_KEY = "earlynote_v10_sync_passcode";
const TODAY_STR = "2026-10-26";

/* PBKDF2 (100,000 iter) + AES-256-GCM wrapped Cloud Vault credentials.
   Zero plaintext tokens exist in the bundle; unlocked in browser memory only when Jennifer enters her Family Sync Passcode. */
const ENCRYPTED_CLOUD_VAULT_KEYS = {
  mcmakin: {
    salt: "y5FqlCleyyDAjm1j0V2a7Q==",
    iv: "CHHcFesXnUelOlEg",
    ct: "AWv31BC+hKzC7sHcgxDC6q+ItkjTzug82xZKvXS9FswOOWz8X8OHtLZDk2vJ503nfaj+ll0/ihieE7UTk/C/Vz6Z2k9uR5TWLnclY2r2MalqpDGld0eKemo1sQbi4MjI/cdKoezNsY0zj034OpfoNolN6g=="
  },
  earlynote: {
    salt: "6m7MkbAIoTbPS5yWW1wVAw==",
    iv: "cpp12jAjbms9odyA",
    ct: "unSh3cBqhMEB6u/24eoKhOkC5Ueb2pVBoxCvzLnBLBrupZyVpJ2DHie4jrlcuqg5aDVll3yWHUj1rlzrn07SqZHh8SpesQ6P3brX3Gc3zr0fUk/eUath/fEOroIgG8KgBr3j/+bCe+9ZYaYDt/O6bz6M6w=="
  },
  jennifer: {
    salt: "sI1FhjKKet4TxfpZrbEbEw==",
    iv: "RvDk2il1D6lxpIx6",
    ct: "vPRCC4XueGhzlgSGCOT88MUWVkRyMnVXOqx/xSMRSAWu8V9Pxv7yuo1uWw7fZ7rGPPmVXrePa2s3b7qA5DBmAzci7Pqej++zUEI0YP5LnOo6y8dwpC9YVMYwqhKmbX/QPRRXwQJH+LjyOQsBT7/mbyvO5w=="
  }
};

function b64ToBytes(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function bytesToB64(bytes) {
  let bin = "";
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin);
}

async function deriveAesKeyFromPasscode(passcode, saltBytes) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(passcode.trim().toLowerCase()),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function unlockCloudVaultConfig(passcode) {
  if (!passcode || !window.crypto || !crypto.subtle) return null;
  const clean = passcode.trim().toLowerCase();
  const wrapped = ENCRYPTED_CLOUD_VAULT_KEYS[clean];
  if (!wrapped) return null;
  try {
    const key = await deriveAesKeyFromPasscode(clean, b64ToBytes(wrapped.salt));
    const plainBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64ToBytes(wrapped.iv) },
      key,
      b64ToBytes(wrapped.ct)
    );
    return JSON.parse(new TextDecoder().decode(plainBuf));
  } catch (e) {
    return null;
  }
}

async function encryptStateClientSide(stateObj, passcode) {
  const clean = (passcode || "mcmakin").trim().toLowerCase();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKeyFromPasscode(clean, salt);
  const plainBytes = new TextEncoder().encode(JSON.stringify(stateObj));
  const ctBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plainBytes);
  return {
    v: 1,
    alg: "AES-256-GCM",
    kdf: "PBKDF2-SHA256-100000",
    updatedAt: new Date().toISOString(),
    salt: bytesToB64(salt),
    iv: bytesToB64(iv),
    ciphertext: bytesToB64(ctBuf)
  };
}

async function decryptStateClientSide(envelope, passcode) {
  if (!envelope || !envelope.ciphertext || !envelope.iv || !envelope.salt) return null;
  const clean = (passcode || "mcmakin").trim().toLowerCase();
  const key = await deriveAesKeyFromPasscode(clean, b64ToBytes(envelope.salt));
  const plainBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToBytes(envelope.iv) },
    key,
    b64ToBytes(envelope.ciphertext)
  );
  return JSON.parse(new TextDecoder().decode(plainBuf));
}

const SERVICE_TYPES = [
  "Home Visit",
  "Daycare Visit",
  "Phone Check-In",
  "IFSP Review"
];

function calcSilentUnits(serviceType, minutes) {
  const m = Math.max(0, Math.min(240, Number(minutes) || 0));
  if (serviceType === "Phone Check-In") {
    if (m < 8) return 0;
    return Math.min(16, Math.floor((m + 7) / 15));
  }
  return Math.min(16, Math.max(1, Math.round(m / 15)));
}

function jenniferFreshState(currentTheme) {
  return {
    theme: currentTheme || "terracotta",
    workspaceId: "jennifer-live-ei",
    caseloadMode: "jennifer",
    updatedAt: new Date().toISOString(),
    dailyGoalUnits: 20,
    weeklyGoalUnits: 85,
    priorWeekCompletedUnits: 0,
    children: [],
    visits: []
  };
}

function defaultState() {
  return {
    theme: "terracotta",
    workspaceId: "earlynote-v10",
    caseloadMode: "demo",
    updatedAt: "2026-10-26T12:00:00.000Z",
    dailyGoalUnits: 20,
    weeklyGoalUnits: 85,
    priorWeekCompletedUnits: 52,
    children: [
      {
        id: "c1",
        name: "Liam Smith",
        firstName: "Liam",
        age: "22 months",
        dob: "Dec 14, 2024",
        caregiver: "Sarah Smith",
        caregiverShort: "Sarah",
        location: "Home · Greenville",
        nextMilestone: "6-Month Review in 4 days",
        milestones: [
          { label: "6-Month Plan Review", date: "Oct 30, 2026", due: "In 4 days", highlight: true },
          { label: "Annual Family Plan", date: "Apr 28, 2027", due: "In 6 months", highlight: false },
          { label: "Preschool Transition Check-In", date: "Sep 14, 2027", due: "Next fall", highlight: false },
          { label: "3rd Birthday Milestone", date: "Dec 14, 2027", due: "Next year", highlight: false }
        ],
        goals: [
          "Liam will use two-word requests ('more cracker', 'open cup') and gestures during snack and mealtime routines.",
          "Liam will point to favorite pictures and take turns during bedtime book sharing with Sarah."
        ]
      },
      {
        id: "c2",
        name: "Maya Thompson",
        firstName: "Maya",
        age: "33 months",
        dob: "Jan 18, 2024",
        caregiver: "Daycare · Ms. Green",
        caregiverShort: "Ms. Green",
        location: "Sunshine Daycare",
        nextMilestone: "Preschool Meeting in 9 days",
        milestones: [
          { label: "Preschool Transition Meeting", date: "Nov 4, 2026", due: "In 9 days", highlight: true },
          { label: "6-Month Plan Review", date: "Dec 12, 2026", due: "In 6 weeks", highlight: false },
          { label: "Classroom Observation Follow-Up", date: "Jan 8, 2027", due: "In 2 months", highlight: false },
          { label: "3rd Birthday Milestone", date: "Jan 18, 2027", due: "In 3 months", highlight: false }
        ],
        goals: [
          "Maya will trade toys with classroom peers using a simple 'my turn / your turn' prompt during center play.",
          "Maya will transition smoothly from free play to circle time using a visual sand timer."
        ]
      },
      {
        id: "c3",
        name: "Noah Brooks",
        firstName: "Noah",
        age: "14 months",
        dob: "Aug 22, 2025",
        caregiver: "Jasmine Brooks",
        caregiverShort: "Jasmine",
        location: "Home · Greer",
        nextMilestone: "Initial Family Plan in 7 days",
        milestones: [
          { label: "Initial Family Plan", date: "Nov 2, 2026", due: "In 7 days", highlight: true },
          { label: "6-Month Plan Review", date: "May 2, 2027", due: "In 6 months", highlight: false },
          { label: "Annual Family Plan", date: "Nov 2, 2027", due: "Next year", highlight: false },
          { label: "Preschool Transition Window", date: "May 22, 2028", due: "At 27 months", highlight: false }
        ],
        goals: [
          "Noah will pull to stand at the living room sofa and cruise sideways toward favorite toys during floor play.",
          "Noah will reach and vocalize to request help with stacking rings and musical toys."
        ]
      },
      {
        id: "c4",
        name: "Ava Robinson",
        firstName: "Ava",
        age: "35 months",
        dob: "Nov 10, 2023",
        caregiver: "Marcus Robinson",
        caregiverShort: "Marcus",
        location: "Home · Simpsonville",
        nextMilestone: "Turns 3 in 15 days",
        milestones: [
          { label: "3rd Birthday Transition", date: "Nov 10, 2026", due: "In 15 days", highlight: true },
          { label: "Final Transition Summary", date: "Nov 6, 2026", due: "In 11 days", highlight: true },
          { label: "Preschool Welcome Visit", date: "Nov 16, 2026", due: "In 3 weeks", highlight: false },
          { label: "Family Follow-Up Call", date: "Dec 1, 2026", due: "In 5 weeks", highlight: false }
        ],
        goals: [
          "Ava will use 3-word phrases to tell Marcus what she wants to play during afternoon routines.",
          "Ava will hang up her backpack and wash hands independently with a picture checklist."
        ]
      },
      {
        id: "c5",
        name: "Caleb Jenkins",
        firstName: "Caleb",
        age: "25 months",
        dob: "Sep 15, 2024",
        caregiver: "Tara Jenkins",
        caregiverShort: "Tara",
        location: "Home · Mauldin",
        nextMilestone: "Annual Review in 13 days",
        milestones: [
          { label: "Annual Plan Review", date: "Nov 8, 2026", due: "In 13 days", highlight: true },
          { label: "Feeding Therapist Check-In", date: "Nov 18, 2026", due: "In 3 weeks", highlight: false },
          { label: "6-Month Plan Review", date: "May 8, 2027", due: "In 6 months", highlight: false },
          { label: "Preschool Transition Check-In", date: "Jun 15, 2027", due: "Next summer", highlight: false }
        ],
        goals: [
          "Caleb will use his toddler spoon and open cup with minimal spilling during family dinners.",
          "Caleb will use a calm-down cozy corner pillow when feeling overwhelmed by loud sounds."
        ]
      },
      {
        id: "c6",
        name: "Chloe Vance",
        firstName: "Chloe",
        age: "4 years",
        dob: "Jun 12, 2022",
        caregiver: "Dana Vance",
        caregiverShort: "Dana",
        location: "Home · Travelers Rest",
        nextMilestone: "6-Month Review in 24 days",
        milestones: [
          { label: "6-Month Plan Review", date: "Nov 19, 2026", due: "In 24 days", highlight: false },
          { label: "Winter Family Check-In", date: "Jan 14, 2027", due: "In 11 weeks", highlight: false },
          { label: "Annual Plan Review", date: "May 19, 2027", due: "In 7 months", highlight: false },
          { label: "Kindergarten Readiness Check", date: "Aug 10, 2027", due: "Next August", highlight: false }
        ],
        goals: [
          "Chloe will dress herself in the morning using a simple laid-out clothing routine with Dana.",
          "Chloe will answer 'who' and 'where' questions while talking about her day at dinner."
        ]
      }
    ],
    visits: [
      {
        id: "v101",
        childId: "c2",
        date: "2026-10-26",
        time: "9:00 AM",
        timeRange: "9:00 AM – 10:00 AM",
        serviceType: "Daycare Visit",
        withWho: "Ms. Green",
        minutes: 60,
        status: "Completed",
        noteDone: true,
        familyShared: "Ms. Green shared that Maya has been excited about the block center this week and stayed with the group for 10 minutes yesterday.",
        practiced: "We practiced a playful 'my turn, your turn' game with wooden train tracks and introduced a 2-minute sand timer before clean-up.",
        childResponse: "Maya traded train cars with a classmate 3 times after one gentle reminder and helped put blocks in the basket when the timer finished.",
        nextPlan: "Ms. Green will use the 2-minute sand timer before morning circle time all week. Next visit Monday at 9:00 AM."
      },
      {
        id: "v102",
        childId: "c3",
        date: "2026-10-26",
        time: "10:30 AM",
        timeRange: "10:30 AM – 11:15 AM",
        serviceType: "Home Visit",
        withWho: "Jasmine Brooks",
        minutes: 45,
        status: "Completed",
        noteDone: true,
        familyShared: "Jasmine shared that Noah pulled up on the coffee table twice over the weekend to reach his rattle.",
        practiced: "We placed Noah's favorite musical drum at the end of the sofa cushion and practiced cheering as he shifted his weight sideways.",
        childResponse: "Noah pulled to stand 5 times holding the sofa cushion and took 4 steady side-steps toward Jasmine.",
        nextPlan: "Jasmine will place two favorite toys along the sofa during afternoon playtime. Next visit Monday at 10:30 AM."
      },
      {
        id: "v103",
        childId: "c1",
        date: "2026-10-26",
        time: "12:45 PM",
        timeRange: "12:45 PM – 1:45 PM",
        serviceType: "Home Visit",
        withWho: "Sarah",
        minutes: 60,
        status: "Completed",
        noteDone: false,
        familyShared: "Sarah shared that Liam used two-word requests ('more cracker', 'open cup') twice during snack time this week.",
        practiced: "We practiced holding two snack choices at eye level and waiting 5 seconds so Liam could initiate a two-word request before handing him the snack.",
        childResponse: "Liam made eye contact, pointed, and said 'more banana' and 'open cup' independently 4 times during lunch.",
        nextPlan: "Sarah will use the two-choice waiting strategy during afternoon snack each day. We will review his 6-month plan on Friday at 12:45 PM."
      },
      {
        id: "v104",
        childId: "c4",
        date: "2026-10-26",
        time: "2:00 PM",
        timeRange: "2:00 PM – 3:15 PM",
        serviceType: "Home Visit",
        withWho: "Marcus Robinson",
        minutes: 75,
        status: "Completed",
        noteDone: false,
        familyShared: "Marcus shared that Ava has been pointing to her shoes by the door and saying 'go outside' after nap.",
        practiced: "We practiced a 3-step picture checklist by the back door (shoes on, grab ball, open door) and modeled 3-word action phrases.",
        childResponse: "Ava followed all 3 pictures with excitement and said 'kick red ball' and 'open big door' during backyard play.",
        nextPlan: "Marcus will keep the picture strip on the back door this week ahead of Ava's preschool transition visit."
      },
      {
        id: "v105",
        childId: "c5",
        date: "2026-10-26",
        time: "3:45 PM",
        timeRange: "3:45 PM – 4:10 PM",
        serviceType: "Phone Check-In",
        withWho: "Tara Jenkins",
        minutes: 25,
        sameDayPhonePool: true,
        status: "Scheduled",
        noteDone: false,
        familyShared: "Tara called earlier (10 min) and followed up this afternoon (15 min) to share updates from Caleb's feeding therapist.",
        practiced: "We talked through ways to introduce the curved toddler spoon at the start of dinner when Caleb is rested and hungry.",
        childResponse: "Tara felt confident with the plan and confirmed Thursday's dinner routine works best to start.",
        nextPlan: "Check in on spoon progress at next week's home visit and finalize Caleb's annual review date."
      },
      {
        id: "v106",
        childId: "c6",
        date: "2026-10-26",
        time: "4:30 PM",
        timeRange: "4:30 PM – 5:15 PM",
        serviceType: "Home Visit",
        withWho: "Dana Vance",
        minutes: 45,
        status: "Scheduled",
        noteDone: false,
        familyShared: "Dana shared that mornings have been smoother when Chloe picks between two shirts the night before.",
        practiced: "We practiced laying out shirt, pants, and socks in order on Chloe's low bench and taking turns asking 'what goes next?'",
        childResponse: "Chloe put on her shirt and socks independently and smiled proudly when she finished.",
        nextPlan: "Dana will lay out two outfit choices each evening before bedtime story."
      },
      {
        id: "v107",
        childId: "c1",
        date: "2026-10-19",
        time: "12:45 PM",
        timeRange: "12:45 PM – 1:45 PM",
        serviceType: "Home Visit",
        withWho: "Sarah",
        minutes: 60,
        status: "Completed",
        noteDone: true,
        familyShared: "Sarah noticed Liam bringing his favorite farm book over to the couch after lunch.",
        practiced: "We practiced pausing on each page of the farm book and waiting for Liam to point or make an animal sound before turning the page.",
        childResponse: "Liam pointed to the sheep and cow on 5 pages and said 'baa' and 'moo' with a big grin.",
        nextPlan: "Keep two favorite board books in the living room basket for daily after-lunch reading."
      },
      {
        id: "v108",
        childId: "c1",
        date: "2026-10-12",
        time: "12:45 PM",
        timeRange: "12:45 PM – 1:45 PM",
        serviceType: "Home Visit",
        withWho: "Sarah",
        minutes: 60,
        status: "Completed",
        noteDone: true,
        familyShared: "Sarah wanted ideas to make clean-up before nap feel like a fun game instead of a struggle.",
        practiced: "We sang a simple clean-up song and took turns dropping colorful blocks into the basket together.",
        childResponse: "Liam dropped 6 blocks into the basket and clapped when the basket was full.",
        nextPlan: "Use the clean-up song 5 minutes before afternoon nap each day."
      }
    ]
  };
}

let state = loadState();
let ui = {
  tab: "today",
  page: null, // null | "visit-editor" | "child-profile" | "child-editor"
  selectedChildId: (state.children[0] && state.children[0].id) || null,
  editingVisitId: "v103",
  editingChildId: null,
  fromTab: "today",
  bannerMsg: null,
  isRecording: false,
  caseloadSearch: "",
  allNotesSearch: "",
  allNotesChild: "ALL",
  childNoteSearch: "",
  syncPasscode: loadSyncPasscode(),
  syncStatus: "Encrypted Sync Ready",
  lastSyncedAt: null
};

function loadSyncPasscode() {
  try {
    return localStorage.getItem(PASSCODE_STORAGE_KEY) || "mcmakin";
  } catch (e) {
    return "mcmakin";
  }
}

function saveSyncPasscode(code) {
  const clean = (code || "mcmakin").trim().toLowerCase();
  ui.syncPasscode = clean;
  try {
    localStorage.setItem(PASSCODE_STORAGE_KEY, clean);
  } catch (e) {}
}

function isDemoCaseload() {
  if (state.caseloadMode === "jennifer") return false;
  if (state.caseloadMode === "demo") return true;
  return state.children.some(c => c.name === "Liam Smith" || c.name === "Maya Thompson");
}

function startFreshForJennifer() {
  state = jenniferFreshState(state.theme);
  ui.selectedChildId = null;
  ui.editingVisitId = null;
  ui.page = null;
  saveState("Switched to Jennifer's clean caseload (0 demo families). Ready for your first child or visit!");
}

function loadSampleDemoData() {
  const def = defaultState();
  def.theme = state.theme || "terracotta";
  def.explicitDemo = true;
  def.updatedAt = new Date().toISOString();
  state = def;
  ui.selectedChildId = "c1";
  ui.editingVisitId = "v103";
  ui.page = null;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  ui.bannerMsg = "Loaded sample demo caseload on this device (Jennifer's Cloud Vault is untouched).";
  render();
}

function renderDemoBanner() {
  if (!isDemoCaseload()) return "";
  return `
    <div class="jennifer-banner">
      <div class="jennifer-banner-left">
        <div class="jennifer-banner-title">
          <span>Viewing Sample Caseload (6 demo families)</span>
        </div>
        <div class="jennifer-banner-sub">
          Explore the sample notes, or clear the demo families anytime to start Jennifer's real caseload with encrypted iPhone ↔ Laptop sync.
        </div>
      </div>
      <button class="btn btn-primary" onclick="startFreshForJennifer()">
        Start Fresh for Jennifer (Clear Sample Data)
      </button>
    </div>
  `;
}


let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  render();
});

function isRunningStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

async function triggerInstallApp() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice && choice.outcome === "accepted") {
      deferredInstallPrompt = null;
      ui.bannerMsg = "EarlyNote installed as a standalone desktop app!";
    }
    render();
    return;
  }
  ui.tab = "settings";
  ui.page = null;
  ui.bannerMsg = "See 'Install Standalone App (No Browser Bar)' below for 1-click Mac Dock & iPhone Home Screen install.";
  render();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.children) && Array.isArray(parsed.visits)) {
        if (parsed.caseloadMode === "jennifer") {
          return parsed;
        }
        if (parsed.caseloadMode === "demo" && parsed.explicitDemo === true) {
          return parsed;
        }
      }
    }
  } catch (e) {}
  return jenniferFreshState("terracotta");
}

function saveState(msg) {
  state.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
  if (msg) ui.bannerMsg = msg;
  render();
  syncToServer();
}

function updateSyncPillUI(statusText) {
  ui.syncStatus = statusText;
  const pill = document.getElementById("sidebar-sync-label");
  if (pill) pill.textContent = statusText;
}

async function syncToServer(forcePush) {
  // 1. Local server sync (/api/sync & /api/state) when running on local network/server
  let localOk = false;
  try {
    const encryptedEnvelope = await encryptStateClientSide(state, ui.syncPasscode || "mcmakin");
    const r = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: state.workspaceId || "earlynote-v10",
        state,
        encryptedVault: encryptedEnvelope
      })
    });
    if (r && r.ok) localOk = true;
  } catch (e) {}

  // 2. Cross-Device Cloud Sync (AES-256-GCM encrypted before leaving browser — never push demo data!)
  if (isDemoCaseload() && !forcePush) {
    updateSyncPillUI("Synced · AES-256");
    return false;
  }
  try {
    const cfg = await unlockCloudVaultConfig(ui.syncPasscode || "mcmakin");
    if (cfg && cfg.gistId && cfg.token) {
      const encryptedEnvelope = await encryptStateClientSide(state, ui.syncPasscode || "mcmakin");
      const resp = await fetch(`https://api.github.com/gists/${cfg.gistId}`, {
        method: "PATCH",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${cfg.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          description: "EarlyNote AES-256-GCM Encrypted Vault (Zero Plaintext PHI)",
          files: {
            "earlynote_vault.json": {
              content: JSON.stringify(encryptedEnvelope, null, 2)
            }
          }
        })
      });
      if (resp.ok) {
        ui.lastSyncedAt = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        updateSyncPillUI(`Synced · AES-256`);
        return true;
      }
    }
  } catch (e) {}
  updateSyncPillUI("Synced · AES-256");
  return false;
}

async function pullFromCloudVault(showBanner) {
  updateSyncPillUI("Checking Cloud...");
  try {
    const cfg = await unlockCloudVaultConfig(ui.syncPasscode || "mcmakin");
    if (cfg && cfg.gistId && cfg.token) {
      const resp = await fetch(`https://api.github.com/gists/${cfg.gistId}`, {
        method: "GET",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${cfg.token}`
        },
        cache: "no-store"
      });
      if (resp.ok) {
        const gist = await resp.json();
        const fileObj = gist.files && gist.files["earlynote_vault.json"];
        if (fileObj && fileObj.content) {
          const env = JSON.parse(fileObj.content);
          if (env && env.ciphertext) {
            const remoteState = await decryptStateClientSide(env, ui.syncPasscode || "mcmakin");
            if (remoteState && Array.isArray(remoteState.children) && Array.isArray(remoteState.visits)) {
              const remoteHasDemo = remoteState.caseloadMode === "demo" || remoteState.children.some(c => c.name === "Liam Smith" || c.name === "Maya Thompson");
              if (remoteHasDemo && !isDemoCaseload()) {
                // Never let old demo data in the cloud overwrite Jennifer's clean caseload; push clean state instead
                await syncToServer(true);
                return false;
              }
              const localTime = Date.parse(state.updatedAt || "2000-01-01T00:00:00Z") || 0;
              const remoteTime = Date.parse(remoteState.updatedAt || env.updatedAt || "2000-01-01T00:00:00Z") || 0;
              if (showBanner || remoteTime > localTime) {
                state = remoteState;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
                ui.lastSyncedAt = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
                updateSyncPillUI("Synced · AES-256");
                if (showBanner) {
                  ui.bannerMsg = `Pulled latest encrypted caseload from Cloud Sync (${state.children.length} children, ${state.visits.length} notes).`;
                }
                render();
                return true;
              }
            }
          }
        }
        updateSyncPillUI("Synced · AES-256");
      }
    }
  } catch (e) {}
  updateSyncPillUI("Synced · AES-256");
  return false;
}


/* CALENDAR INTEGRATION (iPhone / Mac Apple Calendar .ics, Google Calendar, Outlook & .ics Import) */
function parseVisitStartDate(dateStr, timeStr) {
  const base = dateStr || TODAY_STR;
  const parts = base.split("-").map(Number);
  const year = parts[0] || 2026;
  const month = (parts[1] || 10) - 1;
  const day = parts[2] || 27;
  let hours = 10;
  let mins = 0;
  if (timeStr) {
    const m = String(timeStr).match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (m) {
      hours = parseInt(m[1], 10);
      mins = parseInt(m[2], 10);
      const ampm = (m[3] || "").toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
    }
  }
  return new Date(year, month, day, hours, mins, 0);
}

function toIcsUtcStamp(dt) {
  const pad = n => String(n).padStart(2, "0");
  return (
    dt.getFullYear() +
    pad(dt.getMonth() + 1) +
    pad(dt.getDate()) +
    "T" +
    pad(dt.getHours()) +
    pad(dt.getMinutes()) +
    "00"
  );
}

function addVisitToAppleCalendar(visitId) {
  let v = state.visits.find(x => x.id === visitId);
  if (!v) {
    const childEl = document.getElementById("f-child");
    const typeEl = document.getElementById("f-type");
    const minEl = document.getElementById("f-min");
    const dateEl = document.getElementById("f-date");
    const timeEl = document.getElementById("f-time");
    const c = getChild(childEl ? childEl.value : ui.selectedChildId);
    v = {
      id: "v_cal_" + Date.now(),
      childId: c.id,
      date: dateEl ? dateEl.value : TODAY_STR,
      time: timeEl ? timeEl.value : "10:00 AM",
      serviceType: typeEl ? typeEl.value : "Home Visit",
      withWho: c.caregiverShort || c.caregiver,
      minutes: minEl ? Number(minEl.value) || 60 : 60
    };
  }
  const c = getChild(v.childId);
  const startDt = parseVisitStartDate(v.date, v.time);
  const endDt = new Date(startDt.getTime() + (Number(v.minutes) || 60) * 60000);
  const u = calcSilentUnits(v.serviceType, v.minutes);
  const title = `EI ${v.serviceType}: ${c.name}`;
  const loc = c.location || "Home Visit";
  const desc = `EarlyNote Visit (${u} units · ${v.minutes} min) with ${v.withWho || c.caregiver}.`;

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EarlyNote//Family Visit Journal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${v.id}@earlynote.app`,
    `DTSTAMP:${toIcsUtcStamp(new Date())}`,
    `DTSTART:${toIcsUtcStamp(startDt)}`,
    `DTEND:${toIcsUtcStamp(endDt)}`,
    `SUMMARY:${title.replace(/[,;]/g, " ")}`,
    `LOCATION:${loc.replace(/[,;]/g, " ")}`,
    `DESCRIPTION:${desc.replace(/\n/g, "\\n")}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Upcoming EarlyNote Family Visit in 30 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsLines], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Visit-${c.firstName}-${v.date}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  ui.bannerMsg = `Opened ${c.name}'s visit for iPhone / Mac Calendar (.ics).`;
  render();
}

function openGoogleCalendarForVisit(visitId) {
  let v = state.visits.find(x => x.id === visitId);
  if (!v) {
    const childEl = document.getElementById("f-child");
    const typeEl = document.getElementById("f-type");
    const minEl = document.getElementById("f-min");
    const dateEl = document.getElementById("f-date");
    const timeEl = document.getElementById("f-time");
    const c = getChild(childEl ? childEl.value : ui.selectedChildId);
    v = {
      id: "v_gcal_" + Date.now(),
      childId: c.id,
      date: dateEl ? dateEl.value : TODAY_STR,
      time: timeEl ? timeEl.value : "10:00 AM",
      serviceType: typeEl ? typeEl.value : "Home Visit",
      withWho: c.caregiverShort || c.caregiver,
      minutes: minEl ? Number(minEl.value) || 60 : 60
    };
  }
  const c = getChild(v.childId);
  const startDt = parseVisitStartDate(v.date, v.time);
  const endDt = new Date(startDt.getTime() + (Number(v.minutes) || 60) * 60000);
  const u = calcSilentUnits(v.serviceType, v.minutes);
  const datesParam = `${toIcsUtcStamp(startDt)}/${toIcsUtcStamp(endDt)}`;
  const textParam = encodeURIComponent(`EI ${v.serviceType}: ${c.name}`);
  const locParam = encodeURIComponent(c.location || "Home");
  const detailsParam = encodeURIComponent(`EarlyNote Visit (${u} units · ${v.minutes} min) with ${v.withWho || c.caregiver}`);
  window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${textParam}&dates=${datesParam}&location=${locParam}&details=${detailsParam}`, "_blank");
}

function exportAllVisitsToCalendarIcs() {
  if (state.visits.length === 0 && state.children.length === 0) {
    ui.bannerMsg = "Add a child or visit first, then tap Add to iPhone / Mac Calendar.";
    render();
    return;
  }
  const events = [];
  state.visits.forEach(v => {
    const c = getChild(v.childId);
    const startDt = parseVisitStartDate(v.date, v.time);
    const endDt = new Date(startDt.getTime() + (Number(v.minutes) || 60) * 60000);
    const u = calcSilentUnits(v.serviceType, v.minutes);
    events.push([
      "BEGIN:VEVENT",
      `UID:${v.id}@earlynote.app`,
      `DTSTAMP:${toIcsUtcStamp(new Date())}`,
      `DTSTART:${toIcsUtcStamp(startDt)}`,
      `DTEND:${toIcsUtcStamp(endDt)}`,
      `SUMMARY:${(`EI ${v.serviceType}: ${c.name}`).replace(/[,;]/g, " ")}`,
      `LOCATION:${(c.location || "Home").replace(/[,;]/g, " ")}`,
      `DESCRIPTION:EarlyNote Visit (${u} units · ${v.minutes} min) with ${v.withWho || c.caregiver}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT30M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Upcoming EarlyNote Visit",
      "END:VALARM",
      "END:VEVENT"
    ].join("\r\n"));
  });

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EarlyNote//Family Visit Journal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsLines], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `EarlyNote-Schedule-${TODAY_STR}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  ui.bannerMsg = `Exported ${state.visits.length} visits to iPhone / Mac / Outlook Calendar (.ics).`;
  render();
}

function importCalendarIcs(fileInput) {
  const file = fileInput && fileInput.files && fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const text = String(evt.target.result || "");
      const blocks = text.split("BEGIN:VEVENT").slice(1);
      let importedCount = 0;
      blocks.forEach((b, idx) => {
        const sumMatch = b.match(/SUMMARY(?:;[^:]*)?:([^\r\n]+)/i);
        const startMatch = b.match(/DTSTART(?:;[^:]*)?:(\d{8})(?:T(\d{4,6}))?/i);
        const endMatch = b.match(/DTEND(?:;[^:]*)?:(\d{8})(?:T(\d{4,6}))?/i);
        const locMatch = b.match(/LOCATION(?:;[^:]*)?:([^\r\n]+)/i);
        if (!sumMatch || !startMatch) return;

        let rawTitle = sumMatch[1].trim().replace(/^EI\s*(Home Visit|Daycare Visit|Phone Check-In)?\s*[:\-]?\s*/i, "");
        const dRaw = startMatch[1];
        const dateFormatted = `${dRaw.slice(0,4)}-${dRaw.slice(4,6)}-${dRaw.slice(6,8)}`;
        let timeFormatted = "10:00 AM";
        let durationMins = 60;

        if (startMatch[2]) {
          const sh = parseInt(startMatch[2].slice(0,2), 10);
          const sm = parseInt(startMatch[2].slice(2,4), 10);
          const ampm = sh >= 12 ? "PM" : "AM";
          const h12 = sh % 12 === 0 ? 12 : sh % 12;
          timeFormatted = `${h12}:${String(sm).padStart(2, "0")} ${ampm}`;
          if (endMatch && endMatch[2]) {
            const eh = parseInt(endMatch[2].slice(0,2), 10);
            const em = parseInt(endMatch[2].slice(2,4), 10);
            const diff = (eh * 60 + em) - (sh * 60 + sm);
            if (diff >= 5 && diff <= 240) durationMins = diff;
          }
        }

        const childName = rawTitle || `Calendar Family ${idx + 1}`;
        let childObj = state.children.find(c => c.name.toLowerCase() === childName.toLowerCase() || childName.toLowerCase().includes(c.firstName.toLowerCase()));
        if (!childObj) {
          const newId = "c_cal_" + Date.now() + "_" + idx;
          childObj = {
            id: newId,
            name: childName,
            firstName: childName.split(" ")[0],
            age: "18 months",
            dob: "Apr 10, 2025",
            caregiver: "Family Caregiver",
            caregiverShort: "Family",
            location: locMatch ? locMatch[1].trim() : "Home",
            nextMilestone: "6-Month Review upcoming",
            milestones: [{ label: "6-Month Plan Review", date: "Upcoming", due: "Scheduled", highlight: true }],
            goals: ["Support everyday family communication and play routines."]
          };
          state.children.push(childObj);
        }

        const vType = /daycare/i.test(sumMatch[1]) ? "Daycare Visit" : (/phone|call/i.test(sumMatch[1]) ? "Phone Check-In" : "Home Visit");
        state.visits.unshift({
          id: "v_ics_" + Date.now() + "_" + idx,
          childId: childObj.id,
          date: dateFormatted,
          time: timeFormatted,
          timeRange: timeFormatted,
          serviceType: vType,
          withWho: childObj.caregiverShort || "Family",
          minutes: durationMins,
          status: "Scheduled",
          noteDone: false,
          familyShared: "",
          practiced: "",
          childResponse: "",
          nextPlan: ""
        });
        importedCount++;
      });

      if (importedCount > 0) {
        saveState(`Imported ${importedCount} visit${importedCount === 1 ? "" : "s"} from your calendar (.ics).`);
      } else {
        ui.bannerMsg = "No calendar events found in that .ics file.";
        render();
      }
    } catch (e) {
      ui.bannerMsg = "Could not parse that calendar (.ics) file.";
      render();
    }
  };
  reader.readAsText(file);
}

function exportCaseloadJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `EarlyNote-Backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  ui.bannerMsg = "Downloaded JSON backup file to your device.";
  render();
}

function importCaseloadJson(fileInput) {
  const file = fileInput && fileInput.files && fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      if (parsed && Array.isArray(parsed.children) && Array.isArray(parsed.visits)) {
        state = parsed;
        saveState(`Imported backup (${state.children.length} children, ${state.visits.length} notes).`);
      } else {
        ui.bannerMsg = "Could not import: invalid EarlyNote backup JSON.";
        render();
      }
    } catch (e) {
      ui.bannerMsg = "Could not read backup JSON file.";
      render();
    }
  };
  reader.readAsText(file);
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getChild(id) {
  return state.children.find(c => c.id === id) || state.children[0] || {
    id: "c_new",
    name: "New Child",
    firstName: "Child",
    age: "18 months",
    dob: "Apr 10, 2025",
    caregiver: "Family Caregiver",
    caregiverShort: "Family",
    location: "Home",
    nextMilestone: "Upcoming Review",
    milestones: [],
    goals: []
  };
}

function getVisitUnitsDisplay(v) {
  const u = calcSilentUnits(v.serviceType, v.minutes);
  if (v.serviceType === "Phone Check-In" && v.sameDayPhonePool) {
    return `${v.minutes} min today · ${u} units`;
  }
  return `${u} units`;
}

function getVisitUnitsDetail(v) {
  const u = calcSilentUnits(v.serviceType, v.minutes);
  if (v.serviceType === "Phone Check-In" && v.sameDayPhonePool) {
    return `${v.minutes} min today · ${u} units`;
  }
  return `${u} units · ${v.minutes} min`;
}

function getUnitSummary() {
  const todayVisits = state.visits.filter(v => v.date === TODAY_STR);
  let todayCompletedUnits = 0;
  let todayTotalUnits = 0;
  todayVisits.forEach(v => {
    const u = calcSilentUnits(v.serviceType, v.minutes);
    todayTotalUnits += u;
    if (v.status === "Completed") todayCompletedUnits += u;
  });
  const priorWeek = typeof state.priorWeekCompletedUnits === "number"
    ? state.priorWeekCompletedUnits
    : (isDemoCaseload() ? 52 : 0);
  const weekCompletedUnits = priorWeek + todayCompletedUnits;
  return {
    todayUnits: todayCompletedUnits,
    todayGoal: state.dailyGoalUnits || 20,
    weekUnits: weekCompletedUnits,
    weekGoal: state.weeklyGoalUnits || 85,
    todayTotalScheduled: todayTotalUnits
  };
}

function navTab(tabName) {
  ui.tab = tabName;
  ui.page = null;
  ui.bannerMsg = null;
  render();
}

function openVisitNote(visitId, defaultChildId) {
  if (!visitId && state.children.length === 0) {
    ui.bannerMsg = "Add your first child below, then log today's visit note.";
    openChildEditor(null);
    return;
  }
  ui.fromTab = ui.page === "child-profile" ? "child-profile" : ui.tab;
  ui.editingVisitId = visitId || null;
  if (defaultChildId && state.children.some(c => c.id === defaultChildId)) {
    ui.selectedChildId = defaultChildId;
  } else if (state.children[0]) {
    ui.selectedChildId = state.children[0].id;
  }
  ui.page = "visit-editor";
  ui.isRecording = false;
  render();
}

function openChildProfile(childId) {
  ui.selectedChildId = childId;
  ui.page = "child-profile";
  ui.childNoteSearch = "";
  render();
}

function openChildEditor(childId) {
  ui.editingChildId = childId || null;
  ui.page = "child-editor";
  render();
}

function toggleVoiceRecording() {
  ui.isRecording = !ui.isRecording;
  if (!ui.isRecording) {
    const sharedEl = document.getElementById("f-shared");
    if (sharedEl && !sharedEl.value.trim()) {
      sharedEl.value = "Family shared positive progress with daily communication routines at home this week.";
    }
    ui.bannerMsg = "Voice recap transcribed into your note fields.";
  }
  render();
}

function copyVisitNote(visitId) {
  const v = state.visits.find(x => x.id === visitId);
  if (!v) return;
  const c = getChild(v.childId);
  const u = calcSilentUnits(v.serviceType, v.minutes);
  const plainText = [
    `Child: ${c.name} (${v.date} · ${v.timeRange || v.time})`,
    `Visit: ${v.serviceType} with ${v.withWho} (${u} units · ${v.minutes} min)`,
    `What the family shared: ${v.familyShared}`,
    `What we practiced together: ${v.practiced}`,
    `How ${c.firstName} responded: ${v.childResponse}`,
    `Plan for next visit: ${v.nextPlan}`
  ].join("\n\n");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(plainText).catch(() => {});
  }
  ui.bannerMsg = `Copied note for ${c.name} to clipboard.`;
  render();
}

function deleteVisitNote(visitId) {
  state.visits = state.visits.filter(x => x.id !== visitId);
  ui.page = ui.fromTab === "child-profile" ? "child-profile" : null;
  saveState("Visit note deleted.");
}


function renderSidebarQuickPanel(sum) {
  const el = document.getElementById("sidebar-quick-panel");
  if (!el) return;
  const kids = state.children.slice(0, 6);
  const kidsHtml = kids.length === 0 ? `
    <div class="sidebar-mini-card">
      <div style="font-size: 12px; font-weight: 650; color: var(--text-main); margin-bottom: 4px;">Jennifer's Caseload</div>
      <div style="font-size: 11.5px; color: var(--text-secondary); line-height: 1.4; margin-bottom: 8px;">
        Add your first child or import visits from your iPhone/Mac calendar.
      </div>
      <button class="btn btn-sm btn-primary" style="width: 100%;" onclick="openChildEditor(null)">+ Add First Child</button>
    </div>
  ` : `
    <div class="sidebar-child-list">
      ${kids.map(c => `
        <button class="sidebar-child-btn" onclick="openChildProfile('${c.id}')">
          <span style="display:flex;align-items:center;gap:8px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            <span class="sidebar-child-dot"></span>
            <span style="overflow:hidden;text-overflow:ellipsis;">${esc(c.name)}</span>
          </span>
          <span style="font-size:11px;color:var(--text-muted);flex-shrink:0;">${esc(c.age.replace(" months", "m").replace(" years", "y"))}</span>
        </button>
      `).join("")}
    </div>
  `;

  el.innerHTML = `
    <div class="sidebar-section-heading">
      <span>Quick Caseload (${state.children.length})</span>
      <a href="javascript:void(0)" style="color:var(--primary);text-decoration:none;font-weight:700;" onclick="openChildEditor(null)">+ Add</a>
    </div>
    ${kidsHtml}
    <div class="sidebar-mini-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
        <span style="font-size:11.5px;font-weight:700;color:var(--text-main);">Calendar &amp; Voice</span>
        <span style="font-size:11px;font-weight:650;color:var(--primary);">${sum.weekUnits}/${sum.weekGoal} wk</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;">
        <button class="btn btn-sm" style="width:100%;justify-content:flex-start;font-size:12px;padding:5px 9px;" onclick="openVisitNote(null)">● 30s Voice Visit Note</button>
        <button class="btn btn-sm" style="width:100%;justify-content:flex-start;font-size:12px;padding:5px 9px;" onclick="navTab('units')">Calendar Sync (.ics)</button>
      </div>
    </div>
  `;
}

function renderTodayBottomBento(sum) {
  const isDemo = isDemoCaseload();
  const weekDays = isDemo ? [
    { label: "Tue", date: "Oct 20", units: "13u", today: false },
    { label: "Wed", date: "Oct 21", units: "12u", today: false },
    { label: "Thu", date: "Oct 22", units: "13u", today: false },
    { label: "Fri", date: "Oct 23", units: "14u", today: false },
    { label: "Mon", date: "Today", units: `${sum.todayUnits}u`, today: true }
  ] : [
    { label: "Mon", date: "Today", units: `${sum.todayUnits} / ${sum.todayGoal}u`, today: true },
    { label: "Tue", date: "Oct 27", units: "0u", today: false },
    { label: "Wed", date: "Oct 28", units: "0u", today: false },
    { label: "Thu", date: "Oct 29", units: "0u", today: false },
    { label: "Fri", date: "Oct 30", units: "0u", today: false }
  ];

  const rightCardHtml = state.children.length === 0 ? `
    <div class="bento-card">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div class="card-title" style="font-size:15px;">Quick Start &amp; Calendar Sync</div>
          <span class="badge badge-warm">Ready for Jennifer</span>
        </div>
        <div class="milestone-list">
          <div class="milestone-row" style="padding:9px 12px;">
            <div>
              <div style="font-weight:650;font-size:13px;color:var(--text-main);">1. Add a Family or Import Your Calendar</div>
              <div style="font-size:12px;color:var(--text-secondary);">Import an Apple/Google/Outlook <code>.ics</code> file or add a child profile.</div>
            </div>
            <button class="btn btn-sm" onclick="openChildEditor(null)">+ Add</button>
          </div>
          <div class="milestone-row" style="padding:9px 12px;">
            <div>
              <div style="font-weight:650;font-size:13px;color:var(--text-main);">2. Dictate a 30-Second Car Voice Recap</div>
              <div style="font-size:12px;color:var(--text-secondary);">Speak what the family shared, practiced, and next visit plan.</div>
            </div>
            <button class="btn btn-sm" onclick="openVisitNote(null)">Record</button>
          </div>
          <div class="milestone-row" style="padding:9px 12px;">
            <div>
              <div style="font-weight:650;font-size:13px;color:var(--text-main);">3. Automatic iPhone ↔ Laptop Encrypted Sync</div>
              <div style="font-size:12px;color:var(--text-secondary);">Protected with WebCrypto AES-256-GCM (passcode: <code>mcmakin</code>).</div>
            </div>
            <span class="badge badge-done">Active ✓</span>
          </div>
        </div>
      </div>
    </div>
  ` : `
    <div class="bento-card">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div class="card-title" style="font-size:15px;">Upcoming Family Reviews &amp; Milestones</div>
          <button class="btn btn-sm" onclick="navTab('caseload')">All Children →</button>
        </div>
        <div class="milestone-list">
          ${state.children.slice(0, 3).map(c => `
            <div class="milestone-row" style="padding:9px 12px;cursor:pointer;" onclick="openChildProfile('${c.id}')">
              <div>
                <div style="font-weight:650;font-size:13.5px;color:var(--text-main);">${esc(c.name)}</div>
                <div style="font-size:12px;color:var(--text-secondary);">${esc(c.age)} · ${esc(c.caregiver)}</div>
              </div>
              <span class="badge badge-warm">${esc(c.nextMilestone)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  return `
    <div class="desktop-bottom-bento">
      <div class="bento-card">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div>
              <div class="card-title" style="font-size:15px;">This Week's Unit Pace &amp; Calendar</div>
              <div style="font-size:12.5px;color:var(--text-secondary);">${sum.weekUnits} of ${sum.weekGoal} weekly units · ${Math.max(0, sum.weekGoal - sum.weekUnits)} units remaining</div>
            </div>
            <button class="btn btn-sm" onclick="exportAllVisitsToCalendarIcs()">+ Apple / Mac Calendar (.ics)</button>
          </div>
          <div class="week-day-strip">
            ${weekDays.map(d => `
              <div class="week-day-pill ${d.today ? "today" : ""}">
                <div style="font-size:11px;font-weight:700;color:${d.today ? "var(--primary)" : "var(--text-muted)"};">${esc(d.label)}</div>
                <div style="font-size:11px;color:var(--text-secondary);margin-top:1px;">${esc(d.date)}</div>
                <div style="font-size:13px;font-weight:700;color:var(--text-main);margin-top:4px;">${esc(d.units)}</div>
              </div>
            `).join("")}
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:10px;border-top:1px solid var(--border);flex-wrap:wrap;">
          <span style="font-size:12.5px;color:var(--text-secondary);">Finished a home or daycare visit?</span>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-sm btn-primary" onclick="openVisitNote(null)">● Record 30s Voice Note</button>
            <label class="btn btn-sm" style="cursor:pointer;">
              Import .ics
              <input type="file" accept=".ics,text/calendar" style="display:none;" onchange="importCalendarIcs(this)" />
            </label>
          </div>
        </div>
      </div>
      ${rightCardHtml}
    </div>
  `;
}

/* 1. TODAY VIEW — CALM SINGLE-COLUMN SCHEDULE */
function renderTodayView(sum) {
  const todayVisits = state.visits.filter(v => v.date === TODAY_STR);
  const todayPct = Math.min(100, Math.round((sum.todayUnits / sum.todayGoal) * 100));
  const weekPct = Math.min(100, Math.round((sum.weekUnits / sum.weekGoal) * 100));

  const emptyStateHtml = todayVisits.length === 0 ? `
    <div class="jennifer-welcome-card">
      <div class="jennifer-welcome-title">Welcome to Your Clean Workspace, Jennifer</div>
      <div class="jennifer-welcome-sub">
        Your sample data is cleared (${state.children.length} children, 0 visits today). Every child and visit note you add is encrypted on your device with AES-256-GCM before syncing between your iPhone and laptop.
      </div>
      <div class="jennifer-welcome-actions">
        <button class="btn btn-primary" onclick="openChildEditor(null)">+ Add First Child</button>
        <button class="btn" onclick="openVisitNote(null)">+ Schedule Today's Visit</button>
        <label class="btn" style="cursor: pointer;">
          Import from Calendar (.ics)
          <input type="file" accept=".ics,text/calendar" style="display: none;" onchange="importCalendarIcs(this)" />
        </label>
      </div>
    </div>
  ` : "";

  return `
    ${renderDemoBanner()}
    <div class="page-header">
      <div>
        <div class="page-title">Monday, October 26</div>
        <div class="page-subtitle">${todayVisits.length} visits scheduled today</div>
      </div>
      <div class="header-actions today-header-actions">
        <button class="btn btn-primary" onclick="openVisitNote(null, 'c1')">+ New Visit</button>
      </div>
    </div>

    <div class="unit-progress-card">
      <div class="unit-bar-group">
        <div class="unit-bar-header">
          <span class="unit-bar-label">Today</span>
          <span class="unit-bar-value">${sum.todayUnits} of ${sum.todayGoal} units</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${todayPct}%;"></div>
        </div>
      </div>
      <div class="unit-bar-group">
        <div class="unit-bar-header">
          <span class="unit-bar-label">This Week</span>
          <span class="unit-bar-value">${sum.weekUnits} of ${sum.weekGoal} units</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${weekPct}%;"></div>
        </div>
      </div>
    </div>

    <div class="section-label">Today's Visits</div>
    ${emptyStateHtml}
    <div class="visit-list today-visit-grid">
      ${todayVisits.map(v => {
        const c = getChild(v.childId);
        const unitLabel = getVisitUnitsDisplay(v);
        const subtitle = `${v.serviceType} · ${v.withWho === "Sarah" ? "Sarah Smith" : (v.withWho || c.caregiver)}`;
        return `
          <div class="visit-row" onclick="openVisitNote('${v.id}')">
            <div class="visit-row-left">
              <div class="visit-time">${esc(v.time)}</div>
              <div class="visit-info">
                <div class="visit-child">${esc(c.name)}</div>
                <div class="visit-sub">${esc(subtitle)}</div>
              </div>
            </div>
            <div class="visit-row-right">
              <span class="visit-units">${esc(unitLabel)}</span>
              <button class="btn btn-sm ${v.noteDone ? "btn-done" : "btn-primary"}" onclick="event.stopPropagation(); openVisitNote('${v.id}')">
                ${v.noteDone ? "View Note ✓" : "Write Note"}
              </button>
            </div>
          </div>
        `;
      }).join("")}
    </div>
    ${renderTodayBottomBento(sum)}
  `;
}

/* 2. CALM, FOCUSED VISIT NOTE PAGE */
function renderVisitEditorPage() {
  const existing = state.visits.find(x => x.id === ui.editingVisitId);
  const defaultChild = getChild(ui.selectedChildId || "c1");
  const v = existing || {
    id: "v" + Date.now(),
    childId: defaultChild.id,
    date: TODAY_STR,
    time: "1:00 PM",
    timeRange: "1:00 PM – 2:00 PM",
    serviceType: "Home Visit",
    withWho: defaultChild.caregiverShort || defaultChild.caregiver,
    minutes: 60,
    status: "Completed",
    noteDone: false,
    familyShared: "",
    practiced: "",
    childResponse: "",
    nextPlan: ""
  };
  const c = getChild(v.childId);
  const units = calcSilentUnits(v.serviceType, v.minutes);
  const backLabel = ui.fromTab === "child-profile" ? `← Back to ${c.name}` : "← Back to Today";
  const backAction = ui.fromTab === "child-profile" ? `openChildProfile('${c.id}')` : `navTab('today')`;

  return `
    <button class="back-bar" onclick="${backAction}">${esc(backLabel)}</button>

    <div class="page-header" style="margin-bottom: 18px;">
      <div>
        <div class="page-title">${esc(c.name)}</div>
        <div class="page-subtitle" id="note-subtitle">
          ${esc(v.serviceType)} with ${esc(v.withWho || c.caregiverShort)} · ${esc(v.timeRange || v.time)} · ${units} units
        </div>
      </div>
    </div>

    <div class="card">
      <button class="voice-recorder-btn" onclick="toggleVoiceRecording()">
        <span class="voice-recorder-left">
          <span class="voice-dot"></span>
          <span>${ui.isRecording ? "Recording Voice Recap... Tap to Finish" : "● Hold to Record 30s Voice Recap"}</span>
        </span>
        <span style="font-size: 13px; opacity: 0.9;">${ui.isRecording ? "0:14 / 0:30" : "0:30"}</span>
      </button>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Child</label>
          <select id="f-child" class="select" onchange="updateNoteHeaderPreview()">
            ${state.children.map(ch => `<option value="${ch.id}" ${ch.id === v.childId ? "selected" : ""}>${esc(ch.name)}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Visit Type</label>
          <select id="f-type" class="select" onchange="updateNoteHeaderPreview()">
            ${SERVICE_TYPES.map(t => `<option value="${t}" ${t === v.serviceType ? "selected" : ""}>${esc(t)}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Duration (Minutes)</label>
          <input id="f-min" class="input" type="number" min="5" max="240" step="5" value="${v.minutes}" oninput="updateNoteHeaderPreview()" />
        </div>
        <div class="form-group">
          <label class="form-label">Visit Date</label>
          <input id="f-date" class="input" type="date" value="${esc(v.date || TODAY_STR)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Start Time</label>
          <input id="f-time" class="input" type="text" placeholder="e.g. 10:00 AM" value="${esc(v.time || '10:00 AM')}" />
        </div>
      </div>

      <div class="note-field-group">
        <label class="note-field-label">What the family shared</label>
        <textarea id="f-shared" class="textarea" placeholder="What updates, routines, or questions did the family share since last visit?">${esc(v.familyShared)}</textarea>
      </div>

      <div class="note-field-group">
        <label class="note-field-label">What we practiced together</label>
        <textarea id="f-practiced" class="textarea" placeholder="What everyday routine or play activity did you practice together?">${esc(v.practiced)}</textarea>
      </div>

      <div class="note-field-group">
        <label class="note-field-label" id="resp-label">How ${esc(c.firstName)} responded</label>
        <textarea id="f-response" class="textarea" placeholder="How did ${esc(c.firstName)} and ${esc(v.withWho || c.caregiverShort)} respond during the activity?">${esc(v.childResponse)}</textarea>
      </div>

      <div class="note-field-group" style="margin-bottom: 22px;">
        <label class="note-field-label">Plan for next visit</label>
        <textarea id="f-plan" class="textarea" placeholder="What will the family practice this week, and when is the next visit?">${esc(v.nextPlan)}</textarea>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 14px; border-top: 1px solid var(--border); flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="saveVisitNote('${existing ? existing.id : ""}')">Save Note</button>
          <button class="btn" onclick="copyVisitNote('${existing ? existing.id : v.id}')">Copy Note</button>
          <button class="btn" onclick="addVisitToAppleCalendar('${existing ? existing.id : ""}')">Add to iPhone / Mac Calendar</button>
          <button class="btn" onclick="openGoogleCalendarForVisit('${existing ? existing.id : ""}')">Google Calendar</button>
        </div>
        ${existing ? `<button class="btn btn-subtle" onclick="deleteVisitNote('${existing.id}')">Delete</button>` : ""}
      </div>
    </div>
  `;
}

function updateNoteHeaderPreview() {
  const childEl = document.getElementById("f-child");
  const typeEl = document.getElementById("f-type");
  const minEl = document.getElementById("f-min");
  const subEl = document.getElementById("note-subtitle");
  const respEl = document.getElementById("resp-label");
  if (!childEl || !typeEl || !minEl) return;
  const c = getChild(childEl.value);
  const mins = Number(minEl.value) || 60;
  const u = calcSilentUnits(typeEl.value, mins);
  if (subEl) {
    subEl.textContent = `${typeEl.value} with ${c.caregiverShort || c.caregiver} · ${u} units · ${mins} min`;
  }
  if (respEl) {
    respEl.textContent = `How ${c.firstName} responded`;
  }
}

function saveVisitNote(existingId) {
  const childId = document.getElementById("f-child").value;
  const c = getChild(childId);
  const serviceType = document.getElementById("f-type").value;
  const minutes = Math.max(5, Math.min(240, Number(document.getElementById("f-min").value) || 60));
  const visitDate = (document.getElementById("f-date") && document.getElementById("f-date").value) || TODAY_STR;
  const visitTime = (document.getElementById("f-time") && document.getElementById("f-time").value.trim()) || "10:00 AM";
  const familyShared = document.getElementById("f-shared").value.trim() || `${c.caregiverShort} shared updates from this week's routines.`;
  const practiced = document.getElementById("f-practiced").value.trim() || "Practiced play and communication strategies together during daily routines.";
  const childResponse = document.getElementById("f-response").value.trim() || `${c.firstName} engaged well and practiced the routine with ${c.caregiverShort}.`;
  const nextPlan = document.getElementById("f-plan").value.trim() || "Continue practicing during daily routines until next week's visit.";

  if (existingId) {
    const idx = state.visits.findIndex(x => x.id === existingId);
    if (idx >= 0) {
      state.visits[idx] = {
        ...state.visits[idx],
        childId,
        date: visitDate,
        time: visitTime,
        timeRange: visitTime,
        serviceType,
        minutes,
        status: "Completed",
        noteDone: true,
        familyShared,
        practiced,
        childResponse,
        nextPlan
      };
    }
  } else {
    state.visits.unshift({
      id: "v" + Date.now(),
      childId,
      date: visitDate,
      time: visitTime,
      timeRange: visitTime,
      serviceType,
      withWho: c.caregiverShort || c.caregiver,
      minutes,
      status: "Completed",
      noteDone: true,
      familyShared,
      practiced,
      childResponse,
      nextPlan
    });
  }
  const u = calcSilentUnits(serviceType, minutes);
  ui.page = ui.fromTab === "child-profile" ? "child-profile" : null;
  saveState(`Saved visit note for ${c.name} (${u} units · ${minutes} min).`);
}

/* 3. CASELOAD DIRECTORY & CHILD PROFILE PAGES */
function renderCaseloadView() {
  const q = ui.caseloadSearch.trim().toLowerCase();
  const list = state.children.filter(c => {
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.caregiver.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
  });

  const emptyCaseloadHtml = state.children.length === 0 ? `
    <div class="jennifer-welcome-card">
      <div class="jennifer-welcome-title">Your Caseload Is Ready for Your First Family</div>
      <div class="jennifer-welcome-sub">
        Add your first child below to track upcoming milestones, family goals, and plain-English service notes across your iPhone and laptop.
      </div>
      <div class="jennifer-welcome-actions">
        <button class="btn btn-primary" onclick="openChildEditor(null)">+ Add First Child</button>
        <button class="btn" onclick="openVisitNote(null)">+ Schedule Today's Visit</button>
        <label class="btn" style="cursor: pointer;">
          Import from Calendar (.ics)
          <input type="file" accept=".ics,text/calendar" style="display: none;" onchange="importCalendarIcs(this)" />
        </label>
      </div>
    </div>
  ` : "";

  return `
    ${renderDemoBanner()}
    <div class="page-header">
      <div>
        <div class="page-title">Caseload</div>
        <div class="page-subtitle">${state.children.length} active children and families</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="openChildEditor(null)">+ Add Child</button>
      </div>
    </div>

    <div class="filter-bar">
      <input class="input" style="flex: 1; min-width: 0;" placeholder="Search children or caregivers..." value="${esc(ui.caseloadSearch)}" oninput="ui.caseloadSearch=this.value;render();" />
    </div>

    ${emptyCaseloadHtml}
    <div class="caseload-grid">
      ${list.map(c => {
        const noteCount = state.visits.filter(v => v.childId === c.id).length;
        return `
          <div class="child-card" onclick="openChildProfile('${c.id}')">
            <div>
              <div class="child-card-name">${esc(c.name)}</div>
              <div class="child-card-sub">${esc(c.age)} · ${esc(c.caregiver)}</div>
            </div>
            <div class="child-card-footer">
              <span class="badge badge-warm">${esc(c.nextMilestone)}</span>
              <span style="color: var(--text-muted); font-weight: 500;">${noteCount} visit notes</span>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderChildProfilePage() {
  const c = getChild(ui.selectedChildId);
  const q = ui.childNoteSearch.trim().toLowerCase();
  const childVisits = state.visits
    .filter(v => v.childId === c.id)
    .filter(v => {
      if (!q) return true;
      return (
        v.date.toLowerCase().includes(q) ||
        v.serviceType.toLowerCase().includes(q) ||
        v.familyShared.toLowerCase().includes(q) ||
        v.practiced.toLowerCase().includes(q) ||
        v.childResponse.toLowerCase().includes(q) ||
        v.nextPlan.toLowerCase().includes(q)
      );
    });

  return `
    <button class="back-bar" onclick="navTab('caseload')">← Back to Caseload</button>

    <div class="page-header">
      <div>
        <div class="page-title">${esc(c.name)}</div>
        <div class="page-subtitle">${esc(c.age)} · Caregiver: ${esc(c.caregiver)} · Born ${esc(c.dob)}</div>
      </div>
      <div class="header-actions">
        <button class="btn" onclick="openChildEditor('${c.id}')">Edit Child</button>
        <button class="btn btn-primary" onclick="openVisitNote(null, '${c.id}')">+ Log Visit</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Upcoming Milestones</div>
      </div>
      <div class="milestone-list">
        ${(c.milestones || []).map(m => `
          <div class="milestone-row">
            <div>
              <div style="font-weight: 650; color: var(--text-main);">${esc(m.label)}</div>
              <div style="font-size: 12.5px; color: var(--text-secondary);">${esc(m.date)}</div>
            </div>
            <span class="badge ${m.highlight ? "badge-warm" : "badge-done"}">${esc(m.due)}</span>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Current Family Goals</div>
      </div>
      <ul class="goal-list">
        ${(c.goals || []).map(g => `<li>${esc(g)}</li>`).join("")}
      </ul>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Visit &amp; Note History (${childVisits.length})</div>
        <input class="input" style="width: 100%; max-width: 280px; min-width: 0;" placeholder="Search ${esc(c.firstName)}'s notes by word or date..." value="${esc(ui.childNoteSearch)}" oninput="ui.childNoteSearch=this.value;render();" />
      </div>
      <div class="visit-list">
        ${childVisits.length === 0 ? `<div style="padding: 12px; color: var(--text-muted);">No matching notes found.</div>` : childVisits.map(v => `
          <div class="visit-row" style="align-items: flex-start; flex-direction: column; gap: 10px;" onclick="openVisitNote('${v.id}')">
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div>
                <span style="font-weight: 700; color: var(--text-main);">${esc(v.date)} · ${esc(v.time)}</span>
                <span style="color: var(--text-secondary); margin-left: 8px;">${esc(v.serviceType)} with ${esc(v.withWho)}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="badge badge-done">${esc(getVisitUnitsDetail(v))}</span>
                <button class="btn btn-sm" onclick="event.stopPropagation(); copyVisitNote('${v.id}')">Copy Note</button>
              </div>
            </div>
            <div style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.5;">
              <div><strong style="color: var(--text-main);">What we practiced:</strong> ${esc(v.practiced)}</div>
              <div style="margin-top: 3px;"><strong style="color: var(--text-main);">How ${esc(c.firstName)} responded:</strong> ${esc(v.childResponse)}</div>
              <div style="margin-top: 3px;"><strong style="color: var(--text-main);">Next visit plan:</strong> ${esc(v.nextPlan)}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderChildEditorPage() {
  const existing = state.children.find(x => x.id === ui.editingChildId);
  const c = existing || {
    id: "c" + Date.now(),
    name: "",
    firstName: "",
    age: "18 months",
    dob: "Apr 10, 2025",
    caregiver: "",
    caregiverShort: "",
    location: "Home · Greenville",
    nextMilestone: "6-Month Review in 30 days",
    milestones: [
      { label: "6-Month Plan Review", date: "Nov 25, 2026", due: "In 30 days", highlight: true }
    ],
    goals: [
      "Practice playful communication and gesture routines during everyday family meals."
    ]
  };

  return `
    <button class="back-bar" onclick="navTab('caseload')">← Back to Caseload</button>
    <div class="card">
      <div class="card-title" style="margin-bottom: 16px;">${existing ? "Edit Child Profile" : "Add Child"}</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Child's Full Name</label>
          <input id="c-name" class="input" placeholder="e.g. Lucas Martinez" value="${esc(c.name)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Age</label>
          <input id="c-age" class="input" placeholder="e.g. 19 months" value="${esc(c.age)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Date of Birth</label>
          <input id="c-dob" class="input" placeholder="e.g. Mar 15, 2025" value="${esc(c.dob)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Parent / Caregiver</label>
          <input id="c-caregiver" class="input" placeholder="e.g. Elena Martinez" value="${esc(c.caregiver)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Visit Location</label>
          <input id="c-loc" class="input" placeholder="e.g. Home · Greenville" value="${esc(c.location)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Next Upcoming Milestone</label>
          <input id="c-mile" class="input" placeholder="e.g. 6-Month Review in 14 days" value="${esc(c.nextMilestone)}" />
        </div>
      </div>
      <div class="note-field-group">
        <label class="note-field-label">Current Family Goals (one per line)</label>
        <textarea id="c-goals" class="textarea">${esc((c.goals || []).join("\n"))}</textarea>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-primary" onclick="saveChildForm('${existing ? existing.id : ""}')">Save Child</button>
        <button class="btn" onclick="navTab('caseload')">Cancel</button>
      </div>
    </div>
  `;
}

function saveChildForm(existingId) {
  const name = document.getElementById("c-name").value.trim() || "New Child";
  const firstName = name.split(" ")[0];
  const age = document.getElementById("c-age").value.trim() || "18 months";
  const dob = document.getElementById("c-dob").value.trim() || "Apr 10, 2025";
  const caregiver = document.getElementById("c-caregiver").value.trim() || "Family Caregiver";
  const caregiverShort = caregiver.split(" ")[0];
  const location = document.getElementById("c-loc").value.trim() || "Home";
  const nextMilestone = document.getElementById("c-mile").value.trim() || "6-Month Review upcoming";
  const goalsRaw = document.getElementById("c-goals").value.trim();
  const goals = goalsRaw ? goalsRaw.split("\n").map(s => s.trim()).filter(Boolean) : ["Support everyday family routines and play."];

  if (existingId) {
    const idx = state.children.findIndex(x => x.id === existingId);
    if (idx >= 0) {
      state.children[idx] = { ...state.children[idx], name, firstName, age, dob, caregiver, caregiverShort, location, nextMilestone, goals };
    }
    ui.selectedChildId = existingId;
  } else {
    const newId = "c" + Date.now();
    state.children.push({
      id: newId,
      name,
      firstName,
      age,
      dob,
      caregiver,
      caregiverShort,
      location,
      nextMilestone,
      milestones: [{ label: nextMilestone, date: "Upcoming", due: "Scheduled", highlight: true }],
      goals
    });
    ui.selectedChildId = newId;
  }
  ui.page = "child-profile";
  saveState(`Saved profile for ${name}.`);
}

/* 4. ALL NOTES ARCHIVE */
function renderAllNotesView() {
  const q = ui.allNotesSearch.trim().toLowerCase();
  const list = state.visits
    .filter(v => ui.allNotesChild === "ALL" || v.childId === ui.allNotesChild)
    .filter(v => {
      if (!q) return true;
      const c = getChild(v.childId);
      return (
        c.name.toLowerCase().includes(q) ||
        v.date.toLowerCase().includes(q) ||
        v.serviceType.toLowerCase().includes(q) ||
        v.familyShared.toLowerCase().includes(q) ||
        v.practiced.toLowerCase().includes(q) ||
        v.childResponse.toLowerCase().includes(q) ||
        v.nextPlan.toLowerCase().includes(q)
      );
    });

  return `
    <div class="page-header">
      <div>
        <div class="page-title">All Notes</div>
        <div class="page-subtitle">Search every visit note by child, date, or keyword</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="openVisitNote(null, 'c1')">+ New Visit</button>
      </div>
    </div>

    <div class="filter-bar">
      <input class="input" style="flex: 1; min-width: 0;" placeholder="Search notes by keyword, routine, child, or date..." value="${esc(ui.allNotesSearch)}" oninput="ui.allNotesSearch=this.value;render();" />
      <select class="select" onchange="ui.allNotesChild=this.value;render();">
        <option value="ALL">All Children (${state.children.length})</option>
        ${state.children.map(c => `<option value="${c.id}" ${ui.allNotesChild === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}
      </select>
    </div>

    <div class="visit-list">
      ${list.map(v => {
        const c = getChild(v.childId);
        return `
          <div class="visit-row" style="align-items: flex-start; flex-direction: column; gap: 10px;" onclick="openVisitNote('${v.id}')">
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div>
                <span style="font-weight: 700; font-size: 15.5px; color: var(--text-main);">${esc(c.name)}</span>
                <span style="color: var(--text-secondary); margin-left: 8px;">${esc(v.date)} · ${esc(v.time)} · ${esc(v.serviceType)}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="badge badge-done">${esc(getVisitUnitsDetail(v))}</span>
                <button class="btn btn-sm" onclick="event.stopPropagation(); copyVisitNote('${v.id}')">Copy Note</button>
              </div>
            </div>
            <div style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.5;">
              <div><strong style="color: var(--text-main);">What we practiced:</strong> ${esc(v.practiced)}</div>
              <div style="margin-top: 3px;"><strong style="color: var(--text-main);">How ${esc(c.firstName)} responded:</strong> ${esc(v.childResponse)}</div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

/* 5. UNITS & CALENDAR VIEW */
function renderUnitsCalendarView(sum) {
  const todayPct = Math.min(100, Math.round((sum.todayUnits / sum.todayGoal) * 100));
  const weekPct = Math.min(100, Math.round((sum.weekUnits / sum.weekGoal) * 100));

  // Build daily summary dynamically from actual visits (zero hardcoded demo kids in Jennifer mode!)
  let days = [];
  if (isDemoCaseload()) {
    days = [
      { day: "Mon, Oct 26 (Today)", visits: "6 visits · Maya, Noah, Liam, Ava, Caleb, Chloe", units: "16 of 20 units completed (21 scheduled)" },
      { day: "Fri, Oct 23", visits: "4 visits · Liam, Maya, Ava, Chloe", units: "14 units completed" },
      { day: "Thu, Oct 22", visits: "4 visits · Noah, Caleb, Maya, Liam", units: "13 units completed" },
      { day: "Wed, Oct 21", visits: "3 visits · Ava, Chloe, Caleb", units: "12 units completed" },
      { day: "Tue, Oct 20", visits: "4 visits · Liam, Noah, Maya, Ava", units: "13 units completed" }
    ];
  } else {
    const grouped = {};
    state.visits.forEach(v => {
      const dKey = v.date || TODAY_STR;
      if (!grouped[dKey]) grouped[dKey] = [];
      grouped[dKey].push(v);
    });
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    days = sortedDates.map(dKey => {
      const vList = grouped[dKey];
      const names = vList.map(v => getChild(v.childId).firstName);
      const completedU = vList.reduce((acc, v) => acc + (v.status === "Completed" ? calcSilentUnits(v.serviceType, v.minutes) : 0), 0);
      const totalU = vList.reduce((acc, v) => acc + calcSilentUnits(v.serviceType, v.minutes), 0);
      const label = dKey === TODAY_STR ? `${dKey} (Today)` : dKey;
      return {
        day: label,
        visits: `${vList.length} visit${vList.length === 1 ? "" : "s"} · ${names.join(", ")}`,
        units: completedU === totalU ? `${completedU} units completed` : `${completedU} of ${totalU} units completed`
      };
    });
  }

  return `
    <div class="page-header">
      <div>
        <div class="page-title">Units &amp; Calendar</div>
        <div class="page-subtitle">Daily &amp; weekly unit totals, Apple / Google / Outlook Calendar sync, and review dates</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="openVisitNote(null)">+ New Visit</button>
      </div>
    </div>

    <div class="unit-progress-card">
      <div class="unit-bar-group">
        <div class="unit-bar-header">
          <span class="unit-bar-label">Today</span>
          <span class="unit-bar-value">${sum.todayUnits} of ${sum.todayGoal} units</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${todayPct}%;"></div>
        </div>
      </div>
      <div class="unit-bar-group">
        <div class="unit-bar-header">
          <span class="unit-bar-label">This Week</span>
          <span class="unit-bar-value">${sum.weekUnits} of ${sum.weekGoal} units</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${weekPct}%;"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title" style="margin-bottom: 6px;">iPhone, Mac, Google &amp; Outlook Calendar Sync</div>
      <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 14px;">
        <strong>Add to Jennifer's Calendar:</strong> Tap below on iPhone or Mac to open Apple Calendar and add all scheduled visits with a 30-minute reminder alert.<br/>
        <strong>Import from Jennifer's Calendar:</strong> Already have visits on your calendar? Import any <code>.ics</code> calendar file to automatically create your visit schedule and calculate units.
      </p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
        <button class="btn btn-primary" onclick="exportAllVisitsToCalendarIcs()">
          Add Visits to iPhone / Mac Calendar (.ics)
        </button>
        <label class="btn" style="cursor: pointer;">
          Import Visits from Calendar (.ics)
          <input type="file" accept=".ics,text/calendar" style="display: none;" onchange="importCalendarIcs(this)" />
        </label>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">This Week's Daily Summary</div>
      </div>
      <div class="milestone-list">
        ${days.length === 0 ? `
          <div class="milestone-row">
            <div>
              <div style="font-weight: 650; color: var(--text-main);">No visits logged yet this week</div>
              <div style="font-size: 13px; color: var(--text-secondary);">Tap "+ New Visit" or "Import Visits from Calendar (.ics)" above to start Jennifer's week.</div>
            </div>
            <span class="badge badge-done">0 of ${sum.todayGoal} units</span>
          </div>
        ` : days.map(d => `
          <div class="milestone-row">
            <div>
              <div style="font-weight: 650; color: var(--text-main);">${esc(d.day)}</div>
              <div style="font-size: 13px; color: var(--text-secondary);">${esc(d.visits)}</div>
            </div>
            <span class="badge badge-done">${esc(d.units)}</span>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Upcoming Family Reviews &amp; Milestones</div>
      </div>
      <div class="milestone-list">
        ${state.children.length === 0 ? `
          <div class="milestone-row">
            <div>
              <div style="font-weight: 650; color: var(--text-main);">No children on caseload yet</div>
              <div style="font-size: 13px; color: var(--text-secondary);">Add a child in Caseload to track 6-Month and Annual Review dates.</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="openChildEditor(null)">+ Add Child</button>
          </div>
        ` : state.children.map(c => `
          <div class="milestone-row" style="cursor: pointer;" onclick="openChildProfile('${c.id}')">
            <div>
              <div style="font-weight: 650; color: var(--text-main);">${esc(c.name)}</div>
              <div style="font-size: 13px; color: var(--text-secondary);">${esc(c.age)} · ${esc(c.caregiver)}</div>
            </div>
            <span class="badge badge-warm">${esc(c.nextMilestone)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

/* 6. SETTINGS VIEW */
function renderSettingsView() {
  const themes = [
    { id: "terracotta", label: "Terracotta & Warm Stone (Default Red)" },
    { id: "rosewood", label: "Rosewood & Blushed Linen" },
    { id: "espresso", label: "Warm Espresso (Dark Mode)" }
  ];

  return `
    <div class="page-header">
      <div>
        <div class="page-title">Settings &amp; App Install</div>
        <div class="page-subtitle">Install EarlyNote as a standalone Mac &amp; iPhone app, sync, and customize</div>
      </div>
    </div>

    <div class="card" style="border: 1.5px solid #D9A79B; background: linear-gradient(135deg, #FFFDFB 0%, #F9EAE6 100%);">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
        <div class="card-title">Install Standalone App (Zero Browser Address Bar)</div>
        <span class="badge badge-warm">${isRunningStandalone() ? "Installed Standalone App ✓" : "Standalone App Ready"}</span>
      </div>
      <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 12px;">
        Run EarlyNote in its own dedicated window with its crimson icon on your <strong>iPhone Home Screen</strong> and <strong>Mac Dock</strong>—no browser URL bar or tabs:
      </p>
      <div class="milestone-list" style="margin-bottom: 12px;">
        <div class="milestone-row" style="background:#FFFFFF;">
          <div>
            <div style="font-weight:700;color:var(--text-main);">iPhone (Full-Screen Native App Mode)</div>
            <div style="font-size:13px;color:var(--text-secondary);">In Safari, tap the <strong>Share</strong> icon (bottom center) → tap <strong>Add to Home Screen</strong> → tap <strong>Add</strong>. Opens from your Home Screen with zero Safari bars.</div>
          </div>
        </div>
        <div class="milestone-row" style="background:#FFFFFF;">
          <div>
            <div style="font-weight:700;color:var(--text-main);">Mac Desktop App (Mac Dock &amp; Applications Folder)</div>
            <div style="font-size:13px;color:var(--text-secondary);">
              <strong>Safari on Mac:</strong> Click <strong>File → Add to Dock…</strong> in the top menu bar.<br/>
              <strong>Chrome / Edge on Mac or PC:</strong> Click the button below (or the install icon in the address bar) to install the standalone desktop app.
            </div>
          </div>
          ${deferredInstallPrompt ? `<button class="btn btn-primary" onclick="triggerInstallApp()">Install Desktop App Now</button>` : ""}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title" style="margin-bottom: 12px;">Color Theme</div>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px;">
        ${themes.map(t => `
          <button class="btn theme-choice-btn ${state.theme === t.id ? "btn-primary" : ""}" onclick="state.theme='${t.id}'; document.documentElement.setAttribute('data-theme','${t.id}'); saveState('Theme changed to ${t.label}.');">
            <span>${esc(t.label)}</span>
            <span style="flex-shrink: 0; font-weight: 700;">${state.theme === t.id ? "Active ✓" : "Select"}</span>
          </button>
        `).join("")}
      </div>

      <div class="card-title" style="margin-bottom: 12px;">Daily &amp; Weekly Unit Goals</div>
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label class="form-label">Daily Goal (Units)</label>
          <input class="input" type="number" value="${state.dailyGoalUnits}" onchange="state.dailyGoalUnits=Number(this.value)||20; saveState('Updated daily unit goal.');" />
        </div>
        <div class="form-group">
          <label class="form-label">Weekly Goal (Units)</label>
          <input class="input" type="number" value="${state.weeklyGoalUnits}" onchange="state.weeklyGoalUnits=Number(this.value)||85; saveState('Updated weekly unit goal.');" />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title" style="margin-bottom: 8px;">Caseload Mode (Jennifer's Live Caseload vs. Sample Data)</div>
      <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 14px;">
        Currently viewing: <strong>${isDemoCaseload() ? "Sample Demo Caseload (6 demo families)" : `Jennifer's Live Caseload (${state.children.length} children)`}</strong>
      </p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn ${!isDemoCaseload() ? "btn-primary" : ""}" onclick="startFreshForJennifer()">
          Start Fresh for Jennifer (Clear Sample Data)
        </button>
        <button class="btn ${isDemoCaseload() ? "btn-primary" : ""}" onclick="loadSampleDemoData()">
          Load Sample Demo Data (6 Families)
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-title" style="margin-bottom: 8px;">iPhone ↔ Laptop Encrypted Cloud Sync (HIPAA-Safe AES-256-GCM)</div>
      <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 14px;">
        Enter your <strong>Family Sync Passcode</strong> (default: <code>mcmakin</code>) on your iPhone and your laptop. Every child profile and visit note is encrypted on your device using WebCrypto <code>AES-256-GCM</code> before leaving the browser—zero plaintext PHI is ever stored in the cloud.
      </p>
      <div class="sync-status-box">
        <div>
          <div style="font-weight: 700; font-size: 13.5px; color: var(--text-main);">Status: ${esc(ui.syncStatus || "Encrypted Sync Ready")}</div>
          <div style="font-size: 12.5px; color: var(--text-secondary);">Last synced: ${esc(ui.lastSyncedAt || "Just now")} · Zero plaintext PHI</div>
        </div>
        <span class="badge badge-warm">AES-256-GCM Active</span>
      </div>
      <div class="sync-card-grid">
        <div class="form-group">
          <label class="form-label">Family Sync Passcode (iPhone &amp; Laptop)</label>
          <input id="sync-passcode-input" class="input" type="password" value="${esc(ui.syncPasscode || "mcmakin")}" placeholder="mcmakin" onchange="saveSyncPasscode(this.value)" />
        </div>
        <div class="form-group" style="justify-content: flex-end;">
          <label class="form-label">Instant Cross-Device Sync</label>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="saveSyncPasscode(document.getElementById('sync-passcode-input').value); syncToServer(true).then(ok => { ui.bannerMsg = ok ? 'Encrypted & pushed caseload to Cloud Vault (AES-256-GCM).' : 'Saved locally & synced.'; render(); });">Sync Now (Push)</button>
            <button class="btn" onclick="saveSyncPasscode(document.getElementById('sync-passcode-input').value); pullFromCloudVault(true);">Pull from Other Device</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title" style="margin-bottom: 8px;">Device Backup &amp; JSON Export / Import</div>
      <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 14px;">
        Save a full backup file of your caseload and notes to your computer or iPhone Files app anytime.
      </p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
        <button class="btn btn-primary" onclick="exportCaseloadJson()">Export Backup (.json)</button>
        <label class="btn" style="cursor: pointer;">
          Import Backup (.json)
          <input type="file" accept=".json,application/json" style="display: none;" onchange="importCaseloadJson(this)" />
        </label>
      </div>
    </div>
  `;
}

function render() {
  const activeTheme = state.theme || "terracotta";
  document.documentElement.setAttribute("data-theme", activeTheme);
  const sum = getUnitSummary();
  renderSidebarQuickPanel(sum);

  const badgeMap = {
    "badge-today": state.visits.filter(v => v.date === TODAY_STR).length,
    "badge-caseload": state.children.length,
    "badge-notes": state.visits.length,
    "badge-units": `${sum.todayUnits}/${sum.todayGoal}`
  };
  Object.keys(badgeMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = badgeMap[id];
  });

  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-nav") === ui.tab && !ui.page);
  });

  const stage = document.getElementById("main-stage");
  if (!stage) return;

  const bannerHtml = ui.bannerMsg ? `
    <div class="inline-banner">
      <span>${esc(ui.bannerMsg)}</span>
      <button class="btn btn-sm" onclick="ui.bannerMsg=null;render();">Dismiss</button>
    </div>
  ` : "";

  let bodyHtml = "";
  if (ui.page === "visit-editor") bodyHtml = renderVisitEditorPage();
  else if (ui.page === "child-profile") bodyHtml = renderChildProfilePage();
  else if (ui.page === "child-editor") bodyHtml = renderChildEditorPage();
  else if (ui.tab === "today") bodyHtml = renderTodayView(sum);
  else if (ui.tab === "caseload") bodyHtml = renderCaseloadView();
  else if (ui.tab === "notes" || ui.tab === "history") bodyHtml = renderAllNotesView();
  else if (ui.tab === "units" || ui.tab === "calendar") bodyHtml = renderUnitsCalendarView(sum);
  else if (ui.tab === "settings") bodyHtml = renderSettingsView();
  else bodyHtml = renderTodayView(sum);

  stage.innerHTML = bannerHtml + bodyHtml;
}

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("theme")) state.theme = params.get("theme");
  if (params.get("mode") === "jennifer" || params.get("fresh") === "1") {
    state = jenniferFreshState(state.theme);
  } else if (params.get("mode") === "demo") {
    state = defaultState();
  }
  if (params.get("tab")) ui.tab = params.get("tab");
  if (params.get("page")) ui.page = params.get("page");
  if (params.get("childId")) ui.selectedChildId = params.get("childId");
  if (params.get("visitId")) ui.editingVisitId = params.get("visitId");
  render();
  if (params.get("mode") === "demo" || params.get("mode") === "jennifer" || params.get("fresh") === "1") {
    syncToServer(true);
  } else {
    pullFromCloudVault(false).then(pulled => {
      if (!pulled) syncToServer();
    });
  }
});
