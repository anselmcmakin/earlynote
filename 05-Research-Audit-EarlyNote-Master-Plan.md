# 05 — Primary-Source Technical, Regulatory, App Store & Scope Audit of `EARLYNOTE_GROK_MASTER_HANDOFF.md` (and Live `v9/v10` Codebase)

**Document ID:** `EI-GOLD-05`  
**Prepared For:** Ansel ("Chef") McMakin, `Palmetto EI Builder` (`c90f53cd-a138-47a4-9b66-d5195377acbd`), & `@Cal · Chief of Staff` (`50d66704-e8cf-4150-8e3c-62c7388acdbe`)  
**Date:** Tuesday, October 27, 2026 (America/New_York, UTC-4)  
**Files Audited:**
1. `/workspace/ei-app/EARLYNOTE_GROK_MASTER_HANDOFF.md` (Master Plan & Architecture Brief)
2. `/workspace/ei-app/prototype/v9.js`, `v9.css`, `build_v9.py`, `server.py` (Live `EarlyNote` Codebase pushed to `anselmcmakin/earlynote` and `anselmcmakin/palmetto-ei-companion`)
3. `/workspace/ei-app/01-SC-BabyNet-DDSN-Gold-Standard.md`, `02-HIPAA-Privacy-Pricing-And-MVP-Gold-Standard.md`, & `04-Research-Deep-Dive-UX-And-SC-EI-Workflows.md`

---

## Executive Verdict

The strategic direction of **EarlyNote** (`$35/mo` individual, `$29/seat/mo` agency; **Zero Dollar Amounts** in UI; plain-English human labels on screen with clinical codes reserved for exported notes; Apple-first desktop + iPhone layout; zero-knowledge `AES-256-GCM` sync) is **spot-on**.

However, our line-by-line audit of `EARLYNOTE_GROK_MASTER_HANDOFF.md` against the **live `prototype/v9.js` + `server.py` codebase**, **SC BabyNet/OIDD regulations**, **HIPAA/FERPA**, and **Apple App Store Review Guidelines (updated through Nov 2025 / Oct 2026)** uncovered:
- **2 Immediate P0 Security / PHI Leaks in the Live Prototype (`v9.js` & `server.py`)** that must be patched before Jennifer enters a single real child's name.
- **6 Code-vs-Handoff Regressions in `v9.js`** where features promised as working in Section 2 & Section 3 of `EARLYNOTE_GROK_MASTER_HANDOFF.md` (statutory deadline math from `DOB` + `Intake Date`, real Web Speech dictation, CMS 8-minute unit math for home visits, `BRIDGES` 12:00 PM 24-hour time formatting, and 12-point exported notes) were stubbed or simplified out during the `v9/v10` UI refactor.
- **5 SC BabyNet / BHDD-OIDD Statutory Rules** in `EARLYNOTE_GROK_MASTER_HANDOFF.md` that are slightly inaccurate or missing critical audit guards (e.g., `T1027` daily cap is `4 units` regular / `16 units` with Make-Up, **not** `6 units`; `6-Month Review` is exact calendar-month anniversary, **not** `+ 180 days`; missing the **Zero-Overlap Collision Guard** and **May–June 2026 BabyNet form revisions**).
- **4 Apple App Store Review Blockers** (specifically **Guideline 5.1.2(i) Third-Party AI Consent Modal** added Nov 13, 2025, **Guideline 5.1.3 iOS App-Switcher Privacy Snapshot Blur**, **Guideline 3.1.1 / 3.1.3(b) US-Storefront vs. Non-US Stripe Link Gate**, and **Guideline 5.1.1(v) Demo Mode without Forced Login**).

---

## PART 1 — CRITICAL P0 SECURITY & CODEBASE FIXES (PATCH TODAY BEFORE JENNIFER ENTERS REAL DATA)

Before building Phase 1 backend infrastructure, **fix these 8 concrete bugs in `/workspace/ei-app/prototype/v9.js` and `server.py` immediately**:

### 1.1 [P0 SECURITY / PHI LEAK] Hardcoded `"mcmakin"` Passcode + Wrapped GitHub Token in Public Repo (`v9.js` Lines 8–24, 77, 1192, 2060)
- **What Is Happening Now:**
  - `prototype/v9.js` is pushed to a **public GitHub repository** (`https://github.com/anselmcmakin/earlynote`) and served publicly at `https://anselmcmakin.github.io/earlynote/`.
  - Lines 8–24 (`ENCRYPTED_CLOUD_VAULT_KEYS`) contain a live GitHub Personal Access Token (`cfg.token`) and Gist ID (`cfg.gistId`) encrypted with a PBKDF2 key derived from the literal string `"mcmakin"`, `"earlynote"`, or `"jennifer"`.
  - Lines 77, 96, 428, 1192, and 2060 explicitly hardcode and display `(passcode: mcmakin)` as the default passphrase in the public JavaScript bundle—and use that **same `"mcmakin"` string** to encrypt Jennifer's caseload (`encryptStateClientSide(state, "mcmakin")`) before uploading it to GitHub Gist!
- **Why This Is a P0 Emergency:**
  - Any person or bot scraping `github.com/anselmcmakin/earlynote` can run `await unlockCloudVaultConfig("mcmakin")` in DevTools, extract Ansel's live GitHub token, fetch the Gist, and run `await decryptStateClientSide(env, "mcmakin")` to read **100% of Jennifer's real caseload in plaintext** (and use the GitHub token to modify gists).
- **Exact Fix:**
  1. **Revoke/rotate the exposed GitHub token immediately.**
  2. **Remove `"mcmakin"` from all code, UI labels, and fallbacks in `v9.js`.** Never ship a default encryption passphrase in source code.
  3. On first launch in Jennifer mode, prompt Jennifer once to enter her own private **Vault Passphrase** (stored only in her device's `localStorage` / Keychain, never committed to git). If `ui.syncPasscode` is empty, keep data strictly in local storage until she sets her passphrase.

### 1.2 [P0 PHI LEAK] `server.py` Stores Raw Plaintext `state` Instead of `encryptedVault` (`server.py` Lines 105–124 & `v9.js` Line 565)
- **What Is Happening Now:**
  - `EARLYNOTE_GROK_MASTER_HANDOFF.md` Section 2 (line 22) claims: *"`prototype/server.py` — Lightweight local/cloud sync relay storing only encrypted `AES-256-GCM` ciphertext blobs."*
  - In reality, `v9.js` line 565 sends **both** plaintext `state` and `encryptedVault` (`body: JSON.stringify({ workspace, state, encryptedVault })`), and `server.py` lines 119–124 **ignores `encryptedVault` and writes raw plaintext `state` to `cloud_vault.json`**, while serving it back to any unauthenticated `GET /api/sync` caller (`Access-Control-Allow-Origin: *`).
- **Exact Fix:**
  - In `v9.js` (`syncToServer()`), remove `state` from the JSON body and send **only** `{ workspace, encryptedVault }`.
  - In `server.py`, store and return **only** `encryptedVault` (reject any payload containing plaintext `children` or `visits`).

### 1.3 [P0 BILLING MATH BUG] `calcSilentUnits()` Uses `Math.round(m / 15)` Instead of the CMS 8-Minute Rule for Visits (`v9.js` Lines 113–120)
- **What Is Happening Now:**
  - `v9.js` lines 115–119 only apply the CMS 8-Minute Rule (`Math.floor((m + 7) / 15)`) when `serviceType === "Phone Check-In"`. For `"Home Visit"`, `"Daycare Visit"`, and `"IFSP Review"`, it runs `Math.max(1, Math.round(m / 15))`.
  - That means a **5-minute cancelled/aborted home visit logs as `1 Unit`** (violating the CMS 8-Minute Rule and OIDD Ch. 3 Anti-Padding Rule) and a **22-minute visit logs as `1 Unit` instead of `1 Unit`, while 7.5 minutes rounds up**!
- **Exact Fix:**
  - Under **SC BabyNet Appendix A (p. 18)** and **CMS 15-Minute Timed Code Rules**, the 8-Minute Rule (`m < 8 ? 0 : Math.min(16, Math.floor((m + 7) / 15))`) applies to **all** 15-minute unit services (`T1027-TL`, `T1016-TL`, `T1018-TL`):
  ```javascript
  function calcSilentUnits(serviceType, minutes) {
    const m = Math.max(0, Math.min(240, Number(minutes) || 0));
    if (m < 8) return 0; // CMS 8-Minute Rule + OIDD Ch. 3 Anti-Padding Rule
    return Math.min(16, Math.floor((m + 7) / 15));
  }
  ```

### 1.4 [P0 DATE BUG] Hardcoded `TODAY_STR = "2026-10-26"` & Static `"Monday, October 26"` Header (`v9.js` Lines 4 & 1285)
- **What Is Happening Now:**
  - Line 4 hardcodes `const TODAY_STR = "2026-10-26";` and line 1285 hardcodes `<div class="page-title">Monday, October 26</div>`.
  - Today is **Tuesday, October 27, 2026**—so when Jennifer logs a visit today, `TODAY_STR` defaults to yesterday's date (`2026-10-26`), and the Today screen never advances to the real current day!
- **Exact Fix:**
  - In **Jennifer mode** (`!isDemoCaseload()`), compute `TODAY_STR` dynamically from local America/New_York device time (`new Date().toLocaleDateString('en-CA')`) and format the `Today` page header dynamically with `Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' })` (keep `"2026-10-26"` only when `isDemoCaseload() === true` so the 6 demo visits always display on the demo Today screen).

### 1.5 [P0 STATUTORY ENGINE REGRESSION] `renderChildEditorPage()` Replaced Auto-Calculated Statutory Deadlines with Manual Free-Text Inputs (`v9.js` Lines 1696–1770)
- **What Is Happening Now:**
  - Section 1 & Section 3.5 of `EARLYNOTE_GROK_MASTER_HANDOFF.md` state that EarlyNote *"calculates every statutory IFSP deadline from `DOB` + `Intake Date` + `IFSP Date`."*
  - In `v9.js` lines 1696–1720, the `Add Child` form only asks for free-text `Age`, `Date of Birth`, and a single manual text box `Next Upcoming Milestone ("e.g. 6-Month Review in 14 days")`. It does **not** compute age in months from `DOB`, nor does it auto-compute the 45-Day Initial IFSP, 6-Month Review, Annual IFSP, 27–33 Month LEA Transition window, or 3rd Birthday transition!
- **Exact Fix:**
  - In `renderChildEditorPage()`, use `<input type="date">` for **`DOB`**, **`Intake / Referral Date`**, and **`Current IFSP / FSP Start Date`** (optional if still in the 45-day intake window), plus a **`Program`** selector (`Birth–3 (BabyNet)` vs. `Ages 3–6 (DDSN)`).
  - Auto-calculate the child's exact age in months and all statutory milestones (`45-Day Initial Plan`, `6-Month Review` on exact 6-month calendar anniversary, `Annual Review` at `+365d`, `7-Day Prior Written Notice` at `Review - 7d`, `LEA Transition Window` at `DOB + 27m` to `DOB + 36m - 90d`, and `3rd Birthday Exit` at `DOB + 36m`).

### 1.6 [P0 VOICE ENGINE REGRESSION] `toggleVoiceRecording()` Is Currently a Hardcoded 1-Sentence Stub (`v9.js` Lines 1067–1077)
- **What Is Happening Now:**
  - Tapping `"Hold to Record 30s Voice Recap"` does not activate the microphone; on second tap it just inserts `"Family shared positive progress with daily communication routines at home this week."` into `#f-shared`.
- **Exact Fix:**
  - Wire the browser's native on-device **`SpeechRecognition` / `webkitSpeechRecognition`** API (which works out of the box in Safari on iPhone/Mac and Chrome on Desktop with zero server cost) + a live elapsed-seconds counter, routing the spoken transcript through a deterministic local parser that splits sentences across the 4 note boxes (`What the family shared`, `What we practiced together`, `How [Child] responded`, `Plan for next visit`) while keeping manual typing 100% editable.

### 1.7 [P0 EXPORT COMPLIANCE REGRESSION] `copyVisitNote()` Outputs Only 6 Lines Instead of the 12-Point Audit-Proof `BRIDGES`/`Therap` Note (`v9.js` Lines 1079–1097)
- **What Is Happening Now:**
  - Section 3 Rule 2 & Rule 5 of `EARLYNOTE_GROK_MASTER_HANDOFF.md` state: *"Keep billing codes strictly inside exported service notes"* and specify the **12-Point Audit-Proof Service Note Structure** + **24-Hour Military Time across 12:00 PM – 1:00 PM**.
  - Currently, `copyVisitNote()` in `v9.js` copies only 6 casual lines without the `24h` noon conversion (`v103` copies as `12:45 PM – 1:45 PM`, which triggers the `BRIDGES` `12:45 AM` bug!), without the targeted IFSP Goal/Outcome, without `T1027-TL` / `T1016-TL` code mapping, without Make-Up status, and without `Jennifer M. McMakin, BS, EI` signature attestation.
- **Exact Fix:**
  - Keep the **on-screen UI** 100% calm and human-friendly (4 warm textareas), but upgrade `copyVisitNote()` (and add a 1-tap `Copy for BRIDGES / Therap (12-Point Audit Format)` button) so the **clipboard output** automatically formats:
    1. Exact Start–End Time with automatic **`12:00 PM – 12:59 PM` $\rightarrow$ `24-Hour Military Time` (`12:45 – 13:45`)** conversion.
    2. Mapped Service Code (`Home Visit` / `Daycare Visit` $\rightarrow$ `Family Training / Special Instruction (T1027-TL)`; `Phone Check-In` $\rightarrow$ `Service Coordination (T1016-TL)`; `IFSP Review` $\rightarrow$ `IFSP / FSP Meeting (T1018-TL)`).
    3. Linked IFSP/Family Goal #1/#2 from the child's profile (`ACIS EI-429`).
    4. Distinct **EI Coaching Provided** vs. **Active Caregiver Participation (`ACIS EI-427`)** & **Child Response**.
    5. **Follow-Up Family Carryover Plan (`ACIS EI-426`)** + **EI Signature (`Jennifer M. McMakin, BS, EI`)**.

### 1.8 [P1 CALENDAR `.ICS` IMPORT BUG] `importCalendarIcs()` Creates Duplicate Fake Children (`v9.js` Lines 877–895)
- **What Is Happening Now:**
  - If Jennifer's Apple Calendar event is titled `"L.S. HV"` or `"Liam S. - Home"`, `importCalendarIcs()` fails exact name match and creates a fake child named `"L.S. HV"` with hardcoded `DOB: "Apr 10, 2025"` and `age: "18 months"`.
- **Exact Fix:**
  - Plug in the 40-line fuzzy initial/first-name/location matcher (`matchEventToChildRoster` from `04-Research-Deep-Dive-UX-And-SC-EI-Workflows.md` §1.2.C) so `"L.S."`, `"Liam S."`, or a matching street address/daycare automatically links to `Liam Smith` instead of polluting the caseload with fake children.

---

## PART 2 — AUDIT OF `EARLYNOTE_GROK_MASTER_HANDOFF.md` Across All 4 Lenses

### Lens 1: South Carolina BabyNet (`BRIDGES`) & SC BHDD-OIDD (`Therap` / `CDSS` / `ACIS`) Ground-Truth Audit

Cross-checking Section 3.5 of `EARLYNOTE_GROK_MASTER_HANDOFF.md` against the official **SCDHHS Early Intervention Services Provider Manual (Jan 2025)**, **SC BHDD-OIDD Early Intervention Manual (Sept 2025)**, **Sept 3, 2025 – June 2026 BRIDGES Announcements**, and **FY25 ACIS Key Indicators Review Tool**:

| Item in `EARLYNOTE_GROK_MASTER_HANDOFF.md` | Ground-Truth SC Regulation | Required Correction in Handoff & Code |
| :--- | :--- | :--- |
| **1. Units-Only Rule Check** (Sec 3.1, Line 27) | Chef's `v2` hard rule: **Zero dollar amounts or reimbursement rates anywhere in UI.** | ✅ **PASS:** Both `EARLYNOTE_GROK_MASTER_HANDOFF.md` and `prototype/v9.js` have zero `$` signs or Medicaid pay rates anywhere in the app UI (the only `$` figures in the handoff doc are SaaS subscription pricing `$35/mo` and `$29/seat/mo`). Keep this locked. |
| **2. `T1027-TL` Daily Cap Claim** (Sec 3.5, Line 45):<br>*"`T1027-TL` (Family Training) max `6 units/day` (90 min) per child"* | **INACCURATE:** Per **SCDHHS Provider Manual (Jan 2025)** and **Sept 3, 2025 BRIDGES Update**:<br>• Standard planned `T1027-TL` daily limit is **`4 units/day` (60 min)**.<br>• Standard monthly limit is **`16 units/month` (4 hours/mo)** (`>16 units/mo` requires an approved **OIDD Service Justification Form `EI-416`** within 14 days).<br>• On **Sept 3, 2025**, `BRIDGES` set the hard system daily cap (when combining a regular session + a separate `Make-Up` checkbox row) to **240 minutes (`16 units/day`) per service**. `6 units` (90 min) is merely a common 60m regular + 30m make-up example, NOT the statutory daily cap. | **Fix Line 45:** Change to:<br>*"`T1027-TL` (Family Training): standard `4 units/day` (60 min) and `16 units/month` (4 hrs/mo; `>16 units/mo` triggers `EI-416` Service Justification Form within 14 days). With a separate Make-Up Visit row (`Make-Up` checkbox added Sept 3, 2025), `BRIDGES` allows up to `16 units/day` (240 min) hard system cap."* |
| **3. `6-Month IFSP Review` Formula** (Sec 3.5, Line 50):<br>*"`IFSP Start Date + 180 days`"* | **AUDIT TRAP (`ACIS EI-406` & `OIDD Manual Ch. 11, p. 38`):**<br>SC OIDD and BabyNet enforce the **Exact Calendar Anniversary Rule**, NOT `+ 180 days`! Because May–October has 184 days (`31+30+31+31+30+31 = 184`), `+ 180 days` is 4 days off, whereas in non-leap Feb–July it differs in the other direction.<br>• Official Manual Quote (`OIDD Ch. 11, p. 38`): *"If the FSP was completed on `7/1/2025`, the six-month review is due no later than `1/1/2026`. If completed on `1/2/2026`, it was late."* | **Fix Line 50:** Change formula from `IFSP Start Date + 180 days` to **`Exact 6-Calendar-Month Anniversary (addMonths(IFSP_Start_Date, 6))`** with zero grace period. |
| **4. `Annual IFSP Redetermination` Formula** (Sec 3.5, Line 51):<br>*"`IFSP Start Date + 365 days`"* | **MISSING DDSN 6-MONTH LINKAGE (`ACIS EI-405`):**<br>For DDSN (Ages 3–6), the Annual FSP is due **`Min(IFSP_Start_Date + 365 days, Six_Month_Review_Date + 6 calendar months)`**—and **zero billing is permitted after expiration (`Not BTW` hard stop)**. Furthermore, **within 30 days prior** to the Annual IFSP, the EI must complete the **Hearing & Vision Questionnaire (`BN-F06` / `EI-439`)**, **Routines-Based Interview (`BN-F07` / `EI-413`)**, **Annual CBA (`EI-424`, $\le 14$ days prior for DDSN)**, and **Annual Provider Choice (`EI-434`)**. | **Fix Line 51:** Add the **30-Day Pre-Annual Bundle trigger (`Due - 30d`)** and the DDSN **14-Day Pre-FSP CBA window (`Due - 14d`)**. |
| **5. Missing Anti-Overlap / Double-Billing Collision Guard** (Sec 3.5) | **CRITICAL `BRIDGES` REJECTION RULE:**<br>`BRIDGES` rejects any service log whose start/end clock times overlap by even 1 minute with another log on the same day—across the *entire caseload* or between `T1027` and `T1016` for the same child (`OIDD Ch. 7 & Ch. 9, p. 26`). Also, **virtual/telehealth Family Training (`T1027`) is strictly illegal** (`OIDD Ch. 9, p. 24`: *"Neither OIDD nor Medicaid allow for the provision of virtual Family Training"*). | **Add to Sec 3.5:**<br>1. **Same-Day Time-Overlap Guard:** Warn immediately if two visits on the same date have overlapping `startTime`–`endTime` ranges.<br>2. **No Virtual `T1027` Guard:** Block selecting `Telehealth / Phone` when the service type is `Family Training (T1027)`. |
| **6. Missing Service Note 7-Calendar-Day Submission Deadline** (Sec 3.5) | Per **BabyNet Appendix A (p. 11)**, every service log must be entered into `BRIDGES` within **7 Calendar Days** of the date of service (and **3 Business Days** in `Therap`/`CDSS` for demographic/eligibility updates per `OIDD Ch. 7`). | **Add to Sec 3.5:** Track an **"Unentered in BRIDGES / Therap"** status on completed notes with an amber badge at `5 days` and red badge at `6–7 days` after the visit date. |
| **7. Missing May–June 2026 SC BabyNet Form Revisions & Age 3/5/6 Rules** (Sec 3.5) | Missing from `EARLYNOTE_GROK_MASTER_HANDOFF.md`:<br>• **7-Day Non-Waivable Prior Written Notice (`BN-F01` / `ACIS EI-403`)** due `Meeting_Date - 7 calendar days`.<br>• **DDSN Continuation FSP Window (`[3rd Birthday - 14d, 3rd Birthday - 1d]`)** (`OIDD Ch. 11, p. 36`).<br>• **Age 5+ DDSN Continuation Justification (`EI-436`)** due `5th Birthday - 14 calendar days`.<br>• **May–June 2026 Revised BabyNet Forms:** `BN-F04` Insurance Consent (`Rev 05/26/2026`), `BN-F05` IFSP Consent (`Rev 05/07/2026`), and `BN-F14` Claims Inquiry (`Rev 06/01/2026`). | **Add to Sec 3.5 & Phase 2:** Include these exact statutory windows in the countdown engine. |

---

### Lens 2: HIPAA / FERPA / IDEA Part C Confidentiality & "Zero-PHI vs. Cloud AI" Audit

| Pipeline Step in `EARLYNOTE_GROK_MASTER_HANDOFF.md` | Hidden PHI / Compliance Vulnerability | Concrete Engineering Fix |
| :--- | :--- | :--- |
| **1. Step 2 On-Device 18-Identifier Scrubber** (Sec 4.2, Line 67):<br>*"Strips child names, caregiver names, addresses, DOBs, phone numbers, and Medicaid IDs on the device (`"Liam"` -> `[CHILD_1]`)"* | **THE "UNLISTED RELATIVE / DAYCARE / STREET" LEAK:**<br>A deterministic roster scrubber easily strips `child.firstName ("Liam")`, `child.lastName ("Smith")`, and `child.caregiver ("Sarah")` because those strings are in the child's profile. **What happens when Jennifer dictates in the car:**<br>*"Met with Liam and his grandma Betty at 142 Oak Street near Prisma Patewood; Dr. Miller at Greenville Peds called..."*?<br>If `"Grandma Betty"`, `"142 Oak Street"`, or `"Dr. Miller"` aren't in the child's roster fields, a naïve dictionary scrubber sends them in plaintext to the cloud LLM—violating the **Zero-PHI Safe Harbor claim (`45 CFR § 164.514(b)`)**! | **3-Layer On-Device Scrubber Spec:**<br>1. **Roster Dictionary Match:** Exact + phonetic (Double Metaphone/Levenshtein $\le 1$) match for Child Name, Nickname, Caregiver Name(s), Daycare Name, and Street Address.<br>2. **Contextual Honorific & Kinship Regex:** Automatically scrub any capitalized word(s) following kinship/clinical titles (`/\b(?:Mom|Mother|Dad|Father|Grandma|Nana|Grandpa|Aunt|Uncle|Sister|Brother|Foster\s+Mom|Ms\.|Mr\.|Mrs\.|Dr\.|Miss|Teacher|Nurse)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g` $\rightarrow$ `[CAREGIVER_OR_PROVIDER]`).<br>3. **Street / Date / Number Regex:** Scrub street suffixes (`/\b\d+\s+[A-Za-z0-9\s]{1,25}\b(?:St|Street|Rd|Road|Ave|Dr|Drive|Ln|Lane|Ct|Way|Blvd|Hwy)\b/gi` $\rightarrow$ `[ADDRESS]`), all month/day dates (`[DATE]`), phones, ZIPs, and IDs **before** any cloud call. |
| **2. "Zero-PHI Cloud" vs. Cloud LLM Reality** (Sec 1 Line 9 vs. Sec 4.2 Line 68) | If *any* free-text clinical transcript leaves the device to hit a cloud LLM (`AWS Bedrock` or `Vertex AI`), an auditor can challenge whether a regex/dictionary scrubber achieves 100.0% HIPAA Safe Harbor de-identification (`45 CFR § 164.514(b)(2)(ii)` requires *no actual knowledge* that residual info could identify the child). | **Keep BOTH Defenses Active & Offer a 100% On-Device Mode:**<br>1. **Mode A (Default Instant Zero-Cloud Mode):** Use on-device Apple Speech / Web Speech API + deterministic on-device template structuring (or Apple's on-device `FoundationModels` in iOS 26 / macOS) so **0 bytes ever leave the device**.<br>2. **Mode B (Cloud AI Polish Mode):** Scrub all 18 identifiers locally AND send only through an **AWS Bedrock / GCP Vertex AI endpoint covered by a signed HIPAA BAA with Zero Data Retention (ZDR)**—so even if a stray token ever slipped past the scrubber, it is legally covered under a HIPAA BAA with zero logging. |
| **3. Push Notifications & Email Alerts** (Sec 4.5 Line 75 & Sec 5.2 Line 104) | If an iOS APNs or web push notification says `"⚠️ Liam Smith's 6-Month IFSP Review is due in 7 days"`, that string transits Apple Push Notification service (APNs) servers in plaintext and renders on a locked iPhone screen visible to anyone nearby—a textbook **HIPAA / BabyNet Appendix A (p. 8) lock-screen breach**! | **Enforce Zero-PHI Local/Push Notifications:**<br>• **Best Architecture (Zero Server Table Needed!):** Schedule statutory deadline reminders **100% locally on the device** via Capacitor `@capacitor/local-notifications` (`UNUserNotificationCenter`). The server does not even need a `deadline_alerts` table!<br>• **Lock-Screen Redaction Rule:** Notification text must NEVER include a child's full name on the lock screen (e.g., `"📅 EarlyNote: 1 family has a 6-Month Plan Review due in 7 days (Send 7-Day Notice). Tap to view with FaceID."`). |
| **4. Key Derivation Spec Inconsistency** (`EARLYNOTE_GROK_MASTER_HANDOFF.md` Line 20 vs. Line 101 vs. `v9.js` Line 50) | • Line 20 says `PBKDF2 (120,000 iterations)`<br>• Line 101 says `Argon2id / PBKDF2 250k iterations`<br>• `v9.js` Line 50 actually uses `100,000 iterations` | Standardize on **OWASP 2025/2026 minimum `PBKDF2-HMAC-SHA256` = `600,000 iterations`** (or `Argon2id` `m=64MB, t=3, p=1`), which executes in `<90ms` in WebCrypto on iPhone/Mac. |

---

### Lens 3: Apple App Store Review Guidelines Audit (5.1.3 Health, 5.1.2(i) AI Consent, 3.1.1 / 3.1.3(b) Payments, 4.2 Minimum Functionality)

If we submit the iOS app described in Section 4 & Section 5 of `EARLYNOTE_GROK_MASTER_HANDOFF.md` without the following 5 additions, **Apple App Review will reject the binary on its first pass**:

1. **Apple Guideline `5.1.2(i)` — Mandatory Third-Party AI Data Sharing Disclosure & Opt-In Consent (Added November 13, 2025):**
   - **Why Apps Get Rejected in 2026:** Since Apple's Nov 13, 2025 revision to Guideline `5.1.2(i)`, App Review automatically rejects any app that sends user-generated text or audio (even de-identified transcripts!) to an external AI provider (OpenAI, Anthropic, AWS Bedrock, Google Vertex AI) unless the app presents an **explicit, in-app pre-flight consent modal** *before* the first AI call.
   - **What Must Be in the Modal (Privacy Policy alone is rejected!):**
     1. **What data is sent:** *"De-identified visit recap text (with child names, dates, and addresses removed on your device)."*
     2. **Who receives it:** Name the exact provider (e.g., *"AWS Bedrock (Anthropic Claude) under a zero-data-retention HIPAA Business Associate Agreement"*).
     3. **Affirmative Opt-In & Revocation Toggle:** An explicit `[Allow AI Note Formatting]` vs. `[Use On-Device Templates Only]` button before the first voice note is processed, plus a toggle in `Settings` to withdraw consent at any time while keeping the app 100% functional via on-device templates (`Guideline 5.1.1(ii)`).
2. **Apple Guideline `5.1.3` (Health & Health Research) + HIPAA `45 CFR § 164.312(a)(2)(iii)` — iOS App-Switcher Screen Blur Mask:**
   - When an EI switches from `EarlyNote` to `Messages` or `Maps` on her iPhone, iOS takes a screenshot of the current screen for the multitasking App Switcher. If a child's name and IFSP outcomes are visible in that snapshot, it violates healthcare privacy best practices.
   - **Mandatory Fix:** On `visibilitychange` (`document.hidden`) / Capacitor `appStateChange` (`!isActive`), immediately apply a CSS privacy overlay (`backdrop-filter: blur(24px)`) hiding all caseload text until the user returns and passes `FaceID / TouchID`.
3. **Apple Guideline `3.1.1`, `3.1.1(a)` & `3.1.3(b)` — Stripe Checkout vs. StoreKit 2 In-App Purchase Rules (2026 US Storefront Rules):**
   - Section 5.4 of `EARLYNOTE_GROK_MASTER_HANDOFF.md` plans to use **Stripe Checkout** (`2.9%`) on Web and **StoreKit 2 + RevenueCat** (`15%` Apple Small Business Program) on iOS.
   - **Two Critical App Review Rules to Enforce:**
     1. **Parity Rule (`3.1.3(b)` Multiplatform Services):** An iOS app may allow existing web subscribers (or `$29/seat/mo` Agency seats bought on the web) to sign in and unlock the app, **ONLY IF** individual users can also purchase the subscription inside the iOS app via native **StoreKit 2 In-App Purchase (`3.1.1`)**.
     2. **Storefront Geolocation Gate (`3.1.1(a)`):** Following the US court injunction, apps on the **United States storefront (`Storefront.current.countryCode == "USA"`)** are allowed to display an external link/button to Stripe Checkout without a special entitlement. However, if you leave the Global storefronts checked in App Store Connect and a non-US reviewer sees an external Stripe link, **the app will be rejected immediately**.
     - **Simple Fix:** In App Store Connect, restrict distribution strictly to the **United States (`US`) storefront** (since EarlyNote serves US IDEA Part C / SC Early Intervention), AND offer both native Apple Pay / StoreKit 2 IAP (`$35/mo` / `$348/yr`) and account sign-in for web/agency subscribers.
4. **Apple Guideline `5.1.1(v)` & `2.1` — Unauthenticated Demo Mode + Reviewer Test Credentials:**
   - Because EarlyNote's core value (calculating IFSP deadlines, recording a voice note, and tracking units) works locally on the device, forcing a mandatory sign-up wall before the user can even see the workspace triggers `Guideline 5.1.1(v)` friction.
   - **Simple Fix:** Allow the user (and the Apple Reviewer!) to open the app directly into local mode (with a 1-tap `Try 6-Child Sample Caseload` button) and require account sign-in (`Sign in with Apple` / Email) + Subscription only when enabling **Cross-Device Cloud Sync** or after their **14-Day Free Trial / first 10 AI notes**.
5. **Apple Guideline `4.2` (Minimum Functionality for Capacitor/WebView Apps):**
   - Apple rejects Capacitor wrappers that feel like a mobile website inside Safari.
   - **How We Pass `4.2` Easily:** Wire 4 lightweight native Capacitor plugins on iOS:
     1. `@capacitor/haptics` (tactile impact when tapping Record, crossing an 8-minute unit boundary, or copying a note).
     2. `@aparajita/capacitor-biometric-auth` (`FaceID` / `TouchID` vault unlock).
     3. `@capacitor/local-notifications` (native iOS deadline alerts at `30d`, `14d`, and `7d`).
     4. Native iOS Share Sheet (`@capacitor/share`) for `.ics` calendar exports and JSON backups.

---

### Lens 4: v1.0 Scope Discipline — What to ADD/Fix vs. What to REMOVE/Defer

Chef's #1 product law from `EI-GOLD-02` is:
> *"Usability, simplistic, and clean, easy to manage and not overbearing UI. Because our customers are not tech people. They want something that is going to be simple and save them time and take away stress. Start small and not try to add a million features also. Get one piece perfect at a time."*

Looking at **Section 4 Phase 1 (Lines 61–76)** and **Section 5 (Lines 97–115)** of `EARLYNOTE_GROK_MASTER_HANDOFF.md`, Phase 1 tries to ship **FIVE separate software products at the same time** (a Tauri v2 Mac `.dmg`, a Tauri v2 Windows `.exe`, a Capacitor iOS `.ipa`, a Capacitor Android `.apk`, AND a Manifest V3 Chrome/Safari Browser Extension, plus 6 PostgreSQL tables, Clerk/Supabase Auth, Stripe, RevenueCat, AWS Bedrock, and WhisperKit)!

Trying to build all of that for v1.0 will delay Jennifer getting a rock-solid product and introduce cross-platform maintenance bloat. Here is our sharp, opinionated **v1.0 Scope Cut & Upgrade Matrix**:

#### A. What to REMOVE or DEFER from Phase 1 (`v1.0`) -> Move to Phase 2 (`v1.5 / v2.0`)

| Feature Currently Listed in Phase 1 of Handoff | Why It Should Be Cut / Deferred from `v1.0` | What to Ship in `v1.0` Instead |
| :--- | :--- | :--- |
| **1. Tauri v2 Mac `.dmg` + Windows `.exe` + Android `.apk` Builds** (Sec 4.1, Lines 63–64) | Building, code-signing, notarizing, and debugging 4 separate native binaries (`Tauri Mac`, `Tauri Windows`, `Capacitor iOS`, `Capacitor Android`) + SQLite native bindings in Week 1 triples engineering surface area for **zero extra clinical value**. On Mac/Windows desktop, EIs already have `BRIDGES` and `Therap` open inside **Chrome or Safari**! | **Ship in `v1.0`:**<br>1. **Desktop Web / Standalone PWA (`Add to Mac Dock` / Chrome App)** — works side-by-side with `BRIDGES` right now with zero `.dmg` Gatekeeper warnings.<br>2. **Native iOS App (`.ipa` via Capacitor 6)** for iPhone/iPad App Store & TestFlight.<br>*(Move Tauri `.dmg`/`.exe` and Android `.apk` to `v1.5` once iOS + Web are perfected.)* |
| **2. Chrome/Safari `Manifest V3` Browser Auto-Fill Extension** (Sec 4.3, Lines 70–71) | Chrome Web Store + Safari App Extension review takes 1–3 weeks, and SC DHHS frequently tweaks `BRIDGES` DOM field IDs (like the Sept 3, 2025 `Make-Up` checkbox and Jan 27, 2026 changes). If a DOM selector breaks, an EI could accidentally paste a note into the wrong child's `BRIDGES` log! | **Ship in `v1.0`:**<br>**Granular 1-Click Copy Pills** inside the Desktop Note Studio (`[⚡ Copy Full 12-Point Note]`, `[Copy Narrative Only]`, `[Copy 24h Time: 12:45–13:45]`, `[Copy Units: 4]`) + keyboard shortcut `Cmd+Enter` to Copy & Advance. It never breaks when `BRIDGES` updates its HTML! *(Move the browser extension to Phase 2.)* |
| **3. Heavyweight `WhisperKit` (~150MB–500MB Model Download) on First Launch** (Sec 4.2, Line 66) | Making a non-technical EI wait for a 300MB neural model download over cellular data in a driveway before she can dictate her first 30-second note will kill onboarding conversion. | **Ship in `v1.0`:**<br>Use **Apple's built-in on-device `SFSpeechRecognizer` (`requiresOnDeviceRecognition = true`)** on iOS Capacitor and **Web Speech API (`SpeechRecognition`)** on Desktop. It requires **0 MB download**, launches in `<50ms`, runs 100% on-device on every modern iPhone/Mac, and costs `$0`. |
| **4. Over-Engineered 6-Table Plaintext + 3-Table Encrypted PostgreSQL Schema for Solo EIs** (Sec 5.2, Lines 103–105) | You don't need `agencies`, `agency_memberships`, `devices`, and a server-side `deadline_alerts` table in `v1.0` when agency multi-seat is a Phase 3 (`v3.0`) feature and deadline notifications should be scheduled locally on the phone! | **Ship in `v1.0`:**<br>Just **3 ultra-clean Supabase tables** with RLS:<br>1. `profiles` (`user_id`, `email`, `subscription_status`, `created_at`)<br>2. `vault_records` (`user_id`, `record_id`, `record_type`, `version`, `updated_at`, `iv`, `ciphertext`, `salt`)<br>3. `audit_events` (`user_id`, `event_type`, `record_id`, `timestamp` — zero PHI). |
| **5. Parent Finger E-Signature Canvas on Phone inside Phase 1** (Sec 4.4, Lines 72–73) | Handing a personal unlocked iPhone to a parent or toddler in a living room is awkward for many EIs in week 1, and printing/texting PDFs adds layout complexity before the core voice-to-note flow is battle-tested. | **Ship in `v1.0`:**<br>**1-Tap `"Copy / Print Family Leave-Behind Summary"`** formatted cleanly from the 4 note boxes (`What we practiced` + `Plan for next visit`). Move interactive finger-signature canvas + `pdf-lib` official form stamping (`OIDD-F02`, `BN-F01`) to **Phase 1.5 / Phase 2**. |

---

#### B. HIGH-LEVERAGE ADDITIONS to Fold Into `v1.0` (Small Code Footprint, Massive Unfair Edge for Jennifer)

1. **Pre-Dictation "Active Goals Prompt Strip" Right Above the Microphone Button (`15 lines of JS`):**
   - Right now in `v9.js` (`renderVisitEditorPage()`), when Jennifer opens a visit note to dictate, the child's active IFSP/Family Goals (`c.goals`) are hidden on a completely different screen (`Child Profile`)! When she is sitting in her car after 4 visits, she has to remember which goal belongs to which child.
   - **Addition:** Render a compact, warm 2-line card directly above the `Record Voice Recap` button showing **${c.firstName}'s Current Family Goals** (and let her tap a goal pill to auto-tag it in the note).
2. **Real-Time `BRIDGES` 24-Hour Noon Guard + Same-Day Overlap Warning (`25 lines of JS`):**
   - In `renderVisitEditorPage()`, replace the plain text input `<input id="f-time" type="text">` with a clean start-time picker + duration stepper that automatically computes `End Time`, converts `12:00 PM – 12:59 PM` spans to **`24-Hour Military Time` (`12:45 – 13:45`)** with a subtle `"24h BRIDGES Noon Format"` badge, and warns if two visits on the same day overlap.
3. **Make-Up Visit 1-Tap Split Toggle (`20 lines of JS`):**
   - Add a simple checkbox/pill inside the Visit Editor: `[ ] Includes Make-Up Time`. When checked (e.g., `60 min regular + 30 min make-up`), the exported note automatically outputs **Row 1 (`Regular Units`)** and **Row 2 (`Make-Up Units — Check BRIDGES Make-Up Box`)** with non-overlapping times (`2:00–3:00 PM` and `3:00–3:30 PM`).
4. **"Copied / Logged in BRIDGES" Triage Filter (`15 lines of JS`):**
   - Distinguish between **`Note Written`** (drafted in the car) and **`Logged in Portal ✓`** (pasted into `BRIDGES` / `Therap` at the laptop) so Jennifer can filter `All Notes` by **`Ready to Paste in BRIDGES (2)`** at the end of the day!
5. **Rural Dead-Zone `OPFS` / `IndexedDB` Audio & Draft Auto-Save (`25 lines of JS`):**
   - Save every keystroke and voice transcript chunk to `localStorage` / `IndexedDB` on `oninput` so if Jennifer gets a phone call in the middle of writing a note in a rural driveway, zero words are lost if Safari refreshes.

---

## PART 3 — SECTION-BY-SECTION DIFF RECOMMENDATIONS FOR `EARLYNOTE_GROK_MASTER_HANDOFF.md`

Below are the exact text edits `Palmetto EI Builder` should apply to `/workspace/ei-app/EARLYNOTE_GROK_MASTER_HANDOFF.md` so the master specification is 100% accurate, compliant, and aligned with Chef's vision:

### Diff 1 — Section 2 (`Live Repositories & Codebase Structure`, Lines 18–23)
- **Update Line 20 (`PBKDF2` & Encryption Spec):**
  - Change `PBKDF2 (120,000 iterations)` to `PBKDF2-HMAC-SHA256 (600,000 iterations, OWASP 2026 standard) + AES-256-GCM zero-knowledge encryption with user-supplied passphrase (never hardcoded in source)`.
- **Update Line 22 (`prototype/server.py`):**
  - Ensure `server.py` accepts and stores **only** `encryptedVault` (`{ v, alg, kdf, updatedAt, salt, iv, ciphertext }`) and never receives or persists plaintext `state`.

### Diff 2 — Section 3.5 (`South Carolina BabyNet & DDSN Statutory Rules`, Lines 37–55)
- **Replace Line 45 (`Daily Cap`):**
  ```markdown
  - **Daily & Monthly Caps:**
    - `T1027-TL` (Family Training): Standard `4 units/day` (60 min) and `16 units/month` (4 hours/mo). Authorizing `>16 units/month` requires submitting an **OIDD Service Justification Form (`ACIS EI-416`)** within 14 calendar days. When combining a regular visit with a separate Make-Up row (`Make-Up` checkbox added Sept 3, 2025), `BRIDGES` enforces a hard daily cap of **`16 units/day` (240 min) per service**.
    - `T1016-TL` (Service Coordination): Max `16 units/day` (240 min); standard `8 units/month` (120 min) guideline, with a mandatory minimum **1x/calendar month** monitoring contact (`OIDD Ch. 12`).
    - `T1018-TL` (IFSP / FSP Assessment & Meeting): Max `8 units/day` (120 min).
  ```
- **Add Anti-Overlap & In-Person Rules right after Line 48:**
  ```markdown
  - **Zero Time-Overlap & Separation of Services Rule (`OIDD Ch. 7 & Ch. 9, p. 26`):** `BRIDGES` rejects any service logs with overlapping start/end times on the same day across the caseload or between `T1027` and `T1016`. Family Training (`T1027`) and Service Coordination (`T1016`) must be documented in separate time blocks, and **virtual/telehealth `T1027` Family Training is strictly prohibited** (`OIDD Ch. 9, p. 24`).
  - **7-Calendar-Day Service Log Entry Window (`BabyNet Appendix A, p. 11`):** Every service note must be logged in `BRIDGES` within **7 calendar days** of the date of service (and demographic/eligibility updates in `Therap`/`CDSS` within **3 business days**).
  ```
- **Replace Lines 49–53 (`Statutory IFSP Countdowns`) with the Exact Legal Formulas:**
  ```markdown
  - **Statutory IFSP / FSP Countdowns (Auto-Calculated from `DOB` + `Intake Date` + `IFSP Start Date`):**
    - **2-Business-Day Initial Family Contact (`ACIS EI-401`):** `Intake Date + 2 business days`.
    - **45-Day Initial IFSP / FSP (`34 CFR § 303.310`):** `Intake/Referral Date + 45 calendar days` (exempt if referred `<45 days` before 3rd birthday per *OSEP Policy Letter to Nix*).
    - **7-Day Non-Waivable Prior Written Notice (`BN-F01` / `ACIS EI-403`):** `Scheduled Meeting Date - 7 calendar days` (family cannot waive the 7-day notice).
    - **30-Day Timely Service Initiation (`ACIS EI-417`):** `IFSP Start Date + 30 calendar days`.
    - **6-Month Periodic Review (`ACIS EI-406` / `OIDD Ch. 11, p. 38`):** **Exact 6-Calendar-Month Anniversary** (`addMonths(IFSP_Start_Date, 6)`, zero grace period—e.g., `7/1/2026 -> 1/1/2027`, NOT `+ 180 days`). For DDSN (Ages 3–6), requires updated CBA (`HELP`/`Carolina`) within 14 days prior (`ACIS EI-424`).
    - **365-Day Annual IFSP / FSP Redetermination (`ACIS EI-405`):** `Min(IFSP Start Date + 365 days, 6-Month Review + 6 calendar months)` (**Hard billing stop if expired**). Triggers the **30-Day Pre-Annual Bundle** (`Hearing & Vision BN-F06 / EI-439`, `RBI Family Assessment BN-F07 / EI-413`, `Annual CBA EI-424`, `Provider Choice EI-434`, and `May 2026 Revised Insurance & IFSP Consents BN-F04 / BN-F05`).
    - **IDEA Part B School District (LEA) Transition (`34 CFR § 303.209` / `ACIS EI-419–421`):** Window opens at **`DOB + 27 calendar months`** (`BN-F09` LEA Referral) and **MUST complete by `DOB + 36 months - 90 calendar days` (~33 months)** (`BN-F10` Transition Conference).
    - **DDSN Ages 3–6 Continuation FSP Window (`OIDD Ch. 11, p. 36`):** Completed within **`[3rd Birthday - 14 calendar days, 3rd Birthday - 1 day]`**, effective on the 3rd birthday.
    - **BabyNet Part C Hard Exit & Exit COS (`ACIS EI-410`):** **`DOB + 36 calendar months`** (3rd birthday; zero Part C billing on/after 3rd birthday).
    - **DDSN Age 5+ Service Justification (`ACIS EI-436`) & Age 6 Final Exit:** Justification due **`5th Birthday - 14 calendar days`**; final EI exit at **`6th Birthday - 1 day`**.
  ```

### Diff 3 — Section 4 (`Full Future Feature Roadmap`, Lines 61–94)
- **Refine Phase 1 (`v1.0` Launch Scope) so it ships fast and clean:**
  - **1. Platforms (`v1.0`):** Ship **Standalone Desktop/Mobile PWA** (`Add to Mac Dock` / `Add to iPhone Home Screen`) + **Capacitor 6 Native iOS App (`.ipa`)**. Move **Tauri v2 Mac/Windows (`.dmg`/`.exe`)** and **Android (`.apk`)** to **Phase 1.5 (`v1.5`)**.
  - **2. Voice-to-Note AI Pipeline (`v1.0`):** Use zero-download native **Apple On-Device `SFSpeechRecognizer` (`requiresOnDeviceRecognition = true`) / Web Speech API** + **3-Layer On-Device 18-Identifier Scrubber** (Roster dictionary + Kinship/Honorific regex + Address/Date/ID regex) + **Apple Guideline `5.1.2(i)` Opt-In AI Consent Modal** before any BAA-covered `AWS Bedrock` / `Vertex AI` formatting call (with instant 100% on-device fallback if offline or opted out).
  - **3. `BRIDGES` & `Therap` Export (`v1.0` vs `v2.0`):** In `v1.0`, ship **1-Click Granular Copy Pills + `Cmd+Enter` Rapid Paste Triage (`Ready to Paste in BRIDGES`)**. Move the **Chrome/Safari `Manifest V3` DOM Auto-Fill Extension** and **Parent Finger E-Signature + `pdf-lib` Official SC PDF Stamping (`OIDD-F02`, `BN-F01`, `BN-F09`)** to **Phase 2 (`v2.0`)**.

### Diff 4 — Section 5 (`Production Backend Checklist`, Lines 97–115)
- **Add the 4 Mandatory Apple App Store Review Guards to Section 5.5:**
  1. **Guideline `5.1.2(i)` (Nov 13, 2025 AI Consent Rule):** Explicit pre-flight consent modal naming the BAA AI provider, specifying that only de-identified tokens are sent, and providing a revocable toggle in `Settings`.
  2. **Guideline `5.1.3` (Health Privacy):** Automatic iOS App-Switcher background blur mask (`backdrop-filter: blur(24px)` on `appStateChange` / `visibilitychange`) + `FaceID / TouchID` lock after 2 minutes.
  3. **Guideline `3.1.1(a)` & `3.1.3(b)` (Payments):** Restrict App Store Connect availability to the **United States (`US`) storefront**, offer native **StoreKit 2 In-App Purchase** (`15%` Small Business Program) inside iOS, and allow multiplatform sign-in for web/agency Stripe subscribers.
  4. **Guideline `5.1.1(v)` (Account Sign-In & Deletion):** Allow unauthenticated local trial/demo exploration before sign-in, and include the 1-tap **"Delete Account & Cryptographically Shred Vault"** action.

---

## PART 4 — IMMEDIATE EXECUTION CHECKLIST FOR `PALMETTO EI BUILDER`

1. **Step 1 (Today — 30 Mins):** Patch the 8 items in **Part 1** inside `/workspace/ei-app/prototype/v9.js` and `server.py` (remove hardcoded `"mcmakin"` passcode/token exposure, stop posting plaintext `state` to `server.py`, fix `calcSilentUnits` to apply the 8-minute rule across all service types, make `TODAY_STR` dynamic in Jennifer mode, restore auto-calculated statutory deadlines from `DOB` + `Intake Date` + `IFSP Date`, wire real Web Speech API dictation + active goals prompt strip above the mic, and upgrade `copyVisitNote` to output the full 12-point `BRIDGES`/`Therap` note with automatic `12:00 PM – 12:59 PM` 24-hour time formatting).
2. **Step 2 (Today — 10 Mins):** Apply the 4 Section Diffs in **Part 3** to `/workspace/ei-app/EARLYNOTE_GROK_MASTER_HANDOFF.md` and the Canvas page (`c018167b-9fdd-4908-b8a6-51e267a71e39`).
