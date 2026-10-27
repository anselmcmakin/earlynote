# 04 — Palmetto EI Companion: Deep-Dive Blueprint on Boutique Field-App UX, Zero-Entry Calendar Intelligence & Complete South Carolina EI Workflows

**Document ID:** `EI-GOLD-04`  
**Prepared For:** Ansel ("Chef") McMakin, Jennifer M. McMakin (SC Early Interventionist), & `Palmetto EI Builder` (`c90f53cd-a138-47a4-9b66-d5195377acbd`)  
**Date:** October 26, 2026 (America/New_York, UTC-4)  
**Scope:** Builds directly past `01-SC-BabyNet-DDSN-Gold-Standard.md`, `02-HIPAA-Privacy-Pricing-And-MVP-Gold-Standard.md`, and `03-Template-Caseload-Guide.md`.  
**Hard Constraints Enforced Throughout:**
1. **Zero Dollar Amounts Anywhere in UI:** Per Chef's explicit rule (`v2` feedback), the app never displays `$` signs, Medicaid per-unit dollar rates, or earnings figures. It tracks **Units** (`4 Units • 60 min`, `12 / 16 Units Today`, `68 / 85 Units This Week`) and **Minutes** exclusively.
2. **Warm, High-Craft Pediatric Specialist Aesthetic + Calm Single-Screen Mobile Drill-Down:** Per Chef's `v3` feedback, desktop keeps the 3-column workstation layout (`Caseload Sidebar` | `Today's Schedule / Child Workspace` | `Active Visit Recorder & Note`), while mobile (`< 768px`) never stacks the schedule and recorder on the same vertical scroll—using single-screen native drill-down (`Today` $\rightarrow$ full-screen `Visit Recorder` with `< Today's Schedule`; `Caseload` $\rightarrow$ full-screen `Child Workspace` with `< Caseload`) and warm tonal palettes (Warm Oat & Eucalyptus Sage, Soft Sand & Terracotta, or French Lavender & Oat).
3. **100% Zero-PHI Cloud Footprint:** All real names, DOBs, addresses, and Medicaid/BRIDGES IDs remain in the local encrypted vault on the EI's devices and are synced across phone and laptop via client-side WebCrypto `AES-256-GCM` E2EE blobs.

---

## PART 1 — CREATIVE & FUNCTIONAL APP-BUILDING TECHNIQUES (DESKTOP + MOBILE FIELD COMPANION)

To justify a `$35/month` individual subscription (`$29/seat/month` agency tier) to non-technical Early Interventionists who spend 4–5 hours a day driving rural and suburban South Carolina roads and 2–3 hours logging into `BRIDGES` and `Therap`, **Palmetto EI Companion** must feel like a calm, tactile, native consumer product—never like a cluttered medical EHR or spreadsheet.

---

### 1.1 Best-in-Class UI/UX Patterns, Micro-Interactions & Clinical Scribe Workflows

Below is a product-by-product deconstruction of the exact interaction patterns from **Things 3**, **Linear**, **Notion Calendar (Cron)**, **Freed AI / Heidi Health**, **Superhuman**, and **Day One / Bear**, translated into concrete features and CSS/JS engineering specs for Palmetto EI Companion:

#### A. Comparative Pattern Matrix (Inspiration $\rightarrow$ Palmetto EI Companion Implementation)

| Reference App | Signature UX Pattern | Why Users Love It | Exact Adaptation in Palmetto EI Companion | Desktop vs. Mobile Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Things 3** *(Cultured Code)* | **1. Radial Progress Pie Rings**<br>**2. "Today" vs. "This Evening" Split**<br>**3. Magic Plus (`+`) Button**<br>**4. Natural-Language Date Parser** | Turns overwhelming task lists into calm, finite daily buckets; radial pies show progress without noisy percentage text. | • **Unit & Monthly Contact Progress Pies:** 18px SVG stroke-dashoffset ring beside each child's name showing monthly FT units completed (`3/4 visits` = 75% ring) and a top-bar daily ring (`12 / 16 Units`).<br>• **"Morning / Afternoon Route" vs. "Evening Desk Triage":** Visits happen in the field; uncopied `BRIDGES`/`Therap` notes sit in a calm *"Desk Wrap-Up (2 Notes Ready to Paste)"* tray at the bottom of Today.<br>• **Natural-Language Quick Intake:** Typing `"Noah B dob 8/19/25 intake 9/18"` auto-parses dates and previews the 45-day deadline (`Nov 2, 2026`) live. | **Desktop:** Radial pie in left sidebar + keyboard date parser.<br>**Mobile:** Floating bottom-right action pill (`+ Quick Log / Voice`) that morphs into a bottom sheet when tapped or dragged onto a visit slot. |
| **Linear** | **1. `Cmd+K` Command Palette**<br>**2. Optimistic Zero-Latency Local Sync**<br>**3. Single-Key Triage Shortcuts**<br>**4. Status Pill Micro-Transitions** | Zero loading spinners; every click responds in `<16ms` because reads/writes hit local `IndexedDB` first. | • **`Cmd+K` Instant Jump Bar:** Type `liam` $\rightarrow$ jump to Liam Smith's timeline; type `pwn` $\rightarrow$ generate Liam's 7-day Prior Written Notice PDF; type `12:45` $\rightarrow$ test military-time unit math.<br>• **Single-Key Desktop Workstation Flow:** When reviewing a generated note on laptop, press `C` to Copy for BRIDGES, `M` to mark Entered in BRIDGES, `J` to advance to the next unentered note.<br>• **Zero Skeleton Screens:** All caseload, timeline, and schedule views hydrate synchronously from local storage in `<10ms`. | **Desktop:** Full `Cmd+K` modal + single-key shortcuts (`C`, `M`, `J`, `K`, `R`).<br>**Mobile:** Instant local view transitions (`cubic-bezier(0.22, 1, 0.36, 1)` 240ms slide-over) with zero network wait. |
| **Notion Calendar (Cron)** | **1. 3-Pane Time-Block + Context Inspector**<br>**2. Menu-Bar / Header Live Countdown**<br>**3. Inline Event $\rightarrow$ Note Creation**<br>**4. Travel/Buffer Gap Visualization** | Connects the *calendar block* directly to the *work artifact* so you never create a note from scratch. | • **Header Next-Visit Pill:** `"Next: Liam S. Home Visit in 18m • 12:45–13:45 (24h Noon Rule Active)"`.<br>• **Auto-Calculated Drive-Time & Mileage Connectors:** Between `9:00–10:00 Maya (Daycare)` and `10:30–11:08 Noah (Home)`, renders a subtle dotted route connector: `🚗 14 min drive • 6.8 mi (Added to SC Mileage Log)`.<br>• **1-Click Event Hydration:** Clicking any calendar block immediately opens the pre-filled Visit Recorder with start/end time, CMS units (`4 Units • 60m`), and that child's active IFSP Outcomes loaded. | **Desktop:** 3-pane layout (`Caseload` \| `Today's Route` \| `Visit Recorder Inspector`).<br>**Mobile:** `Today` tab shows only the clean chronological cards + drive gaps; tapping a card drills into the full-screen `Visit Recorder`. |
| **Freed AI & Heidi Health** | **1. 1-Tap Car-Seat Dictation**<br>**2. Split "Voice + Context $\rightarrow$ Clinical Note"**<br>**3. Inline "Magic Edit / Compliance" Pills**<br>**4. Section-by-Section Copy Buttons**<br>**5. Instant Template Switching** | Clinicians don't want to chat with a bot; they want to talk for 35 seconds and get a finished, audit-proof note with 1-click copy buttons for each EHR box. | • **Pre-Dictation Outcome Prompt Card:** Directly above the microphone button, shows a compact 2-line reminder of the child's active IFSP Outcomes (*"Outcome 1: 10 words at snack • Outcome 2: Pincer grasp"*) so the tired EI doesn't have to remember outcome numbers while talking.<br>• **1-Tap Magic Refine Pills:** Below the generated note: `[+ Strengthen Parent Coaching (EI-427)]`, `[Split Make-Up Log]`, `[Switch to T1016 Collateral]`, `[Condense]`.<br>• **Granular Copy & Auto-Fill:** Individual `[Copy Narrative]`, `[Copy Time: 12:45–13:45]`, `[Copy Outcomes]` buttons alongside `[⚡ Copy Full BRIDGES Packet]`. | **Desktop:** Side-by-side Transcript/Context + Structured 4-Part Note with per-field copy buttons.<br>**Mobile:** Full-screen Car-Seat Recorder with a `72px` thumb-zone Mic button, live waveform, and instant 4-part card preview. |
| **Superhuman** | **1. Split Inbox Triage Tabs**<br>**2. `Cmd+Enter` "Copy & Mark Done"**<br>**3. "Zero Unbilled Notes" Celebration** | Turns tedious administrative backlog into a fast, satisfying triage game with a clear "Inbox Zero" finish line. | • **3-Way Caseload Filter Pills:** `All (24)` \| `Urgent ≤14d (5)` \| `Unentered Notes (2)`.<br>• **`Cmd+Enter` Power Action:** Copies the formatted service note to clipboard, stamps `"Copied & Logged in BRIDGES at 4:42 PM"`, increments the weekly unit bar (`68 → 72 / 85 Units`), and auto-advances to the next pending visit.<br>• **End-of-Day Calm State:** When all today's visits are signed/copied, displays a warm botanical illustration: *"All 21 units documented & audit-verified for Monday."* | **Desktop:** `Cmd+Enter` rapid BRIDGES paste workflow.<br>**Mobile:** Swipe-right on a completed visit card to mark `"Logged in BRIDGES"`. |
| **Day One & Bear** | **1. Automatic Context Stamp (Location / Weather / Mileage)**<br>**2. Warm Editorial Typography**<br>**3. Quick-Tap Metadata Tags** | Feels like a personal craft journal rather than corporate software; captures context automatically at the moment of entry. | • **Automatic Natural Environment & Mileage Stamp:** Tapping "Start Visit" or "Record Note" auto-tags `#home-visit` (POS `12`), `#daycare` (POS `99`), or `#phone-sc` (`T1016`), and logs round-trip mileage for tax/agency reimbursement.<br>• **Editorial Typography & Warm Surfaces:** Uses `Fraunces` or `Instrument Serif` for warm greeting headers, `Plus Jakarta Sans` / `Inter` for clean clinical legibility, and `JetBrains Mono` strictly for time/unit badges (`12:45–13:45 • 4u`). | **Desktop & Mobile:** Identical warm tonal themes (`Warm Oat & Sage`, `Terracotta Sand`, `French Lavender`) with zero cold hospital grays. |

---

#### B. Exact CSS, Spring Physics, Haptics & "Car-Seat One-Thumb" Ergonomics Spec

To solve Chef's `v3` feedback (*"I like the desktop version. But the mobile looks really cluttered. Also the color scheme isnt the most pleasing"*), `Palmetto EI Builder` should implement these exact UI engineering rules:

1. **The "Car-Seat One-Thumb Zone" Rule (Mobile `< 768px`):**
   - When Jennifer finishes a home visit and sits in her car in a driveway in Powdersville or Anderson, she is holding her phone in one hand.
   - **Strict Single-Screen View Hierarchy:** Mobile has a fixed bottom tab bar (`Today` | `Caseload` | `Forms & Tools`) that is `64px` tall (`+ env(safe-area-inset-bottom)`).
   - **Zero Stacked Panels:** On Mobile `Today`, the user sees **only**:
     1. A warm, compact header with Today's Date and a single **Unit Progress Pill** (`15 / 20 Units Today • 68 / 85 Wk`).
     2. A horizontal **Urgent Deadlines Strip** (only if items are due $\le 7$ days, e.g., `⚠️ Liam S. PWN Due in 4d`).
     3. The clean vertical list of **Today's Visit Cards** (each card has max 3 data points: Time + Units badge, Child Name + Program pill, Location/Outcome subtitle, and a single right-aligned action pill: `🎙️ Record` or `✓ Done`).
   - **Full-Screen Slide-Over Drill-Down:** Tapping any visit card slides in the dedicated **Full-Screen Visit Recorder** (`transform: translateX(0)`, `transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1)`). In this view, the bottom 45% of the screen is the **Thumb Zone**:
     - Service Type toggle pills (`T1027 Family Training` | `T1016 Service Coord` | `+ Make-Up Split`).
     - Interactive Time & Unit stepper (`12:45 – 13:45` $\rightarrow$ `60 min • 4 Units` with automatic 24h noon badge).
     - Giant `72px × 72px` central **Tap & Talk Microphone Button** with a warm breathing halo (`@keyframes pulse-ring`).
2. **Tactile Haptic Feedback (`navigator.vibrate` + iOS Capacitor Haptics):**
   - Trigger a subtle `10ms` light impact (`Haptics.impact({ style: ImpactStyle.Light })` or `navigator.vibrate?.(10)`) on:
     - Starting/stopping voice recording.
     - Crossing a CMS 8-Minute Rule unit threshold while adjusting end time (e.g., rolling from `22 min (1 Unit)` to `23 min (2 Units)` or `52 min (3 Units)` to `53 min (4 Units)`).
     - Tapping `Copy for BRIDGES` (double pulse `[12, 40, 20]` confirming the note is on the clipboard).
3. **Warm Tonal Color Tokens (Replacing Cold Hospital Teal/Slate):**
   - Every surface should use warm, organic paper undertones that reduce eye strain at 8:30 PM:

```css
/* Theme 1: Warm Oat & Eucalyptus Sage (Default Nurturing Studio Palette) */
:root[data-theme="oat-sage"] {
  --bg-canvas: #FBF8F3;        /* Warm sunlit oat paper */
  --bg-surface: #FFFFFF;       /* Crisp warm card surface */
  --bg-subtle: #F3EFE6;        /* Soft linen secondary container */
  --bg-elevated: #FAF6EE;      /* Hover / active card state */
  --border-hairline: #E6DFD3;  /* Warm sand border (never cold #E2E8F0) */
  --text-primary: #1F2421;     /* Deep espresso-charcoal */
  --text-secondary: #5A625C;   /* Muted herb slate */
  --text-muted: #878E88;       /* Warm stone */
  --accent-primary: #2E6B56;   /* Deep Eucalyptus Sage */
  --accent-soft: #E6F2ED;      /* Mint-cream pill background */
  --accent-warm: #C86D51;      /* Terracotta clay for active mic / highlights */
  --status-ok-bg: #E8F3EC;     --status-ok-text: #235D43;
  --status-warn-bg: #FDF3DF;   --status-warn-text: #945B10; /* Amber <=14d */
  --status-urgent-bg: #FCEAE6; --status-urgent-text: #A63424; /* Coral-red <=7d */
  --shadow-card: 0 2px 8px -2px rgba(31, 36, 33, 0.06), 0 1px 2px rgba(31, 36, 33, 0.04);
  --radius-card: 16px;
  --radius-pill: 9999px;
}
```

---

### 1.2 Smart "Auto-Build From User Data" & Zero-Data-Entry Calendar-to-Caseload Engine

Early Interventionists already live in **Google Calendar** or **Apple Calendar (iCloud)** on their phones to schedule home visits with parents, daycare visits, and IFSP team calls. Requiring an EI to manually re-enter their daily schedule into our app is unnecessary friction.

Instead, **Palmetto EI Companion** turns the EI's existing calendar into a **Zero-Data-Entry Caseload & Billing Engine**.

#### A. End-to-End Architecture Diagram (Google Calendar + Apple iCloud Calendar $\rightarrow$ Local Roster Matcher)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        1. CALENDAR INGESTION LAYER (READ-ONLY)                      │
│                                                                                     │
│  ┌───────────────────────────────┐         ┌─────────────────────────────────────┐  │
│  │ Google Calendar API v3        │         │ Apple iCloud Calendar               │  │
│  │ • OAuth2 Scope:               │         │ • Path A (Web/Desktop): CalDAV      │  │
│  │   `calendar.events.readonly`  │         │   (`caldav.icloud.com` via `tsdav`  │  │
│  │ • Incremental Delta Sync via  │         │   with App-Specific Password) OR    │  │
│  │   `syncToken` + `events.watch`│         │   1-Click Read-Only `webcal://` ICS │  │
│  │   webhook push notification   │         │ • Path B (iOS App): Native EventKit │  │
│  └───────────────┬───────────────┘         └──────────────────┬──────────────────┘  │
└──────────────────┼────────────────────────────────────────────┼─────────────────────┘
                   └──────────────────────┬─────────────────────┘
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│            2. ON-DEVICE FUZZY ENTITY RESOLUTION & CLASSIFICATION ENGINE             │
│                 (Runs 100% in Local Browser/Phone Worker — Zero PHI Sent Out)       │
│                                                                                     │
│  Raw Event: "12:45 PM – 1:45 PM | L.S. Home Visit (Snack words)" @ "142 Oak St"     │
│                                                                                     │
│  Step A: Cancel/No-Show Detector -> Checks `status === 'cancelled'` or title regex  │
│          `/(cancel|no[\s-]?show|sick|resched)/i` -> Flags for 10-Day Letter / MakeUp│
│  Step B: Child Roster Matcher    -> Scores against Local Vault (`Liam Smith`,       │
│          initials `L.S.`, nickname `Liam`, address `142 Oak St`, parent `Sarah`)    │
│  Step C: Service & Template Map  -> Maps keywords (`Home Visit` -> `T1027-TL`,      │
│          `IFSP` -> `T1018-TL`, `Call/Coord/SLP` -> `T1016-TL`, `Make-Up` -> Split)  │
└─────────────────────────────────────────┬───────────────────────────────────────────┘
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│               3. AUTO-STAGED DAILY WORKSPACE (ZERO MANUAL DATA ENTRY)               │
│                                                                                     │
│  1. Chronological Visit Queue + Drive-Time/Mileage Gaps (`6.8 mi between stops`)    │
│  2. Exact Start/End Time (`12:45–13:45` 24h Noon Rule) + CMS 8-Min Units (`4u`)     │
│  3. Collision & Cap Guard (`Flags overlapping times or >16u daily cap`)             │
│  4. Pre-Loaded IFSP Outcomes #1 & #2 + Caregiver Name ("Sarah") above Mic Button    │
│  5. Unmatched Event Triage Card ("New calendar event 'K.M. Eval' -> 1-Tap Add")     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### B. Connecting Google Calendar & Apple iCloud Calendar Safely
1. **Google Calendar Integration:**
   - Uses Google Identity Services OAuth 2.0 PKCE flow requesting strictly **read-only** scope: `https://www.googleapis.com/auth/calendar.events.readonly`.
   - Performs an initial `GET https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=...&singleEvents=true` (setting `singleEvents=true` automatically expands recurring weekly home-visit series `RRULE:FREQ=WEEKLY;BYDAY=MO` into individual daily instances and respects rescheduled single-instance exceptions!).
   - Stores `nextSyncToken` in `IndexedDB` so subsequent refreshes fetch **only changed events** in `<120ms`.
2. **Apple iCloud Calendar Integration (Two Frictionless Options):**
   - **Option 1 (Zero-Password 1-Click `webcal://` Private Feed — Fastest for EIs):** In Apple Calendar on iPhone or Mac, the EI taps the `(i)` icon next to her *"Work / EI Visits"* calendar $\rightarrow$ toggles *Public Calendar* $\rightarrow$ *Share Link* (`webcal://p12-caldav.icloud.com/published/2/...`). She pastes that single URL into Palmetto EI Companion. Our app fetches and parses the `.ics` VEVENT stream via `ical.js` every 5 minutes (and on pull-to-refresh).
   - **Option 2 (CalDAV via `tsdav` or Native iOS EventKit):** On web/desktop, connects to `https://caldav.icloud.com` using `tsdav` (`DAVClient` with `REPORT calendar-query` time-range filter) and an Apple App-Specific Password; on the native iOS Capacitor build, uses `@capacitor-community/calendar` (`EventKit`) to read the local iOS calendar directly on-device with a single iOS permission prompt and **zero network configuration**.

#### C. Production TypeScript Implementation: The Calendar-to-Caseload Fuzzy Entity Matcher & 8-Minute Unit Engine

Because EIs write shorthand on their calendars to protect privacy (e.g., `"L.S. HV"`, `"Liam S - home"`, `"10:30 Noah B daycare"`, `"M.T. 33m Transition Conf"`, `"Ava R. (45m reg + 30m makeup)"`), a simple exact-string match will fail. Below is the exact, copy-pasteable TypeScript engine for `Palmetto EI Builder` that resolves initials, first name + last initial, parent/daycare names, and street addresses, while computing CMS 8-Minute Rule units, BRIDGES 12:00 PM military time, and time-overlap collisions:

```typescript
// /src/engine/calendarMatcher.ts

export interface ChildRosterItem {
  id: string;
  firstName: string;         // e.g., "Liam"
  lastName: string;          // e.g., "Smith"
  preferredName?: string;    // e.g., "LJ"
  program: 'BABYNET' | 'DDSN';
  dob: string;               // YYYY-MM-DD
  caregiverName: string;     // e.g., "Sarah Smith"
  homeAddress?: string;      // e.g., "142 Oak St, Powdersville, SC"
  daycareName?: string;      // e.g., "Sunshine Sprouts"
  activeOutcomes: Array<{ number: number; domain: string; summary: string }>;
}

export interface RawCalendarEvent {
  uid: string;
  title: string;             // e.g., "L.S. Home Visit (Snack words)"
  description?: string;
  location?: string;         // e.g., "142 Oak St" or "Sunshine Sprouts"
  startIso: string;          // e.g., "2026-10-26T12:45:00-04:00"
  endIso: string;            // e.g., "2026-10-26T13:45:00-04:00"
  calendarStatus?: 'confirmed' | 'tentative' | 'cancelled';
}

export type ServiceCodeType = 'T1027-TL' | 'T1016-TL' | 'T1018-TL' | 'NON_BILLABLE';

export interface StagedVisitCard {
  eventUid: string;
  matchStatus: 'MATCHED' | 'AMBIGUOUS' | 'UNMATCHED_INTAKE_CANDIDATE';
  matchedChildId: string | null;
  candidateChildIds: string[];
  matchConfidence: number;   // 0.0 to 1.0
  matchReason: string;
  serviceCode: ServiceCodeType;
  noteTemplate: 'FT_HOME_VISIT' | 'FT_DAYCARE' | 'SC_MONTHLY_CONTACT' | 'IFSP_MEETING' | 'TRANSITION_CONF' | 'NO_SHOW_CANCEL';
  posCode: '12' | '99' | '11' | '02'; // 12=Home, 99=Community/Daycare, 11=Office, 02=Telehealth/Phone
  isCancelledOrNoShow: boolean;
  cancelReason?: 'CHILD_SICK' | 'FAMILY_CANCEL' | 'PROVIDER_CANCEL' | 'NO_SHOW';
  isMakeUpVisit: boolean;
  requiresMakeUpSplit: boolean;
  regularMinutes: number;
  makeUpMinutes: number;
  totalMinutes: number;
  cmsUnits: number;          // Strictly Units (Zero dollar amounts!)
  regularUnits: number;
  makeUpUnits: number;
  bridgesStartTime: string;  // Enforces 24h military time across 12:00 PM - 1:00 PM
  bridgesEndTime: string;
  crossedNoonHour: boolean;
  hasTimeOverlapCollision: boolean;
  overlappingEventUids: string[];
}

/**
 * Official CMS / SC Medicaid 15-Minute Timed Code ("8-Minute Rule") Unit Calculator
 * Strictly returns integer units (0 to 16) with ZERO dollar amounts.
 */
export function calculateCms15MinUnits(minutes: number): {
  units: number;
  auditWarning: string | null;
} {
  if (minutes <= 0) return { units: 0, auditWarning: null };
  if (minutes < 8) {
    return {
      units: 0,
      auditWarning:
        'Under 8 minutes (0 single-session units). Log exact time — never pad a 5–7 min call to 8 min (OIDD Ch. 3).',
    };
  }
  // CMS 8-Minute Rule formula: floor((minutes + 7) / 15), capped at 16 units (240 mins BRIDGES daily max)
  const rawUnits = Math.floor((minutes + 7) / 15);
  const cappedUnits = Math.min(rawUnits, 16);
  const auditWarning =
    rawUnits > 16
      ? 'Exceeds BRIDGES 240-minute (16-unit) daily hard cap (effective Sept 3, 2025).'
      : null;
  return { units: cappedUnits, auditWarning };
}

/**
 * Formats start/end times for BRIDGES, automatically enforcing the mandatory
 * 24-Hour Military Time rule whenever an activity touches the 12:00 PM – 1:00 PM hour.
 */
export function formatBridgesTimeRange(start: Date, end: Date): {
  bridgesStartTime: string;
  bridgesEndTime: string;
  crossedNoonHour: boolean;
} {
  const sH = start.getHours();
  const sM = start.getMinutes();
  const eH = end.getHours();
  const eM = end.getMinutes();

  // Touches or spans 12:00 PM (hour 12) to 1:00 PM (hour 13)
  const crossedNoonHour =
    sH === 12 || eH === 12 || (sH < 12 && eH >= 12);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const to24h = (h: number, m: number) => `${pad(h)}:${pad(m)}`;
  const to12h = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${pad(m)} ${period}`;
  };

  if (crossedNoonHour) {
    return {
      bridgesStartTime: to24h(sH, sM),
      bridgesEndTime: to24h(eH, eM),
      crossedNoonHour: true,
    };
  }
  return {
    bridgesStartTime: to12h(sH, sM),
    bridgesEndTime: to12h(eH, eM),
    crossedNoonHour: false,
  };
}

/**
 * Multi-Signal Fuzzy Entity Resolution: Matches shorthand calendar titles
 * ("L.S. HV", "Liam S.", "10:30 Noah @ Sunshine Sprouts") to the local Child Roster.
 */
export function matchEventToChildRoster(
  event: RawCalendarEvent,
  roster: ChildRosterItem[]
): {
  status: 'MATCHED' | 'AMBIGUOUS' | 'UNMATCHED_INTAKE_CANDIDATE';
  bestChildId: string | null;
  candidates: Array<{ childId: string; score: number; reason: string }>;
} {
  const text = `${event.title} ${event.description || ''}`.trim();
  const loc = (event.location || '').toLowerCase();
  const scored: Array<{ childId: string; score: number; reason: string }> = [];

  for (const child of roster) {
    let score = 0;
    const reasons: string[] = [];
    const f = child.firstName.trim();
    const l = child.lastName.trim();
    const fInit = f[0].toUpperCase();
    const lInit = l[0].toUpperCase();

    // 1. Exact Full Name ("Liam Smith") -> 0.98
    const fullNameRegex = new RegExp(`\\b${f}\\s+${l}\\b`, 'i');
    if (fullNameRegex.test(text)) {
      score = Math.max(score, 0.98);
      reasons.push('Full name match');
    }

    // 2. First Name + Last Initial ("Liam S." or "Liam S") -> 0.92
    const firstLastInitRegex = new RegExp(`\\b${f}\\s+${lInit}(?:\\.|\\b)`, 'i');
    if (firstLastInitRegex.test(text)) {
      score = Math.max(score, 0.92);
      reasons.push(`First name + last initial (${f} ${lInit}.)`);
    }

    // 3. Exact First Name ("Liam") -> 0.78
    const firstOnlyRegex = new RegExp(`\\b${f}\\b`, 'i');
    if (score < 0.78 && firstOnlyRegex.test(text)) {
      score = Math.max(score, 0.78);
      reasons.push(`First name (${f})`);
    }

    // 4. Shorthand Initials ("L.S.", "L. S.", "[LS]", "LS -") -> 0.72
    const initialsRegex = new RegExp(
      `(?:^|[\\s\\[\\(])${fInit}\\.?\\s*${lInit}\\.?(?=[\\s\\]\\)\\-:halb]|$)`,
      'i'
    );
    if (score < 0.72 && initialsRegex.test(text)) {
      score = Math.max(score, 0.72);
      reasons.push(`Initials (${fInit}.${lInit}.)`);
    }

    // 5. Location / Daycare / Caregiver Boost (+0.20 disambiguation boost!)
    if (
      child.homeAddress &&
      loc.length > 4 &&
      child.homeAddress.toLowerCase().includes(loc.split(',')[0].trim())
    ) {
      score = Math.min(1.0, score + 0.22);
      reasons.push('Home address match');
    }
    if (
      child.daycareName &&
      (loc.includes(child.daycareName.toLowerCase()) ||
        text.toLowerCase().includes(child.daycareName.toLowerCase()))
    ) {
      score = Math.min(1.0, score + 0.20);
      reasons.push(`Daycare match (${child.daycareName})`);
    }

    if (score >= 0.65) {
      scored.push({ childId: child.id, score, reason: reasons.join(' + ') });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return { status: 'UNMATCHED_INTAKE_CANDIDATE', bestChildId: null, candidates: [] };
  }
  // Check if two children share the same initials (e.g., "L.S." matches Liam Smith & Luke Sanders)
  if (scored.length > 1 && scored[0].score - scored[1].score < 0.12) {
    return { status: 'AMBIGUOUS', bestChildId: scored[0].childId, candidates: scored };
  }
  return { status: 'MATCHED', bestChildId: scored[0].childId, candidates: scored };
}
```

#### D. What Happens Automatically Once Calendar Events Match:
1. **Chronological Route + IRS/Agency Mileage Gap Calculation:**
   - Events are sorted chronologically. For consecutive visits with locations (`142 Oak St, Powdersville` $\rightarrow$ `Sunshine Sprouts, Easley`), the app computes driving distance (via cached local Haversine/road-factor `1.28x` or OpenStreetMap OSRM route lookup) and renders a quiet pill between cards: `🚗 6.4 mi • ~12 min drive`. At month-end, 1 click exports the **SC EI Mileage Log CSV** (Date, Origin, Destination, Visit Purpose, Miles) with zero manual odometer typing.
2. **Automatic Make-Up Split & Overlapping Collision Guard:**
   - If the calendar event title says `"Ava R. (45m reg + 30m make-up)"` or duration is `> 60 minutes` (`75 mins = 5 units`) with the word `"make-up"`, the engine automatically pre-splits the visit into **Log A (`14:00–14:45 • 45m • 3 Units Regular`)** and **Log B (`14:45–15:15 • 30m • 2 Units Make-Up [BRIDGES Checkbox Checked]`)**.
   - If two calendar events overlap by even 1 minute (e.g., `10:00–11:00` and `10:45–11:15`), a high-visibility coral pill warns: `⚠️ BRIDGES Overlap Block: 10:45–11:00 collides with Noah B.`
3. **1-Tap "Unmatched Calendar Event $\rightarrow$ Link Alias or Create Intake" Card:**
   - If the EI puts `"2:00 PM - Baby J.P. Intake"` on her Google Calendar and `J.P.` isn't in her roster yet, the app shows a calm amber card: *"Unmatched Calendar Visit: 'Baby J.P. Intake' (2:00–3:00 PM) — `[Link to Existing Child]` or `[+ Create New 45-Day Intake]`"*. Once linked, that shorthand alias is remembered forever in the local vault.

---

### 1.3 Offline-First Car-to-Laptop Sync, Rural Dead-Zone Audio Buffering & Zero-PHI/HIPAA Architecture

Early Interventionists serving Upstate South Carolina (rural Pickens, Oconee, Anderson, Abbeville, Laurens, or northern Greenville County) frequently finish a home visit in a dead zone with `1 bar` or `No Service`. Yet when they walk into their house at 4:30 PM and open their laptop, they expect every voice note recorded in the car to be waiting for them on the desktop screen.

Here is the exact technical architecture that achieves **instant car-to-laptop sync** while maintaining a **Zero-Knowledge / Zero-PHI Cloud Server** (so our server never possesses plaintext child names, DOBs, audio, or decryption keys):

#### A. Storage & Sync Stack (`IndexedDB` + `OPFS` + `WebCrypto AES-256-GCM` E2EE Relay)

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│  1. MOBILE PHONE IN RURAL DEAD ZONE (Powdersville / Pickens / Anderson Driveway)  │
│                                                                                   │
│  • EI taps Mic -> `MediaRecorder` (`audio/webm;codecs=opus` or `audio/mp4`, 24kbps│
│    mono = ~180 KB per 60-sec dictation).                                          │
│  • Audio chunks stream every 1,000ms directly into Origin Private File System     │
│    (`navigator.storage.getDirectory()` / `OPFS`) + `Dexie.js` IndexedDB queue     │
│    (`status: 'QUEUED_OFFLINE'`). Zero data lost even if browser/OS Force-Quits!   │
│  • On-Device Transcription (Web Speech / iOS SpeechAnalyzer / Whisper WebGPU) OR  │
│    queued for automatic transcription the second cell signal returns.             │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │
            Cell Signal Returns -> Encrypts Delta Locally Before Upload
         `WebCrypto AES-256-GCM` (256-bit Master Key from QR Pairing / Passphrase)
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│  2. DUMB ZERO-KNOWLEDGE SYNC RELAY (Cloudflare R2/D1 or Supabase Sync Table)      │
│                                                                                   │
│  • Stores ONLY opaque ciphertext rows:                                            │
│    `{ user_id, record_id, updated_at, iv_base64, ciphertext_base64, hmac }`       │
│  • Server NEVER has the `AES-256-GCM` CryptoKey.                                  │
│  • Even under full database dump or subpoena, server contains 0% readable PHI.    │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │
              WebSocket / SSE Push -> Laptop Pulls & Decrypts in `<80ms`
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│  3. LAPTOP WORKSTATION AT HOME (Logged into `BRIDGES` / `Therap` Side-by-Side)    │
│                                                                                   │
│  • Decrypts `ciphertext_base64` locally in browser RAM using shared `CryptoKey`.  │
│  • Re-hydrates `[CHILD]` -> `"Liam Smith"` and `[CAREGIVER]` -> `"Sarah Smith"`.  │
│  • EI presses `Cmd+Enter` -> Copies 12-Point Note to Clipboard & Marks Billed!    │
└───────────────────────────────────────────────────────────────────────────────────┘
```

#### B. How 1-Time Device Pairing Works (Zero Technical Friction for the EI)
1. **First Launch on Phone or Laptop:** When Jennifer logs in with her email (`jennifer@...`), the app generates a random 256-bit `AES-GCM` Master Vault Key in the browser's `WebCrypto` subsystem and stores it in `IndexedDB` (protected by FaceID/TouchID WebAuthn PRF or derived via `PBKDF2-SHA256` 600,000 iterations from her 6-digit Sync PIN / Recovery Phrase).
2. **Instant QR Pairing ("Link Phone & Laptop"):** Clicking *"Link Phone"* on the laptop displays a dynamic QR code containing a one-time ephemeral ECDH key-exchange token (`P-256`). Scanning the QR code with the phone transfers the `AES-256-GCM` Master Key directly device-to-device with **zero server visibility**.
3. **Copy-Pasteable `WebCrypto` E2EE Sync Wrapper (`e2eeVaultSync.ts`):**

```typescript
// /src/sync/e2eeVaultSync.ts
// Zero-Knowledge Client-Side AES-256-GCM Encryption for Car-to-Laptop Sync

export interface EncryptedSyncEnvelope {
  recordId: string;
  recordType: 'CHILD_ROSTER' | 'VISIT_NOTE' | 'TIMELINE_STATE' | 'MILEAGE_LOG';
  version: number;
  updatedAtIso: string;
  ivBase64: string;         // 96-bit (12-byte) random IV per write
  ciphertextBase64: string; // AES-256-GCM encrypted JSON + 128-bit auth tag
}

export async function deriveVaultKeyFromPassphrase(
  passphrase: string,
  userEmailSalt: string
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase.normalize('NFKC')),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(`palmetto-ei-v1:${userEmailSalt.toLowerCase()}`),
      iterations: 600_000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false, // non-extractable from RAM once derived
    ['encrypt', 'decrypt']
  );
}

export async function encryptForCloudSync<T>(
  key: CryptoKey,
  recordId: string,
  recordType: EncryptedSyncEnvelope['recordType'],
  version: number,
  plaintextPayload: T
): Promise<EncryptedSyncEnvelope> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(plaintextPayload));
  const encryptedBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  return {
    recordId,
    recordType,
    version,
    updatedAtIso: new Date().toISOString(),
    ivBase64: btoa(String.fromCharCode(...iv)),
    ciphertextBase64: btoa(String.fromCharCode(...new Uint8Array(encryptedBuf))),
  };
}

export async function decryptFromCloudSync<T>(
  key: CryptoKey,
  envelope: EncryptedSyncEnvelope
): Promise<T> {
  const iv = Uint8Array.from(atob(envelope.ivBase64), (c) => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(
    atob(envelope.ciphertextBase64),
    (c) => c.charCodeAt(0)
  );
  const decryptedBuf = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return JSON.parse(new TextDecoder().decode(decryptedBuf)) as T;
}
```

#### C. Rural Dead-Zone Audio Buffering & Zero-Audio-Retention Scrubbing
- **Chunked OPFS Persistence During Recording:** Instead of waiting until the user presses "Stop" to save audio in volatile RAM (which iOS Safari purges if a phone call interrupts the recording!), `MediaRecorder.start(1000)` fires `ondataavailable` every `1,000ms` and appends each chunk directly to an Origin Private File System (`OPFS`) file (`visit_${visitId}.webm`). If the EI gets a call from a parent mid-dictation, the first 28 seconds are already safely persisted on disk and can be resumed with 1 tap.
- **Automatic Ephemeral Scrubbing After Note Sign-Off:** Per Freed AI / Heidi Health privacy best practices and `EI-GOLD-02`, as soon as the structured note is generated and approved by the EI, the raw `.webm` audio file in `OPFS` is overwritten and unlinked (`fileHandle.remove()`), leaving zero biometric voice recordings on the device.

---

## PART 2 — DEEP DIVE ON EVERYTHING SOUTH CAROLINA EARLY INTERVENTION (WORKFLOWS, OFFICIAL FORMS, ASSESSMENTS, BILLING & OPEN TOOLS)

This section goes beyond `EI-GOLD-01` (`01-SC-BabyNet-DDSN-Gold-Standard.md`) to provide a **complete operational and technical inventory** of every real-world form, attachment, assessment protocol, MCO prior authorization workflow, missed-visit / 10-day letter safeguard, and open-source API integration that South Carolina Early Interventionists deal with across **BabyNet (`BRIDGES`, Birth–3)** and **SC BHDD-OIDD / DDSN (`Therap` & `CDSS`, Ages 3–6)**.

---

### 2.1 Complete Inventory of Official SC BabyNet (Part C, Birth–3) Forms (`scdhhs.gov/babynet-forms`)

We audited the entire official SC DHHS BabyNet Forms repository (`https://scdhhs.gov/resources/programs-and-initiatives/babynet/providers/babynet-forms`), including the **May–June 2026 revised forms**. Every form below is available in English and Spanish and can be auto-populated on-device by `Palmetto EI Companion` using `pdf-lib` (zero server upload):

| Form ID / Code | Official SC BabyNet Form Title | Latest Revision Verified | When Required / Statutory Trigger (`ACIS` / `IDEA Part C`) | Required Fields & Checkboxes on Official PDF | How Palmetto EI Companion Automates It |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`BN-F01`** | **Prior Written Notice and Meeting Notification** *(English & Spanish)* | `01/18/2021` *(Active)* | **`ACIS EI-402, EI-403, EI-404`:**<br>1. Prior to Screening, Evaluation, or Assessment.<br>2. **At least 7 Calendar Days prior** to Initial IFSP, 6-Month Review, Annual IFSP, Formal Change Review, or Transition Conference (**Family CANNOT waive 7-day notice!** Appointment may be held sooner than 7d *only* at parent's documented request).<br>3. **7-Day Record Closure Notice** (Unable to contact / Missed intake appointments / Ineligible / Parent withdrawal). | • **Section 1:** Date of Notice, From (SC Name, Address, Email, Phone), To (Parent, Address, Email, Child's Name).<br>• **Section 2 (Left Column — Appointment Needed):** Checkboxes for *Orientation/Intake, Screening, Initial/Annual Eligibility Eval, Initial/Annual Family Assessment, Initial/Annual Child Assessment, Initial IFSP, Annual IFSP, Review/Revision of IFSP, Transition Conference*, plus Appointment Date, Time, Location.<br>• **Section 2 (Right Column — 7-Day Record Closure):** Checkboxes for *Unable to contact, Missed appointments, Declined eval, Not eligible, No longer interested*.<br>• Must attach *Parent Notice of Family Rights & Safeguards*. | **1-Click Pre-Filled PDF at `Due_Date - 10d`:** Auto-stamps SC contact info, Parent/Child info, checks the exact meeting box (e.g., `6-Month Review` or `Annual IFSP`), calculates `Notice Date <= Meeting Date - 7d`, and logs the PWN issuance note for `BRIDGES`. |
| **`BN-F02`** | **Consent for Screening, Evaluation, and Assessment** *(English & Spanish)* | `03/19/2021` *(Active)* | Prior to administering initial or annual developmental screening, eligibility evaluation, or curriculum-based assessment (`HELP` / `Carolina`). | Child Name, DOB, BRIDGES ID, Parent Name, Checkboxes granting consent for Screening / Evaluation / Assessment, Parent Signature & Date, SC/IC Signature & Date. | Auto-populates Child/Parent header and bundles into the **"30-Day Pre-Annual Packet"** (`Due_Date - 30d`). |
| **`BN-F03`** | **Consent to Release and/or Obtain Information** *(English & Spanish)* | `07/01/2022` *(Active)* | At Intake, Annual IFSP (`-30d`), and whenever requesting/sharing records with Pediatricians, SLPs, OTs, PTs, Audiologists, Daycares, or LEAs (`34 CFR § 99.33`). Valid up to 1 year unless revoked. | • **Sec 1:** Child Name, DOB, BRIDGES ID, Parent Name.<br>• **Sec 2:** Purpose checkboxes (*Eligibility, IFSP Dev/Review, Service Planning, Parent Copy*) + specific info description.<br>• **Sec 3:** 8 FERPA/Part C acknowledgements (including fax/email/text release permission) + Parent Signature/Date.<br>• **Sec 4:** Sender/Recipient Name, Agency, Address, Phone, Fax, Email (Required for official record!). | **Auto-Fills Sec 4 via Free CMS NPPES NPI API!** Typing `"Dr. Katherine..."` or `"Palmetto Pediatric Therapy"` auto-fills the clinic's exact Address, Phone, and Fax into Section 4! |
| **`BN-F04`** | **Consent to Use Insurance Resources Form** *(English & Spanish)* | **`05/26/2026`** *(Updated May 2026!)* | At Intake, Annual IFSP (`-30d`), and whenever adding a new service or changing frequency/intensity on the IFSP (`System of Payments Policy`). | Child Name, DOB, BRIDGES ID, Medicaid ID / Private Insurance status, Parent consent to bill SC Healthy Connections Medicaid / MCO / Private Insurance, Parent Signature & Date. *(Accompanied by Written Notice Related to Private Insurance and Medicaid Part C, rev `07/01/2020`).* | Flags automatically whenever an IFSP Planned Service frequency increases or at the 30-day pre-annual mark. |
| **`BN-F05`** | **IFSP Consent and Team Signatures Form** *(English & Spanish)* | **`05/07/2026`** *(Updated May 2026!)* | **`ACIS EI-405, EI-406`:** Signed at Initial IFSP, 6-Month Periodic Review, Annual IFSP, and Formal Change Reviews. | Child Name, DOB, BRIDGES ID, Meeting Date, Plan Type (*Initial, 6-Month, Annual, Change*), Parent signature consenting to each planned service (parents may consent to some services and decline others), Team Member names, roles, participation method (`In-Person`, `Phone`, `Written Report`), and signatures. | Pre-fills all active multidisciplinary team members (SLP, OT, PT, SC) on the child's roster and tracks the **10-Business-Day Copy Delivery Clock (`ACIS EI-407`)**. |
| **`BN-F06`** | **Hearing and Vision Questionnaire** *(English & Spanish)* | `08/05/2021` *(Active)* | **`ACIS EI-439`:** Mandatory at Intake AND within **30 days prior to EVERY Annual IFSP** (`1st, 2nd, 3rd Annual IFSP`). | • **Sec 1:** Child Name, DOB, BRIDGES ID, IC/SC Name, Agency, Purpose checkbox.<br>• **Sec 2 (Hearing):** Screening in last 6 mos (`No`, `Yes/Normal`, `Yes/Abnormal` $\rightarrow$ **Mandatory SCSDB Regional Coordinator consult before completing eval/assessment!**), Established Risk Conditions (Hearing loss >20dB, Microtia, Auditory Neuropathy, etc.), High-Risk Medical/Behavioral checklist.<br>• **Sec 3 (Vision):** Screening in last 6 mos, Established Risk Conditions (ROP Stages 4–5, Cortical Blindness, Acuity <20/70, etc.), High-Risk Physical/Behavioral signs (lack of eye contact/tracking by 3m, nystagmus, photophobia). | **Interactive 60-Second Pre-Annual Wizard:** Guided Yes/No toggle checklist on mobile/tablet; if any Abnormal or High-Risk box is tapped, auto-displays the mandatory **SCSDB Regional Services Coordinator Consultation** reminder and fields! |
| **`BN-F07`** | **Family Assessment Form** *(English & Spanish)* & **Routines-Based Interview (`RBI`)** | `07/01/2020` *(Active)* | **`ACIS EI-413`:** Prior to Initial IFSP and **prior to each Annual IFSP** (unless family initials the *Family Declined Family Assessment* opt-out box). | • **Sec 1:** Child Name, DOB, BRIDGES ID, Date Completed, **Opt-Out Parent Initials box** if declined.<br>• **Sec 2:** 12 Child Priority/Concern checkboxes (*Moving around, Positioning, Talking/listening, Playing, Feeding, Getting along, Behavior, Expressing feelings, Daily routines, Calming down, Pain*).<br>• **Sec 3:** 13 Family Priority checkboxes (*Doctors, Childcare, Respite, Parent Network: Family Connection SC / PRO-Parents / SCDHEC CSHCN*).<br>• **Sec 4 & 5:** Family Strengths/Resources & Daily Home/Community Routines. | **Digital RBI & Family Assessment Scratchpad:** Lets the EI tap routine ratings (`1–5`) and check priorities during the home interview, then outputs both the completed `BN-F07` PDF and draft IFSP Outcomes! |
| **`BN-F08`** | **Early Childhood Outcomes Summary (`COS`) Form** *(English & Spanish)* | `07/01/2020` *(Active)* | **`ACIS EI-408, EI-409, EI-410, EI-411`:**<br>• **Entry COS:** Completed at Initial IFSP.<br>• **Exit COS:** Completed at Part C Exit / Age 3 (required if child received **$>6$ months** of service and had an Entry COS). Must document input from parent + other team members! | • **Sec 1 & 2:** Child Info, Entry vs. Exit checkbox, Team Members & Roles.<br>• **Sec 3:** Across **Outcome 1 (Positive Social Relationships)**, **Outcome 2 (Acquires & Uses Knowledge/Skills)**, and **Outcome 3 (Takes Appropriate Action to Meet Needs)**: Summary & Date from 4 sources (*Family Assessment, Child Assessment, EIS Provider, Non-Part C*), **1–7 Functional Rating**, and (Exit Only) **"Has the child acquired any new skills related to this Outcome since entry rating? YES / NO"**. | **Interactive 7-Point COS Decision Tree Wizard** (see Section 2.3 below) that calculates the exact `1–7` rating from 3 plain-English questions and drafts the 4 source boxes automatically. |
| **`BN-F09`** | **Transition Referral Form (and Late Transition Alert)** | `11/2023` / `08/24/2020` | **`ACIS EI-419`:** Must be sent to the Local Education Agency (LEA / School District) between **27 and 33 months of age** (at least 90 days before 3rd birthday). | • **Sec 1:** Status (*New, Late Referral, Update, Early Exit*), Referral Date, Conference Due Date.<br>• **Sec 2:** Child & Parent Demographics, Race/Ethnicity codes.<br>• **Sec 3:** Preschool Provider (*LEA, Head Start, Child Care*), LEA Preschool Coordinator Name, District Name, Address, Phone, Fax, Email.<br>• **Sec 5 (`5A, 5B, 5C`):**<br>  - `5A`: Parent agrees to receive preschool services through LEA (`YES`/`NO`).<br>  - `5B`: Parent agrees to take part in Transition Conference (`YES`/`NO`).<br>  - `5C`: Consent obtained for info sharing with LEA (`YES`/`NO`).<br>  - **Mandatory Rule:** *Parent & SC Signatures are REQUIRED if `5A` or `5B` is answered `NO`!* | Auto-triggers at `DOB + 27 Months`; pre-fills local Upstate SC School District Preschool Special Ed Coordinator info (Greenville County Schools, Anderson 1–5, Pickens, Spartanburg 1–7, Oconee) and flags if parent opts out so the mandatory refusal signature is captured! |
| **`BN-F10`** | **Transition Conference Summary Form** *(English & Spanish)* | `07/01/2020` *(Active)* | **`ACIS EI-420, EI-421`:** Held between **27 and 33 months** ($\ge 90$ days before 3rd birthday) with Parent + SC + LEA Representative. | • **Sec 1:** Child Name, DOB, Date of Conference, **"Is date of conference at least 90 days prior to child's third birthday? YES / NO"**, SC Name/Phone, BRIDGES ID.<br>• **Sec 2:** Conference Summary narrative.<br>• **Sec 3:** Transition Action Steps table (*Step, Persons Involved, Deadline*).<br>• **Sec 4:** Participant Signatures & Method Codes (`A = Attended in person`, `P = Phone`) for Parent, SC, LEA Rep, Early Care/Ed. | Auto-computes the `>= 90 days prior` boolean from `DOB`, pre-populates standard SC Part C $\rightarrow$ Part B transition steps, and prompts for a valid **Late Reason Code (`ACIS EI-421`)** if held after 33 months. |
| **`BN-F11`** | **Parent Verification of Early Intervention Services (`PVEIS`)** *(English & Spanish)* | `07/01/2020` *(Active)* | Signed after each visit / monthly to verify exact dates and start/end times of services delivered (`OT, PT, SC, SI, SLP`). Retained on file $\ge 3$ years (6 years per SCDHHS Medicaid manual). | • **Sec 1:** Child Name, BRIDGES ID, Month/Year, EIS Provider Name, Agency.<br>• **Sec 2:** Service checkboxes (`OT, PT, SC, SI, SLP, Other`) + 10-row log table (*Date of Service, Beginning Time AM/PM, Ending Time AM/PM, Parent Signature, Date*). *Explicit rule: Parent must NEVER sign a blank or incomplete line!*<br>• **Sec 3:** EIS Provider Certification Signature & Date. | Generates a clean monthly or per-visit verification log directly from the child's completed visits for finger-signature or print. |
| **`BN-F12`** | **Primary Healthcare Provider Summary** & **Referral Status Update** | `07/01/2020` *(Active)* | Sent to referring physician/source after initial eligibility/IFSP and updated within **30 days prior to each Annual IFSP**. | Child Name, DOB, BRIDGES ID, Primary Care Physician Name/Fax, Eligibility status, IFSP Planned Services summary. | Auto-fills physician fax/address via NPPES NPI Registry API. |
| **`BN-F13`** | **Assistive Technology (`AT`) Screening & Assessment Form** + **AT Purchase Request** | `01/28/2021` / `12/01/2021` | When a child needs an AT device (e.g., adaptive seating, switch toy, PECS/AAC device, orthotics) under Part C Appendix B. | AT Screening domains, trial outcomes, vendor quotes, medical necessity justification for Part C State Office approval. | Pre-fills child demographics and IFSP Outcome linkage. |
| **`BN-F14`** | **BabyNet Claims Inquiry Form** | **`06/01/2026`** *(Updated June 2026!)* | Submitted when investigating rejected/unpaid BabyNet/Medicaid claims or payor source errors. | Fillable PDF tracking Provider NPI, BRIDGES ID, Date of Service, Procedure Code (`T1027-TL`/`T1016-TL`), and rejection code. | Pre-fills from any flagged/rejected visit log. |
| **`BN-F15`** | **Parent Notice of Family Rights and Safeguards Signature Form** *(English & Spanish)* | `12/01/2021` *(Active)* | Signed at Intake, Initial IFSP, Annual IFSP, and accompanied with every Prior Written Notice (`BN-F01`). | Parent acknowledgement of receiving procedural safeguards booklet + Dispute Resolution / Mediation / Due Process rights (`Request for Dispute Resolution` `04/22/2022`). | Bundled automatically with `BN-F01` PWN packets. |

---

### 2.2 Complete Inventory of Official SC BHDD-OIDD / DDSN (Ages 3–6 & Contracted EI) Forms & Attachments

From our primary-source extraction of the **SC BHDD-OIDD Early Intervention Manual (Revised September 2025)**, **FY25 ACIS Key Indicators Review Tool (`EI-101` through `EI-439`, Revised July 8, 2024)**, and **SCDDSN EI Procedural Bulletins #6, #7, #8, and #13**, here is every mandatory OIDD/DDSN form and attachment:

| Form ID / Code | Official SC OIDD / DDSN Form Title | Governing Manual / ACIS Indicator | Mandatory Trigger & Statutory Timeline | Exact Required Fields & Audit Rules | How Palmetto EI Companion Automates It |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`OIDD-F01`** | **Unaltered OIDD Family Service Plan (`FSP`) Form** | `OIDD Manual Ch. 11 (p. 39)` & `ACIS EI-405, EI-406, EI-435, EI-438` | • **BabyNet $\rightarrow$ OIDD Continuation:** Completed **prior to 3rd birthday, but NO MORE than 14 calendar days prior** (`[DOB+3y-14d, DOB+3y-1d]`), effective on 3rd birthday.<br>• **New Age 3–5 Intake:** Within **45 calendar days** of Provider Choice.<br>• **Case Transfer (`EI-437`):** New or updated FSP within **14 calendar days** of transfer.<br>• **6-Month Review (`EI-406`):** Exact 6-month anniversary (`7/1/2025 -> 1/1/2026`; `1/2/2026` is LATE!).<br>• **Annual Review (`EI-405`):** $\le 6$ months from 6-month review and $\le 365$ days from initial/annual FSP. **Hard billing stop if expired!** | • **Rule:** *"The OIDD FSP form must be used for children 3 to 6 years old receiving Early Intervention services. It may not be altered."*<br>• Must include: Identifying info, Current Vision/Hearing/Medical/Health & all 5 developmental domains (`EI-438`), CBA results completed $\le 14$ days prior (`Ch. 8, p. 21`), Family Strengths/Preferences, Functional Goals (with **Goal Attainment Scores** scored at 6-month review), **"Other Services" section (`EI-435`)** listing amount, frequency, and duration of ALL current services, FT frequency/duration, Waiver support, and Signatures.<br>• Copy delivered to parent within **10 business days (`EI-407`)**. | Tracks the exact 14-day pre-3rd-birthday window, 14-day pre-FSP CBA window, zero-grace-period 6-month anniversary, and 10-business-day parent copy delivery reminder. |
| **`OIDD-F02`** | **Family Training / Special Instruction Summary Sheet** | `OIDD Manual Ch. 9 (p. 25)` & `ACIS EI-426, EI-427` | Completed at **every single Family Training (`T1027-TL`) visit**. A copy **must** be left with the parent/caregiver (or left with the daycare provider to give to the parent). **Never ask a family to sign a blank or incomplete sheet (`Ch. 3, p. 10`)!** | **8 Mandatory Fields (`Ch. 9, p. 25`):**<br>1. Child's Name & Date of Visit.<br>2. Who was present for visit.<br>3. Objectives/Strategies for the visit (addressing child's needs across environments).<br>4. Summary of activities.<br>5. **Active Parent/Caregiver Participation (`EI-427`)** — *exact coaching given and how caregiver practiced it (stating "parent participated" fails audit!)*.<br>6. **Follow-up activities (`EI-426`)** for family to work on until next session.<br>7. Reminders for upcoming appointments + **Date/Time of next FT visit** (or `"To be determined"`).<br>8. **Exact Time In / Time Out** + **EI Signature & Parent/Caregiver Signature**. | **1-Tap Digital Finger-Signature & Leave-Behind PDF/SMS Generator:** Right after the car-seat or living-room note is generated, the parent signs with their finger on the EI's phone/tablet screen, and the app texts/emails or prints the official `OIDD-F02` Summary Sheet on the spot! |
| **`OIDD-F03`** | **Acknowledgement of SC/EI Provider Choice Form** *(PB #7 Att. 1)* | `OIDD Manual Ch. 11 (p. 37), Ch. 13 (p. 44)` & **`ACIS EI-434`** | 1. At **Initial Intake / Initial FSP**.<br>2. **Annually** at every Annual FSP redetermination.<br>3. Whenever a family requests a **Record Transfer** to another county or provider. | • Lists selected qualified provider for `Service Coordination` and `Early Intervention`.<br>• Includes **"Updated Choice of SC/EI Provider"** annual renewal blocks.<br>• Parent/Legal Guardian Signature & Date + SC/EI Signature & Date. | Auto-bundled into every Annual FSP checklist (`EI-434` badge) and Transfer workflow. |
| **`OIDD-F04`** | **OIDD Service Justification Form** *(PB #6 Att. 7 / OIDD Portal)* | `OIDD Manual Ch. 9 (p. 24)` & **`ACIS EI-416, EI-436`** | **Required in 4 Specific Scenarios:**<br>1. **Over 4 Hours/Month (`>16 Units/Mo`) of Family Training (`EI-416`):** Must submit FSP + Service Justification Form + FT Summary Sheets + Service Notes to OIDD Office of Children's Services **within 14 calendar days** of plan completion (OIDD responds within 14 days).<br>2. **Child Turning 5 Years Old (`EI-436`):** Transition starts at `4.5 years`; if continuing FT at age 5+, must submit Service Justification Form **no later than 14 days prior to 5th birthday** under 1 of 5 exception categories (*Medically Fragile/Homebound, DSS/CPS Involvement, Recent Major Life Change within 6 mos, Late Referral after age 4, Other*).<br>3. **Less Than 2 Hours/Month FT** (Ages 3–6) or child did not meet FT indicators.<br>4. **Extended Declining of Services (`>3 mos`) or EI Absence (`>1 mo`, `EI-430`)** where family declines an alternate EI (requires **Parent Signature**!). | Child Name, Age, EI Name, Case Open Date, Board/Agency, Date, Scenario Checkboxes, Justification Narrative, Parent Signature (if declining alternate EI), EI Signature, Supervisor Signature, and **OIDD Office of Children's Services Approval Signature** (must be placed in file once returned!). | Automatically triggers an urgent alert at **`DOB + 4y 11m 16d` (14 days before 5th birthday)** and whenever an IFSP/FSP is saved with `>16 monthly FT units`, generating the complete 14-day submission packet! |
| **`OIDD-F05`** | **OIDD Service Agreement** | `OIDD Manual Ch. 13 (p. 42)` & **`ACIS EI-433`** | Must be signed and present in the primary case record **once a need for an OIDD service is identified and BEFORE any services are provided**. | Consumer/Child Name, Service Type, Provider Agency, Parent/Guardian Signature & Date prior to first billable service date. | Hard compliance check on DDSN child profiles: warns if `Service Agreement Signed Date` is missing or later than `First Service Date`. |
| **`OIDD-F06`** | **10-Day Continuation / Unable-to-Contact Letter** & **Case Closure Form** | `OIDD Manual Ch. 9 (p. 24), Ch. 10 (p. 30)` & **`ACIS EI-432`** | Triggered after **3 consecutive unnotified missed FT visits** or when a parent cannot be reached after varied attempts (phone, home visit, mail, referral source). | **Mandatory Letter Elements (`Ch. 10, p. 30`):**<br>1. States attempts to involve parent have been unsuccessful and **briefly lists those attempts**.<br>2. Requests parent contact EI within **10 calendar days** to continue services.<br>3. Informs parent they may contact SC OIDD (`1-800-289-7012`) at any time in the future to seek eligibility.<br>• If no response after 10 calendar days, complete **Closure Form** (placed on top of Section 1 of Record Index) and document closure reason in service notes (`EI-432`). | **1-Click "3 Missed Visits $\rightarrow$ Generate 10-Day Letter" Workflow:** Automatically pulls the exact dates/times of the 3 logged missed visits/attempts into a formal printable letter and starts a **10-Calendar-Day Closure Countdown Timer**! |
| **`OIDD-F07`** | **Annual Home Safety Checklist** (`PB #7 Att. 4`) & **Greenwood Genetic Center Release** | `PB #7 (Service Coordination)` & `PB #13 (Record Index)` | Reviewed at intake and **annually** during home visits to ensure natural environment safety. | **3-Part Checklist:** *Child's Room* (crib slats $\le 2\frac{3}{8}"$, away from blinds/heaters), *Kitchen* (cabinet locks, cleaning products, highchair away from stove), *General Precautions* (smoke detectors, fire extinguisher, car seat, TV tip hazard, stair gates, outlet covers, bath supervision, gun trigger locks, **button batteries**). Signed by Parent & EI. | Built-in 60-second **Annual Home Safety Checklist** inside the app's `Forms & Tools` tab. |
| **`OIDD-F08`** | **Level I / Level II Service Coordination Assessment** (`PB #7 Att. 2 & 3`) | `PB #7 (Service Coordination)` | Completed **no more than 10 business days prior** to transferring a child out of Early Intervention (e.g., at Age 6 exit) into ongoing DDSN Case Management. *(Note: Children in active EI are always Level I).* | 13-item Yes/No risk & waiver questionnaire (ID/RD, PDD, CS, HASCI Waiver status, medical coordination needs) + Notice of Service Coordination Levels. | Auto-queued 14 days before a child's 6th birthday exit (`DOB + 6y - 1d`). |
| **`OIDD-F09`** | **Primary Case Record Index & Review of Record Signature Log** | `OIDD Manual Ch. 13 (p. 42 & p. 46)` & `OIDD Ch. 4 (p. 13)` | • Every physical/electronic chart must follow the **5-Section (2025 Manual) / 6-Section Record Index** in chronological order.<br>• **Supervisor Monthly Audit (`Ch. 4, p. 13`):** EI Supervisor must review at least **2 files per month per EI** (1 file/month for part-time EIs with $\le 12$ kids) and sign the **Review of Record Log** in Section 1. | • **Section 1:** File Index, Consent to Release/Obtain, Consent for Eval/Assessment, Service Agreement, Medical Necessity, CDSS, **Review of Record Signature Log** (Name, Signature, Role, Date of every reviewer), Closure Form (on top when closed).<br>• **Section 2:** IFSP/FSP & Eligibility Docs.<br>• **Section 3:** FT Summary Sheets & IEP.<br>• **Section 4:** Medical/Therapy & Psych Evals.<br>• **Section 5:** Correspondence & PWNs. | **1-Click "Export Complete 5-Section Audit Binder ZIP/PDF":** Generates the exact OIDD-indexed chart packet + Supervisor Monthly 2-File Review Log! |

---

### 2.3 Deep-Dive Clinical Workflows: RBI, HELP / Carolina Curriculum, COS 7-Point Decision Tree & MCO Therapy Prior Authorizations

#### A. Routines-Based Interview (`RBI` — McWilliam Model) $\rightarrow$ IFSP/FSP Functional Outcome Generator
Under SC's State Systemic Improvement Plan (`SSIP` Indicator C11), `ACIS EI-413`, and the Jan 2025 SCDHHS Provider Manual (Appendix III), the **Routines-Based Interview (`RBI`)** is South Carolina's state-approved Family Assessment tool.
- **How EIs Actually Conduct the RBI:**
  1. The EI walks the parent chronologically through **8 to 10 everyday family routines**:
     - `1. Wake-Up & Diapering/Dressing`
     - `2. Breakfast / Mealtime / Snack`
     - `3. Indoor Play & Independent Time`
     - `4. Childcare / Daycare Drop-Off & Classroom Routine`
     - `5. Grocery Store / Errands / Car Ride`
     - `6. Outdoor Play / Community Outings`
     - `7. Bath Time`
     - `8. Bedtime / Nap Routine`
  2. For each routine, the EI documents: *(a) What happens right now? (b) What is the child doing (Engagement, Independence, Social Relationships)? (c) Caregiver Satisfaction Rating (`1 = Very Stressful` to `5 = Going Great`)*, and marks **"Starred Concerns ($\star$)"** whenever a routine is rated `1–3`.
  3. At the end of the interview, the parent selects **3 to 5 functional priorities**, which the EI converts into **participation-based IFSP/FSP Outcomes** (e.g., *"Liam will request desired foods using 10 words or signs during breakfast and afternoon snack routines"*—never deficit-based clinic goals like *"Liam will increase expressive vocabulary by 20%"*).
- **How Palmetto EI Companion Makes RBI Effortless:**
  - Includes a clean **RBI Routine Tap-Card Flow** where Jennifer taps each routine, taps the `1–5` parent satisfaction stars, dictates a 15-second voice summary per routine, and clicks **"Generate Draft IFSP/FSP Functional Outcomes"**—which converts the starred routines into compliant, measurable SC BabyNet/OIDD outcomes!

#### B. Curriculum-Based Assessment (`HELP` & `Carolina Curriculum`) Workflow & Timelines
Per **SCDHHS Provider Manual Appendix III** and **OIDD Manual Ch. 8 (pp. 20–22)**, only two child assessments are approved for ongoing EI in South Carolina:
1. **Hawaii Early Learning Profile (`HELP` Birth–3 & `HELP` 3–6)**
2. **Carolina Curriculum (`CCITSN` for Infants & Toddlers Birth–3 / `CCPSN` for Preschoolers 2–5)**

- **Critical Statutory Difference Between BabyNet and DDSN (`ACIS EI-424` & `OIDD Ch. 8`):**
  - **BabyNet (Ages 0–3):** CBA must be updated **annually** prior to the Annual IFSP.
  - **DDSN / OIDD (Ages 3–6):** CBA must be updated **at least every 6 months**—and specifically **no more than 2 weeks (14 calendar days) prior to the FSP meeting (`OIDD Ch. 8, p. 21`)**!
- **The 5 Mandatory Developmental Domains (`SCDHHS Manual p. 11` & `OIDD Ch. 8 p. 22`):**
  - Every CBA summary entered into `BRIDGES` (Present Levels of Development, `ACIS EI-412`) or the OIDD `FSP` (`ACIS EI-438`) must document **Age Equivalent / Developmental Range (in months)**, **Mastered Skills (`+`)**, and **Emerging Skills (`+/-` target skills for FT)** across all 5 domains:
    1. **Cognitive** (problem-solving, object permanence, cause-and-effect, symbolic play)
    2. **Communication** (Receptive & Expressive language, gestures, vocalizations, two-word combinations)
    3. **Physical / Motor** (Gross Motor: rolling, sitting, pulling to stand, walking, stairs; Fine Motor: palmar grasp, inferior/neat pincer grasp, bilateral coordination, scribbling) + **Vision, Hearing & Health status**
    4. **Social-Emotional** (joint attention, attachment, peer play, emotional regulation, turn-taking)
    5. **Adaptive / Self-Help** (finger/spoon feeding, open/straw cup drinking, dressing participation, sleep, toileting readiness)

#### C. Child Outcome Summary (`COS`) 7-Point Rating Scale Decision Tree (`BN-F08` / `ACIS EI-408–411`)
New and seasoned EIs alike dread picking the right `1–7` rating on the **Early Childhood Outcomes Summary Form (`BN-F08`)** at Entry and Exit across the 3 federal OSEP outcomes:
- **Outcome 1 (`C3A`):** *Positive Social-Emotional Skills (including social relationships)*
- **Outcome 2 (`C3B`):** *Acquisition and Use of Knowledge and Skills (thinking, reasoning, language, symbols)*
- **Outcome 3 (`C3C`):** *Use of Appropriate Behaviors to Meet Needs (feeding, dressing, mobility, safety)*

Below is the exact **ECTA / SC BabyNet COS 7-Point Decision Tree** encoded as a deterministic TypeScript helper so the EI answers **3 simple Yes/No/Mix questions** per outcome and gets the exact `1–7` score and audit justification text:

```typescript
// /src/engine/cosDecisionTree.ts
// Official ECTA / SC BabyNet 7-Point Child Outcome Summary (COS) Decision Tree

export interface CosDecisionAnswers {
  /** Q1: Does the child ever function in ways that would be considered age-expected with regard to this outcome? */
  showsAnyAgeExpectedFunctioning: boolean;
  /** If Q1 = YES: Is the child's functioning age-expected across ALL or ALMOST ALL everyday settings and situations? */
  ageExpectedAcrossAllOrAlmostAllSettings?: boolean;
  /** If across all/almost all: Does anyone on the team have significant concerns that functioning borders on not keeping pace? */
  anyoneHasConcerns?: boolean;
  /** If Q1 = YES (some of the time): Is age-expected functioning a ~50/50 mix, or only occasional? */
  mixVsOccasional?: 'MIX_SOME_SETTINGS' | 'OCCASIONAL_ONLY';
  /** If Q1 = NO (zero age-expected skills): Does the child use Immediate Foundational Skills (skills that come just before age-expected skills)? */
  immediateFoundationalUsage?: 'MOST_OR_ALL_TIME' | 'OCCASIONALLY' | 'NOT_YET';
  /** Exit COS Only: Has the child acquired ANY new skills related to this outcome since Entry COS? */
  acquiredNewSkillsSinceEntry?: boolean;
}

export function computeCos7PointRating(ans: CosDecisionAnswers): {
  rating: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  categoryLabel: 'Completely (7)' | 'Generally Age-Appropriate w/ Concerns (6)' | 'Somewhat (5)' | 'Occasional Age-Expected (4)' | 'Emerging Foundational (3)' | 'Occasional Foundational (2)' | 'Not Yet (1)';
  ageAppropriateBucket: 'OVERALL_AGE_APPROPRIATE (6-7)' | 'OVERALL_NOT_AGE_APPROPRIATE (1-5)';
  bridgesSummaryDescriptor: string;
} {
  if (ans.showsAnyAgeExpectedFunctioning) {
    if (ans.ageExpectedAcrossAllOrAlmostAllSettings) {
      if (!ans.anyoneHasConcerns) {
        return {
          rating: 7,
          categoryLabel: 'Completely (7)',
          ageAppropriateBucket: 'OVERALL_AGE_APPROPRIATE (6-7)',
          bridgesSummaryDescriptor:
            'Child shows functioning expected for age in all or almost all everyday situations; team has no concerns.',
        };
      }
      return {
        rating: 6,
        categoryLabel: 'Generally Age-Appropriate w/ Concerns (6)',
        ageAppropriateBucket: 'OVERALL_AGE_APPROPRIATE (6-7)',
        bridgesSummaryDescriptor:
          'Functioning is generally appropriate for age across settings, but team notes concerns that skills border on not keeping pace with age expectations.',
      };
    }
    if (ans.mixVsOccasional === 'MIX_SOME_SETTINGS') {
      return {
        rating: 5,
        categoryLabel: 'Somewhat (5)',
        ageAppropriateBucket: 'OVERALL_NOT_AGE_APPROPRIATE (1-5)',
        bridgesSummaryDescriptor:
          'Child shows age-expected functioning some of the time/in some settings (a mix of age-expected and younger-child skills).',
      };
    }
    return {
      rating: 4,
      categoryLabel: 'Occasional Age-Expected (4)',
      ageAppropriateBucket: 'OVERALL_NOT_AGE_APPROPRIATE (1-5)',
      bridgesSummaryDescriptor:
        'Child shows occasional age-appropriate functioning across settings, but more functioning is not yet age-expected.',
    };
  } else {
    if (ans.immediateFoundationalUsage === 'MOST_OR_ALL_TIME') {
      return {
        rating: 3,
        categoryLabel: 'Emerging Foundational (3)',
        ageAppropriateBucket: 'OVERALL_NOT_AGE_APPROPRIATE (1-5)',
        bridgesSummaryDescriptor:
          'Child does not yet show age-expected skills in any situation, but uses immediate foundational skills most or all of the time.',
      };
    }
    if (ans.immediateFoundationalUsage === 'OCCASIONALLY') {
      return {
        rating: 2,
        categoryLabel: 'Occasional Foundational (2)',
        ageAppropriateBucket: 'OVERALL_NOT_AGE_APPROPRIATE (1-5)',
        bridgesSummaryDescriptor:
          'Child occasionally uses immediate foundational skills, with most functioning reflecting skills of a much younger child.',
      };
    }
    return {
      rating: 1,
      categoryLabel: 'Not Yet (1)',
      ageAppropriateBucket: 'OVERALL_NOT_AGE_APPROPRIATE (1-5)',
      bridgesSummaryDescriptor:
        'Child does not yet show age-expected or immediate foundational skills upon which to build age-appropriate functioning.',
    };
  }
}
```

#### D. SC Medicaid Managed Care Organization (`MCO`) Therapy Prior Authorization & Prescription Tracker
One of the biggest hidden time-sinks for a South Carolina Service Coordinator (`T1016-TL`) is coordinating **Speech Therapy (SLP)**, **Occupational Therapy (OT)**, and **Physical Therapy (PT)** across South Carolina's 5 Medicaid MCOs.
We verified the official **SC DHHS BabyNet MCO Continuity of Care Reference Table** and **2026 MCO Prior Authorization Guides**:

| SC Medicaid Plan ID (Shown on `BRIDGES` Financial Supports Screen) | MCO Name | BabyNet Therapy Prior Authorization (PA) Rule | Official PA Submission Channel (Fax / Email / Portal) | Therapy Prescription (`Rx`) & Re-Auth Rule Tracked by App |
| :---: | :--- | :--- | :--- | :--- |
| **`FFS`** *(No MCO ID)* | **SC Healthy Connections Fee-For-Service Medicaid** | IFSP Planned Services page serves as authorization up to IFSP limits. | `BRIDGES` auto-transmits FFS claims to `MMIS`. | Track MD/NP/PA signed therapy order + Annual IFSP renewal. |
| **`HM1000`** | **First Choice by Select Health of SC** | **YES — PA Required** for BabyNet services (`2026 Select Health PA Grid, Rev Jan 2026, MCO-SH_265391300`). | **Fax:** `866-368-4562` \| **UM Phone:** `1-888-559-1010`<br>Submit Universal BabyNet PA Form + Copy of IFSP. | Alert SC `14 days` before PA end date or when IFSP frequency changes. |
| **`HM2200`** | **Absolute Total Care (ATC)** *(Centene)* | **NO PA Required for BabyNet Members** (Effective March 1, 2022 guidance, ATC eliminated Universal PA Form/IFSP submission for BabyNet-enrolled members, subject to retrospective audit). | **Provider Services:** `1-866-433-6041`<br>*(Non-BabyNet members still require PA via NIA).* | Still track MD prescription + IFSP Planned Services alignment for retrospective audit protection! |
| **`HM3200`** | **Healthy Blue by BlueChoice of SC** | **YES — PA Required** for BabyNet services (`healthybluesc.com/providers/patient-care/babynet`). | **Fax:** `800-823-5520` *(or Availity Portal)* \| **UM Phone:** `1-866-902-1689`<br>Submit **Universal BabyNet PA Form + Copy of IFSP**. | Alert SC `14 days` before PA expiration; 1-click generate fax cover + Universal BabyNet PA packet. |
| **`HM3600`** | **Molina Healthcare of SC** | **YES — PA Required** for BabyNet Therapy Treatment (`No` for initial eval). | **Email:** `MHSCPriorAuth@MolinaHealthCare.com`<br>**Fax:** `866-423-3889` \| **Phone:** `1-855-237-6178 (Opt 1 -> Opt 4)` | Alert SC `14 days` before PA expiration; pre-fill email/fax packet. |
| **WellCare / Humana** | **WellCare of SC / Humana Healthy Horizons** | Varies by service / network status; submit IFSP + Universal PA Form for Continuity of Care. | **Skilled Therapy Fax:** `877-709-1698` \| **Autism/BH Fax:** `888-343-5364` | Track continuity-of-care window and prescription expiration. |

---

### 2.4 Existing Open-Source Tools, Public Federal/State APIs & Client-Side Libraries to Integrate Immediately

Every API and library below was **live-tested from `/workspace` on October 26, 2026** and requires **zero paid API keys, zero server maintenance, and zero PHI exposure**:

#### 1. Free NLM Clinical Tables REST API (`ICD-10-CM` & `HCPCS Level II` Instant Autocomplete)
- **Why We Use It:** When an EI is entering a child's established risk diagnosis at intake (e.g., `"expressive language"`, `"autism"`, `"torticollis"`, `"Down syndrome"`, `"extreme immaturity"`) or checking a procedure code (`T1027`, `T1016`, `T1018`, `92507`), she shouldn't have to Google ICD-10 codes. The U.S. National Library of Medicine (`NIH`) provides a fast, CORS-enabled, no-API-key JSON endpoint.
- **Verified Live Endpoints:**
  - **ICD-10-CM Search:** `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms={query}&maxList=8`
    - *Live Test (`terms=expressive+language`):* Returns `[2, ["F80.1", "F80.2"], null, [["F80.1", "Expressive language disorder"], ["F80.2", "Mixed receptive-expressive language disorder"]]]` in `<90ms`.
  - **HCPCS Level II Search:** `https://clinicaltables.nlm.nih.gov/api/hcpcs/v3/search?terms={query}&maxList=8`
    - *Live Test (`terms=T1027`):* Returns `[1, ["T1027"], null, [["T1027", "Family training & counseling"]]]`.

#### 2. Free CMS NPPES NPI Registry API v2.1 (Auto-Populating Upstate SC Pediatricians, SLPs, OTs & PTs)
- **Why We Use It:** On the **Consent to Release/Obtain Information (`BN-F03` Section 4)**, **Primary Healthcare Provider Summary (`BN-F12`)**, and **Service Coordination (`T1016-TL`) collateral notes**, SC Medicaid requires the **full name, title, agency, address, phone, and fax number** of every pediatrician or therapist referenced.
- **Verified Live Endpoint:**
  - `https://npiregistry.cms.hhs.gov/api/?version=2.1&state=SC&city={city}&last_name={name}&limit=5`
- **Copy-Pasteable TypeScript Hook for `Palmetto EI Builder` (`clinicalDirectoryApi.ts`):**

```typescript
// /src/integrations/clinicalDirectoryApi.ts
// Zero-Key Federal REST Integrations: NIH/NLM ICD-10-CM + CMS NPPES SC Provider Lookup

export interface Icd10CodeOption {
  code: string;       // e.g., "F80.1"
  description: string;// e.g., "Expressive language disorder"
}

export async function searchIcd10Codes(query: string): Promise<Icd10CodeOption[]> {
  if (!query || query.trim().length < 2) return [];
  const url = `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${encodeURIComponent(
    query.trim()
  )}&maxList=8`;
  const res = await fetch(url);
  if (!res.ok) return [];
  // Response tuple: [totalCount, codeArray, extraFields, [ [code, name], ... ]]
  const data = await res.json();
  const pairs: Array<[string, string]> = data?.[3] || [];
  return pairs.map(([code, description]) => ({ code, description }));
}

export interface ScProviderDirectoryMatch {
  npi: string;
  fullNameWithCredential: string; // e.g., "Rebecca Ortiz, MS, CCC-SLP" or "Prisma Health Children's"
  taxonomyDescription: string;    // e.g., "Speech-Language Pathologist" or "Pediatrics"
  practiceAddress: string;        // e.g., "29 N Academy St, Greenville, SC 29601"
  phone: string;                  // e.g., "864-331-1300"
  fax: string;                    // e.g., "864-331-1301"
}

/**
 * Note: Because CMS NPPES does not send browser CORS headers on direct client calls,
 * route through our lightweight `/api/npi-lookup` proxy on `server.py` / Cloudflare Worker
 * (Query contains ONLY public doctor/clinic name + SC city — zero patient PHI!).
 */
export async function lookupScProviderByNpiRegistry(params: {
  lastName?: string;
  organizationName?: string;
  city?: string; // e.g., "Greenville", "Anderson", "Easley", "Spartanburg"
}): Promise<ScProviderDirectoryMatch[]> {
  const qs = new URLSearchParams({ version: '2.1', state: 'SC', limit: '6' });
  if (params.lastName) qs.set('last_name', `${params.lastName}*`);
  if (params.organizationName) qs.set('organization_name', `${params.organizationName}*`);
  if (params.city) qs.set('city', params.city);

  const res = await fetch(`/api/npi-lookup?${qs.toString()}`);
  if (!res.ok) return [];
  const data = await res.json();

  return (data.results || []).map((r: any) => {
    const loc =
      (r.addresses || []).find((a: any) => a.address_purpose === 'LOCATION') ||
      r.addresses?.[0] ||
      {};
    const tax =
      (r.taxonomies || []).find((t: any) => t.primary) || r.taxonomies?.[0] || {};
    const isOrg = r.enumeration_type === 'NPI-2';
    const fullNameWithCredential = isOrg
      ? r.basic?.organization_name
      : `${r.basic?.first_name || ''} ${r.basic?.last_name || ''}${
          r.basic?.credential ? `, ${r.basic.credential}` : ''
        }`.trim();

    return {
      npi: r.number,
      fullNameWithCredential,
      taxonomyDescription: tax.desc || 'Healthcare Provider',
      practiceAddress: `${loc.address_1 || ''}, ${loc.city || ''}, ${loc.state || 'SC'} ${
        (loc.postal_code || '').slice(0, 5)
      }`.trim(),
      phone: loc.telephone_number || '',
      fax: loc.fax_number || '',
    };
  });
}
```

#### 3. Curated Open-Source Library Stack for `Palmetto EI Builder`

| Capability | Open-Source Package / Standard | License | Exact Role in Palmetto EI Companion |
| :--- | :--- | :---: | :--- |
| **Client-Side Official SC PDF Form Filler** | **`pdf-lib`** (`npm i pdf-lib`) | MIT | Loads the official SC BabyNet (`BN-F01` through `BN-F15`) and OIDD (`OIDD-F02` through `OIDD-F07`) PDF templates in browser memory, stamps Child Name, DOB, BRIDGES ID, Dates, Checkboxes, and Parent/EI Finger Signatures (`drawImage` PNG from HTML5 Canvas), and downloads the flattened PDF with **zero server upload**. |
| **Local-First Encrypted Database** | **`Dexie.js`** (`IndexedDB` wrapper) + **`WebCrypto API`** (`AES-256-GCM`) | Apache-2.0 / Native | Stores the local caseload roster, statutory timeline overrides, voice note drafts, and mileage logs with `<5ms` query latency and encrypted delta sync. |
| **Apple iCloud & Google Calendar Ingestion** | **`tsdav`** (CalDAV client) + **`ical.js`** (Mozilla RFC 5545 parser) + **Google Calendar API v3** | MIT / MPL-2.0 | Parses recurring `RRULE` weekly home-visit schedules, single-instance reschedules, and `webcal://` or CalDAV feeds directly into the Fuzzy Roster Matcher. |
| **Offline Rural Dead-Zone Audio Queue & STT** | **`MediaRecorder` + `OPFS`** (`navigator.storage.getDirectory()`) + **`@huggingface/transformers`** (`whisper-tiny.en` WebGPU/WASM) or **`homebase` Whisper/Gemma4** | Apache-2.0 / Native | Streams 1-second audio chunks to disk during rural home visits so zero audio is ever lost if interrupted, then transcribes locally or via `homebase`. |
| **CDC Developmental Milestone Reference** | **CDC *"Learn the Signs. Act Early."* Checklists** (`2m, 4m, 6m, 9m, 12m, 15m, 18m, 24m, 30m, 3y, 4y, 5y`) | Public Domain (US HHS/CDC) | Powers an instant age-matched **Milestone & Red-Flag Reference Drawer** inside each child's workspace (automatically calculated from chronological age and **Adjusted Prematurity Age** for NICU babies $<24$ mos like Zoe Patel!). |

---

### 2.5 Prioritized Implementation Roadmap for `Palmetto EI Builder` (`v4` Next Steps)

To honor Chef's #1 product rule (*"Start small and not try to add a million features also. Get one piece perfect at a time"*) and directly resolve his `v3` feedback, here is the exact prioritized sequence to build next:

1. **Immediate Priority 1 (`v4` UI/UX Polish — Mobile Single-Screen Drill-Down & Warm Tonal Themes):**
   - Keep the winning `v3` **Desktop 3-Column Workstation** (`Left Sidebar Caseload + Unit Target` | `Middle Column Today's Schedule / Child Workspace` | `Right Column Active Visit Recorder & Note`).
   - Refactor Mobile (`< 768px`) into a **True Single-Screen Native Drill-Down** (never stacking the schedule feed and the voice recorder on the same vertical scroll):
     - **Tab 1 (`Today`):** Clean daily unit pill (`15 / 20 Units`) + 4–6 chronological visit cards $\rightarrow$ tapping any card slides open the full-screen **Car-Seat Visit Recorder** with a `< Today's Schedule` back button.
     - **Tab 2 (`Caseload`):** Clean searchable/filterable child roster (`All` | `Urgent ≤14d`) $\rightarrow$ tapping any child slides open their dedicated **Child Timeline, IFSP Outcomes & Forms Workspace** with a `< Caseload` back button.
   - Ship the **3 Warm Pediatric Specialist Themes** toggleable in the header (`Warm Oat & Eucalyptus Sage`, `Soft Sand & Terracotta`, `French Lavender & Oat`) with **zero dollar signs (`$`) anywhere in the UI**.
2. **Immediate Priority 2 (Zero-Data-Entry Calendar Sync & Fuzzy Roster Matcher):**
   - Add a **"📅 Connect Calendar (Google / Apple iCloud)"** button in the Schedule header that ingests today's events, matches shorthand initials (`L.S.`, `Noah B.`, `Maya @ Sunshine Sprouts`) to the 8-child roster via `matchEventToChildRoster()`, auto-calculates CMS 15-minute units (`calculateCms15MinUnits()`), enforces the **BRIDGES 12:00 PM 24-hour military-time rule**, flags make-up splits, and pre-loads the child's IFSP outcomes above the microphone.
3. **Priority 3 (1-Click Official SC Form Auto-Filler & Leave-Behind Summary Sheet):**
   - Inside each Child Workspace, add a **"📄 1-Click SC Forms"** drawer that stamps the child's local profile onto the top 4 high-frequency PDFs (`BN-F01` 7-Day Prior Written Notice, `OIDD-F02` Family Training Summary Sheet with finger signature, `BN-F09` LEA Transition Referral Form, and `OIDD-F03` Annual Provider Choice `EI-434`).
4. **Priority 4 (NLM ICD-10 Autocomplete + CMS NPPES Upstate Provider Lookup + COS 7-Point Wizard):**
   - Wire `/api/npi-lookup` in `prototype/server.py` and the 3-question `computeCos7PointRating()` helper so `T1016-TL` Service Coordination notes and Entry/Exit COS ratings auto-populate provider credentials and `1–7` ratings in seconds.
