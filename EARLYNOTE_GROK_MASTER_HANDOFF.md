# EarlyNote: Early Intervention — Complete Master Handoff & Architecture Brief

## 1. Product Identity & Mission
- **App Name:** **EarlyNote**
- **App Store Title:** `EarlyNote: Early Intervention`
- **App Store Subtitle:** `IFSP Caseload, Voice Notes & Units`
- **Target Users:** South Carolina Early Interventionists (starting with Jennifer M. McMakin, BS, EI) serving **SC BabyNet (IDEA Part C, Birth–3)** and **SC DDSN / BHDD-OIDD (Ages 3–6)**, scaling nationally to all state Early Intervention programs.
- **Pricing Model:** Standalone SaaS subscription — **$35/month** individual ($29/mo annual) or **$29/seat/month** for EI agencies.
- **Core Value Proposition:** Early Interventionists are family-centered educators overwhelmed by state portal paperwork (`BRIDGES` and `Therap`). EarlyNote lets an EI speak a 30-second voice recap in their car right after a home or daycare visit, automatically formats a 12-point audit-proof service note with zero PHI sent to cloud AI, tracks daily/weekly 15-minute billable units, syncs visits with Apple/Google/Outlook Calendar, and calculates every statutory IFSP deadline from `DOB` + `Intake Date` + `IFSP Date`.

---

## 2. Live Repositories & Codebase Structure
- **Public Live App & Source Repo:** `https://github.com/anselmcmakin/earlynote`
  - **Live URL (Jennifer's Clean Workspace):** `https://anselmcmakin.github.io/earlynote/?mode=jennifer`
  - **Live URL (8-Child Demo Mode):** `https://anselmcmakin.github.io/earlynote/?demo=1`
- **Full Private Engineering Repo:** `https://github.com/anselmcmakin/palmetto-ei-companion`
- **Modular Source Files (`/workspace/ei-app/prototype/`):**
  - `prototype/v9.css` — Apple-first layout (`1440x900` Mac desktop left-sidebar layout + `390x844` iPhone floating inset bottom dock, zero horizontal overflow, 4 warm tonal palettes: `01 Warm Terracotta` default, `02 Forest Sage`, `03 Coastal Slate`, `04 Rosewood Clay`).
  - `prototype/v9.js` — Full application state, client-side WebCrypto `PBKDF2 (120,000 iterations)` + `AES-256-GCM` zero-knowledge encryption, statutory deadline calculator, CMS 8-Minute Rule unit calculator, full-text service note search, and `.ics` / Google Calendar sync.
  - `prototype/build_v9.py` — Bundles `v9.css` + `v9.js` into the standalone single-file `EarlyNote.html` and `index.html` with PWA `manifest.json` and `sw.js`.
  - `prototype/server.py` — Lightweight local/cloud sync relay (`GET / POST /api/vault/<vault_id>`) storing only encrypted `AES-256-GCM` ciphertext blobs.

---

## 3. Non-Negotiable Product, UI/UX & Compliance Rules
1. **Zero Dollar Amounts or Pay Rates Anywhere in the UI:**
   - Never display dollar rates or revenue in the app. Track ONLY **billable units** (15-minute increments) and **minutes** (e.g., `4 Units • 60 min`, `16 Daily Unit Goal`, `85 Weekly Unit Goal`).
2. **Human-Friendly UI (Zero Raw Billing Code Jargon on Main Screens):**
   - Use plain human labels (`Family Training` and `Service Coordination`, `Birth–3` and `Ages 3–6`) instead of raw Medicaid billing codes (`T1027-TL`, `T1016-TL`) in the main UI. Keep billing codes strictly inside exported service notes.
3. **Apple-First Native Architecture (Mac + iPhone First, Windows + Android Next):**
   - **Desktop (`1440x900`):** Left sidebar navigation (`Today`, `Caseload`, `Service Notes`, `Units & Calendar`, `Settings`) + quick caseload roster + full-height main workspace (`min-height: 100vh`) with a 2-column visit grid and anchored bottom bento cards (`This Week's Unit Pace & Calendar` and `Upcoming Family Reviews`).
   - **Mobile (`390x844`):** Clean single-screen native drill-downs (zero stacked clutter, zero horizontal overflow) with a floating inset 5-tab iPhone dock at the bottom (`Today`, `Caseload`, `Notes`, `Units`, `Settings`).
   - **Zero Browser Popups:** Every form (`+ New Child`, `+ New Visit`, `Edit Child`, `Visit Note Studio`) is a built-in page inside the app—never `window.prompt()` or `window.alert()`.
4. **Clean Workspace by Default for Jennifer:**
   - Default state starts with `0 children` and `0 visits` (`jenniferFreshState("terracotta")`) so demo data never pollutes Jennifer's real encrypted vault. A 1-tap `Load 8-Child Demo Caseload` button is available in Settings for testing.
5. **South Carolina BabyNet (Birth–3) & DDSN (Ages 3–6) Statutory Rules:**
   - **CMS 8-Minute Rule (15-Min Units):**
     - `1–7 min` = `0 Units` (log contact only; **Anti-Padding Rule:** never round 1–7 min calls up to 8 min per OIDD Manual Ch. 3).
     - `8–22 min` = `1 Unit`
     - `23–37 min` = `2 Units`
     - `38–52 min` = `3 Units`
     - `53–67 min` = `4 Units` (standard 1-hour home visit)
     - `68–82 min` = `5 Units`
   - **Daily Cap:** `T1027-TL` (Family Training) max `6 units/day` (90 min) per child; `T1016-TL` (Service Coordination) max `16 units/day` (4 hours).
   - **BRIDGES 24-Hour Military Time Rule:** Any visit crossing `12:00 PM – 12:59 PM` must format in 24-hour military time (`12:30 - 13:30`) so SC `BRIDGES` does not reject it as `12:30 AM`.
   - **Make-Up Visit Split Rule:** When a visit includes make-up time, `BRIDGES` requires two separate rows: Row 1 for regular scheduled units, Row 2 with the `Make-Up` checkbox checked for the make-up units.
   - **Statutory IFSP Countdowns (Auto-Calculated):**
     - **45-Day Initial IFSP:** `Intake/Referral Date + 45 calendar days`
     - **6-Month IFSP Review:** `IFSP Start Date + 180 days`
     - **Annual IFSP Redetermination:** `IFSP Start Date + 365 days`
     - **IDEA Part B School District (LEA) Transition Conference:** Window opens at `DOB + 2 years 3 months (27 mos)` and must complete by `DOB + 2 years 9 months (33 mos)` (at least 90 days before 3rd birthday).
     - **BabyNet Part C Exit / DDSN Ages 3–6 Transition:** `DOB + 3 years` (day before 3rd birthday).
   - **12-Point Audit-Proof Service Note Structure:**
     1. Date of Service, 2. Exact Start/End Time (24h noon guard) & Total Minutes/Units, 3. Location (`Home - Natural Environment`, `Daycare`, `Telehealth`, `Phone`), 4. Attendees (Child + Parent/Caregiver), 5. Targeted IFSP Outcome #, 6. Check-In / Follow-Up from Prior Visit, 7. Specific Evidence-Based Intervention Strategies Coached (`T1027` caregiver coaching vs. `T1016` coordination), 8. Child's Response & Functional Progress, 9. Caregiver's Return Demonstration & Coaching Response, 10. Plan for Next Visit & Family Carryover Homework, 11. Service Code & Unit Attestation, 12. EI Signature & Credentials (`Jennifer M. McMakin, BS, EI`).

---

## 4. Full Future Feature Roadmap (v1.0 -> v2.0 -> v3.0)

### Phase 1: Native Desktop (`.dmg` / `.exe`) & iOS App Store v1.0 Launch
1. **Downloadable Native Desktop & Mobile Apps (Zero Browser Required):**
   - **Mac (`.dmg`) & Windows (`.exe`):** Packaged via **Tauri v2** (lightweight ~8 MB native macOS WebKit / Windows WebView2 app with native window controls, Dock icon, offline SQLite storage, and auto-updater).
   - **iPhone & iPad App Store (`.ipa`) & Android Play Store (`.apk`):** Packaged via **Capacitor 6** with native `FaceID / TouchID` biometric lock, native push notifications, and offline storage.
2. **HIPAA-Safe Voice-to-12-Point Note AI Pipeline:**
   - **Step 1 (On-Device STT):** Apple `Speech` / `WhisperKit` transcribes the EI's 30-second car voice note locally on the iPhone/Mac (audio never leaves the device and is purged from RAM immediately per `OIDD 535-02-DD`).
   - **Step 2 (On-Device 18-Identifier Safe Harbor Scrubber):** Strips child names, caregiver names, addresses, DOBs, phone numbers, and Medicaid IDs on the device (`"Liam"` -> `[CHILD_1]`, `"Sarah"` -> `[CAREGIVER_1]`).
   - **Step 3 (BAA Cloud LLM Formatting):** Sends only de-identified tokens to a stateless `AWS Bedrock` or `Google Vertex AI` endpoint under a signed $0/mo HIPAA Business Associate Agreement (zero training/logging) to generate the structured 12-point JSON note.
   - **Step 4 (Local Re-Hydration & Attestation):** Device swaps `[CHILD_1]` back to `"Liam"` locally, and requires the EI's clinical review checkbox (`ACIS EI-307`) before saving/exporting.
3. **1-Click `BRIDGES` & `Therap` Browser Auto-Fill Extension (`Manifest V3`):**
   - Companion Chrome/Safari extension on Mac/PC that receives the decrypted note from EarlyNote and populates all 9 SC `BRIDGES` Service Log fields or `Therap` Case Activity Note (CAN) fields in one click.
4. **Parent Leave-Behind Summary & Finger E-Signature:**
   - Captures caregiver finger signature on the iPhone screen at the end of a home visit and generates a warm, printable/textable Family Training carryover homework sheet (`OIDD Ch. 9`).
5. **Automated Statutory Deadline Push Notifications:**
   - Native iOS and Mac push notifications 30, 14, and 7 days before any 45-Day IFSP, 6-Month Review, Annual IFSP, Part B Transition Conference, or EI credential renewal (`TECS`/`SCEILS`).

### Phase 2: v2.0 Pro Field Tools
6. **Smart Home-Visit Route Optimizer & IRS Mileage Tracker:**
   - Optimizes daily visit order across counties, logs deductible mileage between home/daycare visits, and offers 1-tap "On my way" parent texts.
7. **IFSP Outcome Progress Graphing & 6-Month / Annual Report Auto-Drafting:**
   - Tracks 1–5 outcome mastery ratings over time and synthesizes the last 6 months of visit notes into a draft 6-Month or Annual IFSP Progress Summary.
8. **Collateral Directory with Live Federal NPI & ICD-10 API Lookups:**
   - Free REST integration with the **CMS NPPES NPI Registry API** (`https://npiregistry.cms.hhs.gov/api/?version=2.1`) and **NIH Clinical Tables ICD-10 API** (`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search`) to auto-complete speech/OT/PT collateral providers and diagnosis codes.
9. **1-Tap Bilingual Parent Carryover Handouts (English / Spanish):**
   - Translates the family's home carryover strategies into Spanish (or other home languages) while keeping the official clinical service note in English.

### Phase 3: v3.0 Agency Enterprise & National Expansion
10. **Agency Director Dashboard & Supervisor Co-Sign Queue (`$29/seat/mo`):**
    - Multi-seat management, team weekly unit pace dashboard, overdue IFSP compliance radar across all staff, and supervisor co-signing for provisional EIs.
11. **Nightly `Therap -> CDSS` & Medicaid `ASC X12 837P` Batch Export:**
    - Exports agency-wide verified units into Therap Case Activity Note CSVs and `837P` claim files, plus live `270/271` Medicaid MCO eligibility checks (`Select Health`, `Molina`, `Healthy Blue`, `Absolute Total Care`).
12. **Multi-State IDEA Part C Rulepacks:**
    - Pluggable state compliance modules for NC (`ITP`), GA (`Babies Can't Wait`), TX (`ECI`), FL (`Early Steps`), and NY (`EIP`).

---

## 5. Production Backend Checklist (To Reach the App Store)

1. **Authentication & Identity (`Supabase Auth` or `Clerk`):**
   - Email/Password, Magic Link, and **Sign in with Apple** (mandatory under Apple Guideline 4.8).
   - Separate client-side **Vault Key** (`Argon2id` / `PBKDF2 250k iterations`) stored only in iOS/macOS Keychain so the server never sees the decryption key.
   - Automatic biometric screen lock (`FaceID` / `TouchID`) after 2 minutes backgrounded (`45 CFR 164.312(a)(2)(iii)`).
2. **PostgreSQL Database with Row-Level Security (`RLS`):**
   - **Plaintext Tables:** `users`, `agencies`, `agency_memberships`, `subscriptions`, `devices`, `deadline_alerts` (anonymized UUID + due date only, zero child names), `audit_logs` (6-year immutable access log per `OIDD 368-01-DD`).
   - **Zero-Knowledge Encrypted Tables:** `encrypted_children`, `encrypted_visits`, `encrypted_notes` storing `AES-256-GCM` ciphertext blobs with `record_uuid`, `version`, and `updated_at` for row-level delta sync and conflict resolution.
3. **Offline-First Sync Engine:**
   - Local `IndexedDB` (Web) / `SQLite` (Tauri Mac & Capacitor iOS) with an offline outbox queue so notes dictated in rural driveways with zero cell signal sync automatically when back online, plus `Supabase Realtime` WebSockets for sub-second iPhone-to-Mac sync.
4. **Subscription Billing (`Stripe` + `RevenueCat` + `StoreKit 2`):**
   - Web signups via **Stripe Checkout** (`$35/mo` individual, `$29/seat/mo` agency at 2.9% fee) with multiplatform login on iOS/Mac (`Apple Guideline 3.1.3(b)`).
   - Native iOS In-App Purchases via **StoreKit 2 + RevenueCat** under the **Apple App Store Small Business Program (15% fee tier)**.
5. **Apple App Store & Mac Compliance Requirements:**
   - Apple Developer Program account (`$99/yr`) for iOS App Store, TestFlight beta, and notarized Mac `.dmg` code signing.
   - In-app **"Delete Account & Cryptographically Shred Vault"** button (`Apple Guideline 5.1.1(v)`).
   - Privacy Nutrition Labels & Healthcare Guideline `5.1.3` attestation documenting zero-PHI cloud storage and Safe Harbor de-identification.

---

## 6. Chief of Staff (Cal) Strategic Review: v1.0 Cuts, Critical Safeguards & GTM Additions

### A. What to CUT or DEFER from Phase 1 (`v1.0`) to Ship Fast & Avoid Bloat
1. **Defer Windows (`.exe`) and Android (`.apk`) until `v1.2`:**
   - Maintaining 4 native targets (`Tauri Mac`, `Tauri Windows`, `Capacitor iOS`, `Capacitor Android`) on Day 1 triples QA and build complexity. Ship **iOS (`.ipa`) + Responsive Web PWA / Mac (`.dmg`)** first—that covers Jennifer and ~90% of field EIs immediately.
2. **Move the `BRIDGES` & `Therap` Manifest V3 Browser Extension from `v1.0` to `v1.1`:**
   - Submitting a Chrome/Safari extension alongside an iOS App Store healthcare app doubles store-review delays and requires cross-process native messaging for decrypted notes. For `v1.0`, ship **1-Tap Field Copy Pills** (`[Copy Narrative]`, `[Copy 24h Time]`, `[Copy Units]`) optimized for side-by-side split screen with `BRIDGES`/`Therap`. Build the auto-fill extension in `v1.1` once 10+ EIs are paying.
3. **Move Parent Finger E-Signature to `v1.1` (and Require Kiosk Lock):**
   - Handing an unlocked personal iPhone to a parent at the end of a visit risks accidental exposure of other children's names on the screen. Defer finger signature to `v1.1`, and when added, lock it inside a **PIN/FaceID-guarded "Parent Sign Mode"** that hides the bottom dock and caseload roster. For `v1.0`, let the EI tap `Share Family Carryover Summary via SMS/Print` from their own phone.
4. **Replace Server-Triggered Deadline Push Alerts (`deadline_alerts` table + APNs cron) with On-Device Local Notifications for `v1.0`:**
   - Use native iOS/macOS **On-Device Local Notifications (`UNUserNotificationCenter`)** scheduled locally whenever a child's dates are saved or decrypted. Zero server cron jobs, zero APNs backend maintenance, works 100% offline, and leaks zero metadata to the server.

### B. Critical Features, Legal/HIPAA Safeguards & GTM Steps to ADD to `v1.0`
1. **ADD (Mandatory Zero-Knowledge Safeguard): Emergency Vault Recovery Kit (`12-Word Recovery Phrase / Printable Recovery Key`):**
   - Because `v1.0` uses true zero-knowledge encryption (`PBKDF2` / `AES-256-GCM`) where the server never sees the key, a forgotten passphrase or lost phone without iCloud Keychain would permanently lock an EI out of their caseload and billable notes. Add a mandatory 1-time **"Download Emergency Recovery Kit"** step during setup.
2. **ADD (High-Frequency Field Reality): 1-Tap `Cancelled / No-Show Visit` Quick Log (`0 Units`):**
   - Kids get sick and visits cancel daily. EIs still must log attempted contact/cancellations in `BRIDGES`/`Therap` (`0 Units`) to prove monthly contact compliance. Add a **1-Tap `Cancelled / No-Show` button** on every visit card that generates a compliant 3-line cancellation contact note (`0 Units`) in 3 seconds.
3. **ADD (PHI Scrubber Hardening): Per-Child Local Scrub Dictionary (Nicknames, Siblings & Daycare Names):**
   - Spoken car notes frequently include nicknames, siblings, or daycare names (*"Met with Liam and his grandma Brenda at Little Lambs Daycare"*) that generic regex scrubbers miss. Each child profile should store a local-only **Known Names & Places Scrub List** (auto-populated from the child's intake fields + caregiver/daycare names) that deterministically swaps to `[CHILD_1]`, `[CAREGIVER_2]`, `[SITE_1]` before any token leaves the device.
4. **ADD (Cost & Legal Discipline): `$0` Out-of-Pocket Pre-Validation Gate + Clear "Personal Drafting Tool" Terms:**
   - **Stage the `$99` Apple Developer fee:** Run Jennifer's 2-week real-world field test on the **iOS Home-Screen PWA + Mac Desktop Web/Tauri build** at **$0 out-of-pocket** (`Supabase Free Tier` + `GitHub/Cloudflare Pages`). Pay the `$99/yr` Apple Developer fee only after Jennifer validates the workflow for 2 full weeks.
   - **Terms of Service Boundary:** Explicitly state in the ToS that EarlyNote is a zero-knowledge personal drafting and unit-tracking companion—not an official medical record or replacement for `BRIDGES`/`Therap`—and require the EI's clinical attestation checkbox before any note can be copied out.
5. **ADD (Organic Zero-Outreach Growth Engine): Built-In "Give 30 Days, Get 30 Days" Colleague Referral Link:**
   - Since growth must be 100% organic with zero cold outreach, build a 1-tap **"Share EarlyNote with an EI Colleague (1 Month Free)"** referral card inside Settings so Jennifer and her first few EI coworkers naturally spread it across SC agencies.

---

## 7. Deep-Dive Technical, Regulatory & App Store Audit (@Research)

*(Full line-by-line code audit and replacement functions saved at `/workspace/ei-app/05-Research-Audit-EarlyNote-Master-Plan.md`)*

### A. SC BabyNet & BHDD-OIDD Statutory Rule Corrections
1. **`T1027-TL` (Family Training) Daily & Monthly Caps:**
   - Standard planned `T1027-TL` is **`4 units/day` (60 min)** and **`16 units/month` (4 hours/mo)**. Authorizing `>16 units/month` requires submitting an **OIDD Service Justification Form (`ACIS EI-416`)** within 14 calendar days. When combining a regular visit with a separate Make-Up row (`Make-Up` checkbox added Sept 3, 2025), `BRIDGES` enforces a hard daily system cap of **`16 units/day` (240 min) per service**.
2. **Exact 6-Calendar-Month IFSP Review Formula (`ACIS EI-406` / `OIDD Ch. 11, p. 38`):**
   - Must use **Exact 6-Calendar-Month Anniversary** (`addMonths(IFSP_Start_Date, 6)`, zero grace period—e.g., `7/1/2026 -> 1/1/2027`, NOT `+ 180 days`, which is 4 days late across May–Oct). For DDSN (Ages 3–6), requires an updated Curriculum-Based Assessment (`HELP`/`Carolina`) within 14 days prior (`ACIS EI-424`).
3. **Additional Mandatory SC Compliance Guards:**
   - **Zero Time-Overlap & No Virtual `T1027` (`OIDD Ch. 7 & Ch. 9, p. 24–26`):** `BRIDGES` rejects overlapping start/end times on the same day across the caseload or between `T1027` and `T1016`, and prohibits virtual/telehealth `T1027` Family Training.
   - **7-Calendar-Day `BRIDGES` Entry Window (`BabyNet Appendix A, p. 11`):** Every visit must be logged within 7 calendar days of service (`3 business days` for demographic updates in `Therap`/`CDSS`).
   - **Complete Statutory Countdown Chain:** `2-Business-Day Initial Contact (EI-401)` -> `45-Day Initial IFSP (34 CFR § 303.310)` -> `7-Day Non-Waivable Prior Written Notice (BN-F01 / EI-403)` -> `30-Day Timely Service Initiation (EI-417)` -> `Exact 6-Month Review (EI-406)` -> `365-Day Annual IFSP + 30-Day Pre-Annual Bundle (BN-F04, BN-F05, BN-F06, BN-F07, EI-424, EI-434)` -> `27–33 Month LEA Part B Transition (BN-F09 / BN-F10)` -> `DDSN Continuation FSP Window [3rd Birthday - 14d, 3rd Birthday - 1d]` -> `3rd Birthday Part C Exit (EI-410)` -> `Age 5+ Service Justification (EI-436)`.

### B. Apple App Store Review Guards (`Guidelines 5.1.2(i), 5.1.3, 3.1.1(a), 4.2`)
1. **Apple Guideline `5.1.2(i)` (Nov 13, 2025 Third-Party AI Consent Rule):**
   - Add an explicit pre-flight consent modal before any cloud LLM (`AWS Bedrock`) call naming the provider, stating only de-identified tokens are sent, and offering a revocable toggle in `Settings` that falls back to 100% on-device templates.
2. **Apple Guideline `5.1.3` (Health Privacy) — iOS App-Switcher Screen Blur Mask:**
   - Apply a `backdrop-filter: blur(24px)` privacy mask immediately on `visibilitychange` (`document.hidden`) / iOS backgrounding so child names never appear in iOS App Switcher snapshots, paired with `FaceID / TouchID` unlock.
3. **Apple Guideline `3.1.1(a)` & `3.1.3(b)` (US Storefront & StoreKit 2 Parity):**
   - Restrict App Store Connect availability to the **United States (`US`) storefront**, include native **StoreKit 2 In-App Purchase** (`15%` Small Business Program) inside iOS, and allow multiplatform sign-in for web/agency Stripe subscribers.
4. **3-Layer On-Device Safe Harbor Scrubber:**
   - Layer 1: Per-Child Known Roster Dictionary (`child`, `nicknames`, `caregivers`, `daycare`).
   - Layer 2: Kinship & Clinical Honorific Regex (`Grandma Betty`, `Ms. Green`, `Dr. Miller` -> `[CAREGIVER_OR_PROVIDER]`).
   - Layer 3: Street Address, Date, Phone, and 10-Digit Medicaid/BabyNet ID Regex.

### C. Immediate P0 Codebase Hardening Checklist (`prototype/v9.js` & `server.py`)
1. **Remove Hardcoded Passcode & Token (`v9.js`):** Remove any default `"mcmakin"` passphrase/token from public git and require a private device-stored passphrase (`PBKDF2-HMAC-SHA256 600,000 iterations`).
2. **Zero-Plaintext Sync (`server.py`):** Send and store **only** `encryptedVault` (`AES-256-GCM` ciphertext) on `/api/sync`, never plaintext `state`.
3. **Universal CMS 8-Minute Rule (`calcSilentUnits`):** Apply `m < 8 ? 0 : Math.min(16, Math.floor((m + 7) / 15))` across all 15-minute unit visit types (preventing `<8 min` visits from rounding to 1 unit).
4. **Dynamic Local Date (`TODAY_STR`):** Compute `TODAY_STR` dynamically from local device date in Jennifer mode so Today's Schedule advances automatically every day.
5. **Restore `<input type="date">` Statutory Engine:** Keep structured `DOB`, `Intake Date`, and `IFSP Start Date` date pickers on Child profiles so all statutory countdowns calculate automatically.
6. **Native On-Device Speech + Active Goals Strip + 12-Point `BRIDGES` Copy:** Wire native `SpeechRecognition` / `webkitSpeechRecognition` (0 MB download), display the child's active IFSP goals right above the microphone button, and format `copyVisitNote()` into the full 12-point `BRIDGES`/`Therap` note with automatic `12:00 PM – 12:59 PM` -> `24-Hour Military Time` conversion and `"Ready to Paste in BRIDGES"` triage filter.
