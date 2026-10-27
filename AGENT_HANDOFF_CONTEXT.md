# Palmetto EI Companion — Complete Builder Handoff & Context
**Last Updated:** Monday, Oct 26, 2026
**Owner:** Ansel ("Chef") McMakin & Jennifer M. McMakin (Practicing SC Early Interventionist & former teacher)
**Repository:** `https://github.com/anselmcmakin/palmetto-ei-companion` (Private repo, branch `main`)

---

## 1. Core Product Vision & North Star
- **What We Are Building:** A standalone subscription SaaS application (**iOS + Android + Web**, NOT a Grok Bot template) for Early Interventionists (EIs), starting with **South Carolina BabyNet (IDEA Part C, Birth–3)** and **SC DDSN (Ages 3–6)**.
- **Target Pricing:** `$35/month` individual subscription (`$29/seat/month` for EI agencies), backed by `~97.7%` gross margins (`~$0.80/mo` AI COGS per user).
- **Synced Cross-Platform Experience:** Must work on both **Mobile (iPhone/Android)** and **Desktop (Mac/Windows Web)** with a synced user login (`Jennifer McMakin, EI`) so an EI can dictate a 30-second voice note in her car after a home visit on her phone and immediately copy/paste it into **BRIDGES** or **Therap** on her laptop.

---

## 2. Key Files in `/workspace/ei-app/`
1. **`/workspace/ei-app/01-SC-BabyNet-DDSN-Gold-Standard.md` (`51 KB`):**
   - Exact SC BabyNet & DDSN billing codes (`T1027-TL` Family Training & `T1016-TL` Service Coordination).
   - **CMS 8-Minute Rule** unit conversion table (`8–22 min = 1 unit`, `23–37 min = 2 units`, `38–52 min = 3 units`, `53–67 min = 4 units`).
   - **BRIDGES 12:00 PM Military-Time Bug:** Visits between `12:00 PM` and `12:59 PM` must display 24-hour time (`12:45–13:30`) so BRIDGES does not miscalculate them as `12:00 AM` (`52+` units).
   - **Make-Up Visit Split Logging:** If a visit combines regular weekly time + make-up time, it must split into two separate BRIDGES log entries.
   - **12-Point Audit-Proof Service Note Standard:** Every note must include: (1) Prior Carryover Follow-up, (2) IFSP Outcome & Evidence-Based Coaching Strategy Taught, (3) Active Caregiver Participation & Child Response, and (4) Next-Visit Family Carryover Plan.
   - **Statutory Compliance Timeline Formulas (Auto-calculated from `DOB` + `Intake Date` + `IFSP Start Date`):**
     - `45-Day Initial IFSP Meeting` = `Intake Date + 45 calendar days`
     - `6-Month Periodic Plan Review` = `IFSP Start Date + 180 days` (with 7-day advance written notice reminder)
     - `Annual IFSP Renewal & Vision/Hearing Screening` = `IFSP Start Date + 365 days` (hard billing cutoff)
     - `Age-3 School District (LEA) Transition Conference` = At least `90 days prior to 3rd Birthday` (`DOB + 3 years - 90 days`, window opens up to 9 months prior)
     - `3rd Birthday BabyNet Exit & DDSN Continuation Window` = `DOB + 3 years` (DDSN plan window opens 14 days prior)

2. **`/workspace/ei-app/02-HIPAA-Privacy-Pricing-And-MVP-Gold-Standard.md` (`26 KB`):**
   - **Local-First Encrypted Vault + 18-Identifier HIPAA Safe Harbor Scrubber:** Child names (`Liam Smith`), caregiver names (`Sarah Smith`), dates, and addresses stay encrypted on-device and are scrubbed to `[Child]` / `[Caregiver]` before any text touches an LLM, then re-hydrated locally on the device.
   - **One Piece Perfected at a Time Roadmap:**
     - **Piece 1:** Caseload & Auto-Compliance Timeline (`DOB` + `Intake Date` + `IFSP Date` -> automatic countdowns).
     - **Piece 2:** 30-Second Car Voice Note -> 4-Part Audit-Proof BRIDGES/Therap Service Note.
     - **Piece 3:** Daily & Weekly 15-Minute Unit Tracker (zero dollar/pay figures).

3. **`/workspace/ei-app/prototype/index.html` & `/workspace/ei-app/prototype/server.py`:**
   - Current working prototype (`v3` pushed at commit `497d0db`).
   - Local server runs on `http://127.0.0.1:8765` (connects to `homebase` Ollama `gemma4:e4b` when online, with instant deterministic SC BabyNet note formatting fallback).

---

## 3. UI/UX Evolution & Ansel's Exact Feedback (Read Carefully!)
- **`v1` Feedback:** Too cluttered; everything (deadlines, unit gauges, voice note, raw HIPAA console) was crammed onto one screen with regulatory code soup (`34 CFR`, `ACIS EI-426`).
- **`v2` Feedback:** *"I think we should leave unit price out of the app. Also I still just don't love the design or layout... I like A and B"*
  - **Rule 1 — Zero Dollar Amounts:** NEVER include `$` signs, unit dollar rates (`$24.65`, `$26.52`), or pay/earnings estimates anywhere in the app. Track **Units** (`4 Units • 60 min`, `12 / 16 Units Today`, `68 / 85 Units This Week`) and **Minutes** only.
  - **Rule 2 — Combined Layout (Option A + Option B):**
    - **Option A:** Child-first left sidebar roster (click any child -> see their dedicated Child Workspace with their Compliance Timeline & Deadlines, IFSP Outcomes, and notes).
    - **Option B:** Today's Schedule chronological feed (see today's visits and tap a visit to record/view the note).
- **`v3` Feedback (Current State — What to Build Next in `v4`):**
  - *"I like the desktop version. But the mobile looks really cluttered. Also the color scheme isnt the most pleasing. Estestically pleasing goes along way with our targeted users so this is very important."*
  - **What to Keep:** The `v3` **Desktop 3-column structure** (`Left Sidebar Caseload + Unit Target` | `Middle Column Today's Schedule` | `Right Column Active Visit Recorder & Note`, plus clicking a child in the sidebar to open their `Child Workspace`).
  - **What Needs Fixing Next (`v4`):**
    1. **Mobile Declutter (True Single-Screen Drill-Down):** On mobile (`< 768px`), never stack the schedule feed and the active note recorder on the same vertical scroll! Instead, make Mobile a calm, single-screen native iOS experience:
       - **Mobile Tab 1 (`Today`):** Shows ONLY the clean daily unit progress pill (`12 / 16 units`) and the 4 clean visit cards (`Maya`, `Liam`, `Noah`, `Ava`). Tapping a visit smoothly opens a dedicated full-screen **Visit Note Recorder** view (with a clean `< Today's Schedule` back button at top-left).
       - **Mobile Tab 2 (`Caseload`):** Shows the clean child list (`Liam Smith`, `Maya Thompson`, `Noah Brooks`, `Ava Robinson`). Tapping a child opens their dedicated **Child Timeline & Outcomes** screen (with a `< Caseload` back button).
    2. **Warm, Aesthetically Pleasing Color Palette (No Cold Hospital Teal/Gray):**
       - EIs are warm, nurturing pediatric specialists (mostly women in their 20s–50s). Replace the cold clinical teal/slate-gray palette with a warm, inviting, high-craft aesthetic (options pitched to Ansel: **Palette 1: Warm Oat & Eucalyptus Sage**, **Palette 2: Soft Sand, Terracotta & Olive**, or **Palette 3: Warm Ivory & Periwinkle/Indigo**—or let the user toggle between these 3 warm themes right in the header!).
