# South Carolina Early Intervention (BabyNet & DDSN/OIDD) Gold Standard Specification

**Document ID:** `EI-GOLD-01`  
**Last Verified:** October 25, 2026  
**Target Platform:** Standalone Native Mobile (iOS App Store / Google Play) + Web/PWA Subscription Application  
**Primary Authoritative Sources:**
- **SC DHHS Early Intervention Services Provider Manual** (Effective January 1, 2025) — [provider.scdhhs.gov/internet/pdf/manuals/EarlyIntervention/Manual.pdf](https://provider.scdhhs.gov/internet/pdf/manuals/EarlyIntervention/Manual.pdf)
- **SC BHDD / OIDD (formerly DDSN) Early Intervention Manual** (Revised September 2025) — [bhdd.sc.gov/sites/bhdd/files/OIDD/PublicDocuments/EarlyInterventionManual/EI%20Manual%202025%20FINAL.pdf](https://www.bhdd.sc.gov/sites/bhdd/files/OIDD/PublicDocuments/EarlyInterventionManual/EI%20Manual%202025%20FINAL.pdf)
- **SC DDSN FY25 Early Intervention ACIS Key Indicators Review Tool** (Revised July 8, 2024) — [ddsn.sc.gov/sites/ddsn/files/PublicDocuments/Contract%20Compliance%20Activities/FY25%20Early%20Intervention%20ACIS%20Indicators%20Revised%207-8-2024.pdf](https://ddsn.sc.gov/sites/ddsn/files/PublicDocuments/Contract%20Compliance%20Activities/FY25%20Early%20Intervention%20ACIS%20Indicators%20Revised%207-8-2024.pdf)
- **SC DHHS IDEA Part C (BabyNet) Policies & Procedures** (Appendix A: Service Provision, Billing, and Reimbursement; Periodic Review Procedures; General FAQ; Sept 2025 – Jan 2026 BRIDGES Updates) — [scdhhs.gov/resources/programs-and-initiatives/babynet/providers/babynet-policies-and-procedures](https://scdhhs.gov/resources/programs-and-initiatives/babynet/providers/babynet-policies-and-procedures)
- **SC Department of Education (OSES) IDEA Part C to Part B Transition Requirements** & **U.S. Dept. of Education OSEP Policy Letter to Nix** (34 CFR § 303.209) — [oses.ed.sc.gov/early-childhood/early-childhood-part-c-to-part-b-transition/part-c-to-part-b-transition-requirements-handout/](https://oses.ed.sc.gov/early-childhood/early-childhood-part-c-to-part-b-transition/part-c-to-part-b-transition-requirements-handout/)
- **CMS State Plan Amendment (SPA) SC-22-0016** (Early Intervention 15-Minute Unit Rate Schedule) — [medicaid.gov/medicaid/spa/downloads/SC-22-0016.pdf](https://www.medicaid.gov/medicaid/spa/downloads/SC-22-0016.pdf)

---

## 1. Systems, Agencies & Portals Used by South Carolina Early Interventionists

South Carolina operates a two-tier Early Intervention (EI) continuum serving eligible children from **Birth through Age 6** (defined by SC OIDD/DDSN as one day prior to the child's 6th birthday):

### 1.1 The Two-Tier Program Structure (Birth–3 vs. Ages 3–6)

| Dimension | Tier 1: Birth to Age 3 (0–36 Months) | Tier 2: Ages 3 through 6 (36–72 Months) |
| :--- | :--- | :--- |
| **Program Name** | **BabyNet** (South Carolina's IDEA Part C Program) | **DDSN / OIDD Early Intervention** (SC Dept. of Disabilities & Special Needs / Office of Intellectual and Developmental Disabilities, now under SC BHDD) & **SCSDB** (SC School for the Deaf and the Blind) |
| **Lead State Agency** | **SC Department of Health and Human Services (SCDHHS)** | **SC DDSN / OIDD** (contracted with SCDHHS) |
| **Governing Plan Document** | **IFSP** (*Individualized Family Service Plan*) | **FSP** (*Family Service Plan* — mandatory unaltered OIDD FSP form) |
| **Service Model** | **Blended or Split Model:** In SC, an EI typically serves as both **Service Coordinator (SC)** and **Family Trainer / Special Instructor (FT/SI)** (blended model), though agencies may split roles. | **Blended or Split Model:** Agency discretion to use one EI for both Service Coordination & Family Training, or split between two EIs. In CDSS, the Service Coordinator is always designated as the Primary EI. |
| **Approved Child Assessments (CBA)** | **HELP** (*Hawaii Early Learning Profile*) or **Carolina Curriculum** (*for Infants, Toddlers and Preschoolers with Special Needs*) | **HELP** or **Carolina Curriculum** (completed prior to initial plan and **at least every 6 months** for DDSN; annually for BabyNet) |
| **Approved Family Assessment** | **Routines-Based Interview (RBI)** | **Routines-Based Interview (RBI)** or Family Resources, Priorities & Concerns section of FSP |

### 1.2 Mandatory Portals & Data Systems EIs Must Navigate Daily

Because SC EIs have to double- and triple-enter data across disconnected state portals, our app must format outputs to drop straight into these systems:

1. **BRIDGES (`BabyNet Reporting & Intervention Data System`):**
   - State-mandated web portal for all children ages **0–3 (BabyNet)**.
   - Houses the child's electronic IFSP, Planned Services screen, Financial Support screen, Child Outcome Summary (COS) entry/exit ratings, Transition Conference form, and **Service Logs**.
   - **Critical Billing Mechanism:** Entering and saving a Service Log in BRIDGES **automatically generates an Accounts Payable journal entry and transmits the claim to SC Medicaid (MMIS)** for Fee-for-Service (FFS), Medicaid MCOs, or IDEA Part C payor-of-last-resort funds.
   - **Recent 2025–2026 BRIDGES System Rules (SCDHHS BabyNet Announcements):**
     - **September 3, 2025 Update:** Added a dedicated **"Make-Up" check box** on the BRIDGES Service Log and enforced a hard system cap of **240 minutes (16 units) per day per service**.
     - **September 3, 2025 Accounts Payable Rule:** Dates of service over 365 days old are blocked/rejected.
     - **December 15, 2025 & January 27, 2026 Updates:** Removed Social Security Numbers (SSNs) from BRIDGES and the Financial Support Screen, added Terms of Use acknowledgement, and enforced strict login attempt limits.
2. **Therap & CDSS (`Consumer Data Support System`) / STS:**
   - Used for children served through **SC DDSN / OIDD (especially Ages 3–6 and DDSN-contracted boards/providers)**.
   - **3-Business-Day Sync Rule (OIDD EI Manual Ch. 7):** EIs must ensure all demographic, support service, Medicaid, and eligibility changes are updated in **Therap, CDSS, and STS within three (3) business days** of the change.
   - Tracks Case Activity Notes (CANs) / Service Notes, Family Training Summary Sheets, FSP tracking, and Fee-For-Service (FFS) billing units.
3. **SCDHHS Medicaid Web Tool (`Healthy Connections` Portal):**
   - The official source of truth for verifying a child's current **Medicaid eligibility ("Eligible" vs. "Ineligible")** and identifying whether the child is in traditional **Fee-For-Service (FFS)** or a **Medicaid Managed Care Organization (MCO)** (e.g., Select Health, Molina, Absolute Total Care, Healthy Blue, Humana).
   - If a child is in an MCO, the Service Coordinator must submit a hardcopy of the IFSP + the **MCO Universal BabyNet Prior Authorization (PA) Form** to the MCO.
4. **TECS (`Team for Early Childhood Solutions`) & SCEILS (`SC Early Intervention Learning System`):**
   - Hosted via USC School of Medicine (`uscm.med.sc.edu/tecs`). Manages the mandatory **SC Infant Toddler Credential**.
   - **Deadlines:** New EIs and Supervisors must apply to TECS within **14 calendar days (2 weeks) of hire** and pass all assigned SCEILS web-based competency modules within **90 calendar days of application** (and complete any module updates within 90 days). Billing before credentialing requirements are met is strictly prohibited and subject to 100% Medicaid recoupment.

---

## 2. Billing Codes, 15-Minute Unit Math & Productivity Rules

### 2.1 Official Procedure Codes, Rates & Service Limits (SC Medicaid & BabyNet)

Per the **SCDHHS Early Intervention Services Provider Manual (Jan 2025)**, **BabyNet Appendix A**, and **CMS SPA SC-22-0016**, Early Interventionists primarily bill the following HCPCS `T-codes` with the **`TL` (Early Intervention/IFSP) modifier** and ICD-10 codes **`F81.9`** (Developmental disorder of scholastic skills, unspecified) or **`F89`** (Unspecified disorder of psychological development):

| Procedure Code | Modifier | Official Service Description | Unit Definition | Daily Cap (BRIDGES / Medicaid) | Monthly / Periodic Cap | SC Medicaid Reimbursement Rate per 15-Min Unit (SPA SC-22-0016) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`T1027`** | **`TL`** | **Family Training & Counseling / Special Instruction** (In-person coaching of parent/caregiver + child in natural environment) | **15 Minutes = 1 Unit** | **4 Units / day** (60 mins standard; up to 240 mins/day max with Make-Up checkbox) | **16 Units / month** (4 hours/month standard; >16 units requires signed **Service Justification Form** approved by OIDD Office of Children's Services) | **Birth–3:** `$24.65 / unit` (`$98.60/hr`)<br>**Ages 3–6 (DDSN):** `$26.52 / unit` (`$106.08/hr`)<br>**Ages 3–6 (SCSDB):** `$29.01 / unit` (`$116.04/hr`) |
| **`T1016`** | **`TL`** | **Service Coordination / Targeted Case Management (TCM)** (Ongoing coordination, referrals, monitoring, transition planning) | **15 Minutes = 1 Unit** | **16 Units / day** (BRIDGES Appendix A max) | **8 Units / month** (120 mins/month standard telehealth/monthly guideline) | **Birth–3:** `$24.65 / unit`<br>**Ages 3–6 (DDSN):** `$26.52 / unit` |
| **`T1018`** | **`TL`** | **Family Training IFSP / FSP Meeting & Assessment** (Service Coordinator facilitating IFSP/FSP team meeting & assessment) | **15 Minutes = 1 Unit** | **8 Units / day** (120 mins/day) | **4 Units / 6 months** (per telehealth bulletin) / **8 Units / day** (per Appendix A) | **Birth–3:** `$24.65 / unit` |
| **`T1024`** | *(Varies)* | **IFSP Team Meeting Participation** (Multidisciplinary team participation by EIS providers) | **15 Minutes = 1 Unit** | **8 Units / day** | Per scheduled IFSP review/annual meeting | Contracted rate |

> **CRITICAL RULE ON SEPARATION OF SERVICES (OIDD EI Manual Ch. 7 & Ch. 9, p. 26):**  
> *"Service Coordination (`T1016`) and Family Training (`T1027`) are two separate services and must be documented separately... If the plan indicates 60 minutes of Family Training, this must be provided apart from Service Coordination. **It is NOT permissible to provide 45 minutes of Family Training and 15 minutes of Service Coordination to meet the required 60 minutes.**"*

### 2.2 Exact 15-Minute Unit Math & Rounding Rules

Per **BabyNet Appendix A (p. 18)**: *"Units of service – Procedures for determining units of service are the same as the established CMS/Medicaid guidelines."* And per **SCDHHS BabyNet General FAQ**: *"Actual start and end times should be used... Since BRIDGES records time in minutes and SCDHHS pays per unit, actual time will be converted to units for payment."*

Our app must implement **both** the exact minute-to-minute duration logger AND the official **CMS/Medicaid 15-Minute Timed Code ("8-Minute Rule")** conversion chart:

#### A. The Official 15-Minute Unit Conversion Table (CMS / SC Medicaid 8-Minute Rule)

| Total Billable Minutes | Billable 15-Min Units | Dollar Value (Birth–3 @ `$24.65/u`) | Dollar Value (DDSN 3–6 @ `$26.52/u`) | Audit & Billing Rule |
| :---: | :---: | :---: | :---: | :--- |
| **1 – 7 mins** | **0 Units** *(For single timed encounter)* | `$0.00` | `$0.00` | **Do NOT round a 5-min call to 8 mins!** Log exact actual time (e.g., `10:05–10:10`). In TCM/Service Coordination (`T1016`), multiple short contacts on the same day/month may aggregate in the billing system, or stand as required non-billable documentation. |
| **8 – 22 mins** | **1 Unit** | `$24.65` | `$26.52` | Minimum threshold for a single 1-unit timed encounter (15 mins target). |
| **23 – 37 mins** | **2 Units** | `$49.30` | `$53.04` | Standard 30-minute session / make-up segment. |
| **38 – 52 mins** | **3 Units** | `$73.95` | `$79.56` | 45-minute session. |
| **53 – 67 mins** | **4 Units** | `$98.60` | `$106.08` | **Standard 1-Hour (60-minute) Home Visit (`T1027`).** |
| **68 – 82 mins** | **5 Units** | `$123.25` | `$132.60` | Extended visit (requires split log if exceeding planned session duration). |
| **83 – 97 mins** | **6 Units** | `$147.90` | `$159.12` | E.g., 60-min regular visit + 30-min make-up visit (must be entered as **two non-overlapping logs** in BRIDGES!). |
| **98 – 112 mins** | **7 Units** | `$172.55` | `$185.64` | Extended evaluation / assessment / IFSP meeting. |
| **113 – 127 mins** | **8 Units** | `$197.20` | `$212.16` | 2-hour evaluation / initial IFSP meeting (`T1018` daily cap). |
| **... up to 240 mins** | **16 Units** | `$394.40` | `$424.32` | **Hard BRIDGES Daily Maximum per Service (Effective Sept 3, 2025).** |

#### B. Mandatory BRIDGES Time-Entry Formatting & Split-Log Rules (SCDHHS BabyNet FAQ)
1. **Exact Start and End Times Required:** EIs must record exact clock times (e.g., `10:05–10:16`), never rounded block times if a call lasted 11 minutes.
2. **Strict Anti-Padding Rule (OIDD EI Manual Ch. 3, p. 10):** *"Elevating (Padding) your reportable time [is strictly prohibited]. For example, a phone conversation may have only taken 5 minutes, but 8 minutes was reported."* Our app's voice timer and time-picker must warn the EI never to artificially bump a 5-minute call to 8 minutes.
3. **The 12:00 PM – 1:00 PM Military Time Rule in BRIDGES:** Per the official SCDHHS BabyNet FAQ: *"Remember, if the activity spans across the 12:00 p.m.–1:00 p.m. hour, you must use military time. All other time can be entered as standard time. For example, `12:45–13:45` would be entered for 12:45 p.m.–1:45 p.m."* Our app should automatically format times spanning the noon hour into `HH:MM` 24-hour military format so BRIDGES never throws a validation error!
4. **The Make-Up Visit Split-Log Rule:** If an EI conducts a 90-minute visit (`2:00 PM – 3:30 PM`) consisting of a planned 60-minute Family Training session plus 30 minutes of make-up time from an earlier missed visit:
   - BRIDGES requires **two separate, non-overlapping Service Logs**:
     - **Log #1:** `2:00 PM – 3:00 PM` (60 mins / 4 units) — Regular Planned Visit.
     - **Log #2:** `3:00 PM – 3:30 PM` (30 mins / 2 units) — Check the **"Make-Up" box** (added to BRIDGES Sept 3, 2025) and state in the note whether the missed visit was made up in full or incrementally.
   - **Zero-Overlap Rule:** Times in BRIDGES cannot overlap (even across `T1027` and `T1016`), or BRIDGES will reject the log.

### 2.3 Billable vs. Non-Billable Activities (Strict Audit Filter)

Per **SCDHHS Early Intervention Services Provider Manual (Jan 2025, Section 4, pp. 8–12)** and **BabyNet Appendix A (pp. 9–10)**:

| Category | Billable (`Services Delivered`) | Strictly NON-Billable (Never Bill Medicaid — Risk of Recoupment/Fraud) |
| :--- | :--- | :--- |
| **Family Training (`T1027`)** | • **In-person** sessions with the child AND active participation of the parent/caregiver in the child's **natural environment** (home, regular childcare with ≤50% disabled enrollment, community park/library/store tied to an IFSP/FSP outcome).<br>• Coaching caregiver on developmental strategies tied to specific IFSP/FSP outcomes.<br>• Administering ongoing Curriculum-Based Assessments (HELP / Carolina Curriculum) with family. | • **Virtual / Telehealth Family Training** (Explicitly prohibited by OIDD EI Manual Ch. 9, p. 24: *"Family Training must be provided in person. Neither OIDD nor Medicaid allow for the provision of virtual Family Training."*).<br>• Working directly with the child while the parent/caregiver is absent or passively watching without participating.<br>• Providing FT in a **public preschool setting** (only occasional observation ≤1x/quarter for assessment/plan completion is allowed) or a special-needs-only daycare (>50% children with disabilities).<br>• Co-treating at the exact same time as another provider (OT/PT/SLP).<br>• Routinely attending weekly doctor or therapy appointments (only occasional attendance to observe positioning/techniques for FT carryover is allowed, and must be justified in the note). |
| **Service Coordination (`T1016`)** | • Coordinating evaluations, assessments, and medical/therapy referrals.<br>• Facilitating & participating in IFSP/FSP development, 6-month periodic reviews, and annual redeterminations.<br>• Monitoring service delivery & progress (must contact family at least **1x/month**).<br>• Facilitating the Part C to Part B transition plan & conference.<br>• Providing information to the family in a crisis situation.<br>• Pre-IFSP coordination prior to Initial IFSP finalization (logged as Primary Service Coordination). | • **Travel time** to/from home visits or appointments.<br>• **Writing service notes/logs**, filing, copying, or entering data into BRIDGES, Therap, or CDSS.<br>• **Preparation time** for Family Training activities or creating bulk activity packets.<br>• **Attempted phone calls**, voicemails, or **no-show / cancelled home visits** (must be logged as non-billable: *"No-show"*, *"Absence due to family"*, or *"Absence due to provider"*).<br>• **Appointment reminders** or phone calls/texts simply to confirm or reschedule an appointment.<br>• **Texting** parents/caregivers (`"Billing for texting parents and caregivers"` is explicitly listed as Non-Covered on p. 12 of the Jan 2025 SCDHHS Manual).<br>• Verifying Medicaid numbers or Medicaid eligibility redeterminations.<br>• Attending staff meetings, supervision, or SCEILS/TECS training.<br>• Any service rendered **after the IFSP/FSP expiration date** (`"Not BTW"` error in BRIDGES) or after the child ages out. |

### 2.4 Caseload Norms, Weekly/Monthly Unit Quotas & IFSP Authorization Tracking

1. **Authorized Plan Frequency vs. Delivered Units:**
   - Standard Family Training (`T1027`) authorization is **1x/week for 60 minutes = 4 visits/month (16 units / 240 minutes per month)** per child.
   - Standard Service Coordination (`T1016`) cap is **8 units (120 minutes) per month** per child (with a minimum mandatory **1x/month monitoring contact** for Service-Coordination-only cases).
   - **Over-4-Hours Justification Rule (ACIS Indicator `EI-416` & OIDD Manual Ch. 9, p. 24):** If a child's IFSP/FSP requires **more than 4 hours (16 units) per month** of Family Training, the EI must submit the IFSP/FSP, a signed **Service Justification Form**, Family Training Summary Sheets, and service notes to the **OIDD Office of Children's Services within 14 calendar days** of plan completion for approval.
2. **SC Early Interventionist Caseload & Weekly Unit Quota Benchmarks:**
   - **Full-Time EI Caseload:** Typically **22 to 35 active families** in blended (SC + FT) private agencies, up to **40–45 cases** for Service-Coordination-heavy or large board caseloads.
   - **Agency Weekly Billable Unit Targets:** Most SC private EI agencies require full-time EIs to hit **80 to 110 billable units per week** (20 to 27.5 billable contact hours/week, or ~16 to 22 units/day across a 5-day week) to qualify for full base salary and per-unit productivity bonuses.

---

## 3. The Auto-Timeline & Statutory Countdown Engine (Zero-Miss Rules)

> **Why EIs Loved This Most in Chef's Prototype:**  
> Early Interventionists are audited ruthlessly by SC DHHS (BabyNet Quality Assurance) and SC DDSN (ACIS Contract Compliance Indicators `EI-401` through `EI-439`). Missing a single deadline by **one day** (e.g., holding a 6-month review on `1/2/2026` when the initial plan was `7/1/2025`) is scored as a formal compliance failure, and **zero time can be billed after an IFSP/FSP expires (`No time may be reported for a consumer whose FSP is not current` — OIDD Manual Ch. 11, p. 38)**.

Our app's **Auto-Timeline Engine** calculates every mandatory statutory deadline automatically from just **two primary dates** entered at intake—**`DOB` (Child's Date of Birth)** and **`Intake_Date` (Referral / Provider Choice Date)**—plus **`IFSP_Start_Date`** once the initial plan is signed.

### 3.1 Master Statutory Timeline Formula Table (Computed from `DOB` + `Intake_Date` + `IFSP_Start_Date`)

| Milestone ID | Statutory Milestone Name | Program Scope | Exact Formula | Audit / Legal Rule & Exception Codes | Suggested App Alert Triggers |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`M-01`** | **Initial Family Contact Attempt** | BabyNet (0–3) (`ACIS EI-401`) | `Intake_Date + 2 Business Days` | EI must document an attempt to contact the family within **2 business days** of receiving a new referral from BabyNet. | Immediate (`Day 0` & `Day 1` push alert) |
| **`M-02`** | **Case Transfer Plan Update** *(If transferred from another agency)* | DDSN (3–6) (`ACIS EI-437`) | `Transfer_Date + 14 Calendar Days` | When a file transfers from another CM/FT provider, a new FSP must be completed or the current plan updated within **14 calendar days**. | `10d`, `5d`, `2d` prior |
| **`M-03`** | **Pre-Plan CBA Assessment Window** | DDSN (3–6) (`OIDD Ch. 8`) | `Plan_Date - 14 Calendar Days` *(Max lookback)* | Curriculum-Based Assessment (HELP / Carolina) must be completed **no more than 2 weeks (14 days) prior** to the FSP meeting. | `14d` before any FSP |
| **`M-04`** | **Prior Written Notice (PWN) for IFSP Meeting** | BabyNet (0–3) (`ACIS EI-403`) | `Meeting_Date - 7 Calendar Days` *(Minimum)* | Service Coordinator must provide Written Prior Notice of meeting date, time, and location **at least 7 calendar days in advance**. **Family CANNOT waive this 7-day notice.** | `10d`, `8d` before scheduled meeting |
| **`M-05`** | **45-Calendar-Day Initial IFSP / FSP Completion Deadline** | BabyNet (0–3) & DDSN (3–6) (`34 CFR § 303.310` / `OIDD Ch. 11`) | **BabyNet:** `Referral_Date + 45 Calendar Days`<br>**DDSN (Age 3+):** `Provider_Choice_Date + 45 Calendar Days` | Initial Evaluation, Child/Family Assessment (RBI), Entry COS, and Initial IFSP/FSP meeting MUST be completed within **45 calendar days**. *(Exception: Documented "Exceptional Family Circumstances" such as child illness/hospitalization or family reschedule—never provider delay! Also exempt if referral occurs `< 45 days` before 3rd birthday.)* | `Day 15`, `Day 30`, `Day 38` (7d left), `Day 42` (3d left) |
| **`M-06`** | **Deliver Copy of Signed Plan to Family** | DDSN (3–6) & BabyNet (`ACIS EI-407`) | `Plan_Completion_Date + 10 Business Days` | Parent/caregiver and team members must receive a copy of the Initial, 6-Month, or Annual FSP within **10 business days** of completion (and documented in service notes). | `Day 5`, `Day 8` after plan signing |
| **`M-07`** | **Over-4-Hours FT Justification Submission** *(If `T1027` > 16 units/mo)* | DDSN / BabyNet (`ACIS EI-416`) | `Plan_Completion_Date + 14 Calendar Days` | If IFSP/FSP authorizes `> 4 hours/month` of Family Training, Service Justification Packet must be sent to OIDD Office of Children's Services within **14 calendar days**. | `Day 7`, `Day 12` after plan signing |
| **`M-08`** | **Timely Service Initiation (30-Day Rule)** | BabyNet & DDSN (`ACIS EI-417` / `Appendix A`) | `IFSP_Start_Date + 30 Calendar Days` | All planned services on the IFSP must be initiated within **30 calendar days** of identification on the IFSP (unless documented child/parent-driven delay). | `Day 14`, `Day 21`, `Day 27` |
| **`M-09`** | **Monthly Service Coordination Contact** | BabyNet & DDSN (`OIDD Ch. 12`) | `1x per Calendar Month` *(Every 30 Days)* | Mandatory minimum monthly monitoring contact with family (and monthly contact for SCSDB primary SC cases). | `20th` & `25th` of month if `0` contacts logged |
| **`M-10`** | **6-Month CBA Re-Assessment (DDSN)** | DDSN (3–6) (`ACIS EI-424`) | `IFSP_Start_Date + 6 Calendar Months - 14 Days` | DDSN requires Curriculum-Based Assessment (HELP/Carolina) to be updated **every 6 months** (within 2 weeks prior to the 6-month review). *(BabyNet requires CBA annually.)* | `30d`, `14d` before 6-Month Review |
| **`M-11`** | **6-Month IFSP / FSP Periodic Review** | BabyNet & DDSN (`ACIS EI-406` / `OIDD Ch. 11`) | `Exact Calendar Anniversary: IFSP_Start_Date + 6 Months` | **Zero-Grace-Period Rule (OIDD Ch. 11, p. 38):** *"If the FSP was completed on `7/1/2025`, the six-month review is due no later than `1/1/2026`. If completed on `1/2/2026`, it was late."* Must send 7-day Prior Written Notice at `Due_Date - 7 Days`. | `30d`, `14d`, `7d` (PWN due!), `3d` prior |
| **`M-12`** | **Pre-Annual Vision & Hearing Screening + RBI + CBA** | BabyNet & DDSN (`ACIS EI-413, EI-424, EI-439`) | `IFSP_Start_Date + 335 to 350 Days` *(14–30d before Annual)* | Vision & Hearing screening (`EI-439`), Routines-Based Interview (`EI-413`), and Annual CBA (`EI-424`) must be completed **prior to** each Annual IFSP. | `45d`, `30d`, `14d` before Annual due date |
| **`M-13`** | **365-Day Annual IFSP / FSP Redetermination & Provider Choice** | BabyNet & DDSN (`ACIS EI-405, EI-434`) | `Min(IFSP_Start_Date + 365 Days, Six_Month_Review_Date + 6 Months)` | **Hard Billing Stop (`Not BTW`):** Time between annual plans **cannot exceed 365 days** (and in DDSN, cannot exceed 6 months after the 6-month review; if 6-month review was late, anchor strictly to `IFSP_Start_Date + 365 days`). Must also re-sign **Acknowledgement of SC/EI Provider Choice Form** (`EI-434`) and verify Medicaid benefits. **Zero billing allowed if expired!** | `45d`, `30d`, `14d`, `7d` (PWN due!), `3d`, `1d` |

---

### 3.2 Age-Based Statutory Transition & Cutoff Formulas (Computed Strictly from `DOB`)

Every child's **Date of Birth (`DOB`)** drives a rigid biological countdown clock for **Part C to Part B (School District / Local Education Agency - LEA) Transition** at Age 3, plus DDSN Age 5 and Age 6 cutoffs:

| Transition ID | Statutory Age Milestone | Exact Date Formula from `DOB` | Mandatory Action Required by SC BabyNet / OSES / DDSN | App Countdown Alert Triggers |
| :--- | :--- | :--- | :--- | :--- |
| **`T-01`** | **Transition Window Opens (27 Months Old — Ideal Target)** | `DOB + 27 Calendar Months` *(9 months before 3rd Birthday)* | **Earliest & Recommended Date** (`OSES Part C to B Handout` & `ACIS EI-419/420`): Send **Transition Referral Form** (SEA/LEA Notification) to the child's local school district and schedule the **Part C to Part B Transition Conference**. BabyNet explicitly recommends scheduling as close to **27 months** as possible. | `DOB + 26m` (30d heads-up), `DOB + 27m` (Window Open!) |
| **`T-02`** | **Mid-Window Escalation Check (30 Months Old)** | `DOB + 30 Calendar Months` *(6 months before 3rd Birthday)* | If the Transition Referral Form has not been sent or the Transition Conference with the LEA and family is not yet on the calendar, escalate status to **YELLOW (Warning)**—only 90 days remain before the federal statutory cutoff! | `DOB + 30m` |
| **`T-03`** | **HARD STATUTORY DEADLINE: LEA Notification & Transition Conference (33 Months / 90 Days Before 3rd Birthday)** | `DOB + 36 Months - 90 Calendar Days` *(or `DOB + 33 Calendar Months`)* | **Federal & State Mandatory Cutoff (`34 CFR § 303.209(c)(1)`, `ACIS EI-419, EI-420, EI-421`):**<br>1. **Transition Referral Form** MUST be sent to the LEA between 27 and 33 months (unless family signs opt-out refusal on the form).<br>2. **Transition Conference** with Family + Service Coordinator + LEA Representative MUST be held **at least 90 days prior to the child's 3rd birthday (prior to 33 months old)**.<br>3. If held after `DOB + 33m`, it is a compliance violation requiring a formal late reason code and documentation in BRIDGES (`EI-421`). | `30d`, `14d`, `7d`, `3d`, `1d` before `DOB + 36m - 90d` |
| **`T-04`** | **BabyNet Late-Referral 45-Day Cutoff** | `DOB + 36 Months - 45 Calendar Days` | Per **OSEP Policy Letter to Nix (2023)**, if a child is referred to BabyNet **fewer than 45 calendar days before their 3rd birthday**, BabyNet is NOT required to conduct an initial evaluation, assessment, or IFSP meeting, and instead refers the child directly to the LEA for Part B if a disability is suspected. | Instant check at Intake |
| **`T-05`** | **DDSN Continuation FSP Window (Ages 3–6 Transition)** | `Window: [3rd_Birthday - 14 Calendar Days] to [3rd_Birthday - 1 Day]` | **OIDD EI Manual Ch. 11 (p. 36):** For a BabyNet child continuing into DDSN/OIDD (Ages 3–6) EI services, the initial OIDD **FSP** must be completed **prior to the 3rd birthday, but NO MORE than 2 weeks (14 days) prior to the 3rd birthday**, with an effective date of the child's 3rd birthday (logged in BabyNet service notes). | `21d`, `14d` (Window Opens!), `7d`, `2d` before 3rd Birthday |
| **`T-06`** | **3rd Birthday — Part C (BabyNet) Hard Exit & Exit COS** | `DOB + 36 Calendar Months` *(Exact 3rd Birthday)* | **Part C Eligibility Ends:** Child exits BabyNet. If the child received `> 6 months` of services, the EI must complete the **Exit Child Outcome Summary (COS)** (`ACIS EI-410 & EI-411`) with team input. **Zero BabyNet billing allowed on or after the 3rd birthday.** | `30d`, `14d`, `7d`, `1d` before 3rd Birthday |
| **`T-07`** | **Age 5 DDSN Service Justification Cutoff** | `DOB + 60 Calendar Months` *(Exact 5th Birthday)* | **ACIS Indicator `EI-436` (DDSN Only):** Any child **5 years of age or older** being served in DDSN Early Intervention MUST have a signed **Service Justification Form** in their file. | `45d`, `30d`, `14d`, `7d` before 5th Birthday |
| **`T-08`** | **Age 6 DDSN Early Intervention Final Exit** | `DOB + 72 Calendar Months - 1 Day` *(One day prior to 6th Birthday)* | **OIDD EI Manual Ch. 4 (p. 14) & Ch. 9 (p. 26):** Early Intervention serves children through age 6, defined as **one day prior to the child's 6th birthday**. Prior to exit, EI transitions permanently eligible children to OIDD Case Management or closes at-risk files. Records must be retained securely for **6 years** after exit. | `60d`, `30d`, `14d`, `7d` before 6th Birthday |

---

### 3.3 Service Note & Make-Up Visit Deadlines

| Operational Rule | Official Deadline | Source Citation |
| :--- | :--- | :--- |
| **Service Note / Log Submission Deadline** | **Immediately following service, and NO LATER than 7 Calendar Days (BRIDGES) / 7 Business Days (SCDHHS Manual)** from the date of service. | **BabyNet Appendix A (p. 11):** *"Following each service event, the EIS provider is responsible for entering a service log in BRIDGES within 7 calendar days."*<br>**SCDHHS EI Manual (Jan 2025, p. 14):** *"Be completed immediately following the delivery of the service, but no later than seven business days from the date of rendering the service."*<br>*(Note: Our app enforces the stricter **7-Calendar-Day** timer so the EI is 100% compliant with both!)* |
| **Provider-Cancelled Visit Make-Up Deadline** | **Within the SAME calendar month** (unless cancelled during the **last week of the month**, in which case it must be made up within the **first week of the following month**). | **SCDHHS EI Manual (Jan 2025, p. 15) & OIDD Manual (Sept 2025, p. 26):** Must offer make-up visit for any provider-driven cancellation and document whether made up in one session or incrementally. |
| **3 Consecutive Unnotified Family No-Shows (10-Day Letter Rule)** | After **3 consecutive missed FT visits** without family notification -> send letter -> wait **10 Calendar Days** for reply before closing file. | **OIDD EI Manual Ch. 9 (p. 24) & Ch. 10 (p. 30):** Send formal 10-day continuation letter; if no response within 10 calendar days, notify parent services are ending and close file. |
| **Extended EI Absence Alternate Provider Offer** | If EI is unable to provide FT for **> 1 Month (30 Days)**. | **ACIS Indicator `EI-430` & OIDD Manual Ch. 9 (p. 25):** Must offer the family a choice of an alternate Early Interventionist. |

---

## 4. Mandatory Service Note / Case Activity Note (CAN) Audit Elements

Per **SCDHHS Early Intervention Services Provider Manual (Jan 2025, Section 5, pp. 14–15)**, **OIDD Early Intervention Manual (Sept 2025, Ch. 9 pp. 25–26 & Ch. 13 pp. 44–45)**, and **ACIS Indicators `EI-425` through `EI-432`**, records found incomplete or lacking caregiver participation result in **recoupment (clawback) of Medicaid payments**.

### 4.1 The 12-Point Audit-Proof Checklist (Every Note Must Contain These)

Our AI Voice-to-Note formatter must validate that every generated note contains all **12 mandatory audit elements**:

1. **Child's Name** (and Date of Service). *(Handled locally on-device by our PII token swapper so PHI never touches the cloud!)*
2. **Service Name & Procedure Code:** E.g., `Family Training / Special Instruction (T1027-TL)` or `Service Coordination (T1016-TL)`. *(Never combine both into a single time block!)*
3. **Exact Start Time, End Time & Total Minutes/Units:** E.g., `10:00 AM – 11:00 AM (60 mins / 4 units)` or military time `12:30 – 13:30` when crossing the 12:00–1:00 PM hour.
4. **Location / Natural Environment Setting:** Specific natural environment where the visit occurred (e.g., `Child's Home (Living Room/Kitchen)`, `Community Childcare Center`, `Neighborhood Park`) or `Telephone / Collateral Contact` for `T1016`.
5. **Full Name, Title & Relationship of All Persons Present/Contacted:** Must identify every person referenced by **full name, title/agency affiliation (if professional), and relationship to the child** at least once in each note (e.g., `Sarah Miller (Mother/Primary Caregiver)`, `Rebecca Ortiz, MS, CCC-SLP (Speech-Language Pathologist, Palmetto Pediatric Therapy)`).
6. **Targeted IFSP/FSP Outcome / Goal Number(s) & Objective:** Must explicitly link the session's focus to a numbered goal/outcome on the active IFSP/FSP (unless addressing a documented unexpected crisis/event).
7. **Detailed Summary of Specific Interventions & EI Coaching Strategies Taught:** What specific developmental strategies, environmental adaptations, or modeling the EI taught the caregiver during everyday routines (using items in the family's natural environment).
8. **Active Parent/Caregiver Participation (THE #1 AUDIT CLAWBACK TRIGGER — `ACIS EI-427` & `OIDD Ch. 9, p. 25`):**
   - **Explicit Manual Rule:** *"The parent/caregiver must participate during scheduled visits. **To state that the parent was present or that the family participated is NOT sufficient.** The summary should include what instructions and/or strategies the EI gave the parent during the session to achieve a certain activity: For example, Mom gave Jane support at the base of her trunk while EI presented objects to encourage her to reach for and grasp."*
9. **Child's Response & Incremental Progress Toward the IFSP/FSP Outcome:** Objective, opinion-free description of how the child responded during the routine and specific progress toward the measurable goal criteria.
10. **Follow-Up Objectives / Carryover Plan for Family Between Visits (`ACIS EI-426`):** Specific daily routine activities the caregiver will practice before the next visit, plus what the EI and family will focus on next session. *(Required for all Family Training `T1027` notes; not required on FT summary sheets that document only Service Coordination).*
11. **Make-Up Visit or Discontinuation Status (If Applicable):** If the session (or a split segment) is a make-up visit, explicitly state the **missed visit date**, **who cancelled**, and whether the missed time is being made up **in full (one visit) or incrementally across multiple visits**.
12. **Next Scheduled Visit Date/Time & Signatures:** Date and time of the next scheduled home visit (or `"To be determined"` if the family could not schedule at that moment), plus EI and Parent/Caregiver signatures on the Family Training Summary Sheet (never signed blank!).

> **Additional Mandatory Documentation Rules (SCDHHS Manual p. 14):**
> - **Stand-Alone Rule:** Every note must stand on its own and **may NEVER say `"same as above"` or `"continued from last week."`**
> - **Zero-Opinion Rule:** *"Service notes should not include opinions."* Stick strictly to observable behaviors, caregiver actions, and clinical coaching.
> - **Siblings / Multiple Children Rule (OIDD Ch. 13, p. 45):** If serving twins or siblings in the same household, the EI **must document each child's services, times, and Family Training Summary Sheets completely separately**.
> - **Late Entry Rule (SCDHHS Manual pp. 14–15):** If adding omitted info later, must label as `"LATE ENTRY"`, record the current date/time of entry, reference the original service date/incident, and validate the source.

---

### 4.2 Concrete Examples: "Audit-Proof Gold Standard" vs. "Audit-Flagged (Clawback Risk)"

#### Example 1: Family Training / Special Instruction (`T1027-TL` — 60 Minutes / 4 Units)

❌ **AUDIT-FLAGGED NOTE (High Medicaid Recoupment / Clawback Risk):**
> *Date: 10/23/2026 | Time: 10:00–11:00 | Service: FT (T1027)*  
> *Met with Liam and Mom at home. Worked on speech and fine motor skills from IFSP. EI played with Liam using blocks and picture cards to work on words and stacking. Mom was present and watched the session and participated. Liam did a great job today and seems happier. Will continue same as above next week.*  
> **Why Auditors Will Claw Back `$98.60` / `$106.08`:**
> 1. Violates **OIDD Ch. 9 (p. 25) & ACIS `EI-427`**: Says *"Mom was present and watched... and participated"* without describing **how** the parent actively practiced the strategy.
> 2. EI brought outside toys to work directly with the child (`"EI played with Liam"`) instead of coaching the caregiver within a natural home routine.
> 3. Fails to cite specific **IFSP Outcome numbers** (`ACIS EI-429`).
> 4. Includes subjective opinion (`"Liam did a great job today and seems happier"`) and forbidden phrase (`"same as above"`).
> 5. No specific caregiver carryover homework or next visit date/time (`ACIS EI-426`).

✅ **AUDIT-PROOF GOLD STANDARD NOTE (Generated by Our App in 30 Seconds):**
> - **Child Name:** Liam Smith | **Date of Service:** 10/23/2026
> - **Service & Procedure Code:** Family Training / Special Instruction (`T1027-TL`)
> - **Time & Units:** `10:00 AM – 11:00 AM` (`60 Minutes` = **4 Units**) | **Make-Up Visit:** No
> - **Location (Natural Environment):** Child's Home (Kitchen / Living Room)
> - **Persons Present:** Liam Smith (Child), Sarah Smith (Mother / Primary Caregiver), Jennifer McMakin, BS, EI (Early Interventionist / Family Trainer, Upstate EI Services)
> - **Targeted IFSP Outcomes Addressed:**
>   - *Outcome #1 (Communication):* Liam will use 10 functional single words or approximations during daily snack and play routines to request desired items across 3 consecutive weeks.
>   - *Outcome #2 (Fine Motor / Adaptive):* Liam will use an isolated pincer grasp to pick up small finger foods and place household objects into containers during mealtime and clean-up routines.
> - **Coaching Strategies & Interventions Provided:**
>   - Session was embedded into the family's morning snack routine at the kitchen table and clean-up routine in the living room.
>   - EI coached Mother (Sarah Smith) on the **"Communicative Temptation (Out-of-Reach / Sabotage)"** and **"Expectant Pause (5-Second Wait)"** strategies using Liam's preferred puff snacks and plastic kitchen bowls already in the home.
>   - EI demonstrated holding a clear container with 2 puffs at eye level, modeling the target word *"open"* and *"more,"* and waiting 5 seconds before opening the lid.
>   - For Outcome #2, EI coached Mother on positioning a stable footstool under Liam's feet at the highchair to improve trunk stability and presenting one puff at a time on the tray to isolate his right index finger and thumb (pincer grasp) rather than raking with his whole hand.
> - **Parent / Caregiver Active Participation (`ACIS EI-427`):**
>   - Mother (Sarah Smith) actively led 8 trials of the snack routine: she held the closed snack cup at her chin level, modeled *"open"* and *"milk,"* and paused 5 seconds without prompting before handing Liam a single puff.
>   - During living room clean-up, Mother stabilized Liam at the base of his trunk while coaching him to pick up small wooden puzzle knobs using a pincer grasp and drop them into a laundry basket. Mother identified dinner prep (5:30 PM) as the best daily routine to practice the 5-second pause strategy.
> - **Child's Response & Progress Toward Outcomes:**
>   - Liam maintained eye contact with Mother and produced the verbal approximation *"/mo/"* for *"more"* on 5 of 8 opportunities (up from 2 of 8 last week) and signed *"open"* independently twice.
>   - With foot support provided by Mother, Liam used an inferior pincer grasp on 6 of 10 puffs before fatiguing and reverting to a palmar rake on the final 4 trials.
> - **Follow-Up Plan & Caregiver Carryover Objectives (`ACIS EI-426`):**
>   - **Caregiver Plan Between Visits:** Mother will offer 2–3 pieces of finger food at a time inside a clear closed container during daily breakfast and afternoon snack to prompt *"open"* and *"more,"* and will place the footstool under Liam's feet at mealtime to support pincer grasp.
>   - **Next Session Objective:** Review mealtime word approximations and introduce two-choice visual offering (*"cracker or banana"*) during snack routine.
> - **Next Scheduled Visit:** Thursday, 10/30/2026 at 10:00 AM (Child's Home). Copy of signed Family Training Summary Sheet left with Mother.

---

#### Example 2: Service Coordination (`T1016-TL` — 15 Minutes / 1 Unit Collateral Contact)

❌ **AUDIT-FLAGGED NOTE (Clawback Risk):**
> *Date: 10/23/2026 | Time: 12:50–1:05 | Service: SC (T1016)*  
> *Called speech therapist to check on Liam. Talked for 15 mins. Everything is going well. Also texted mom to remind her about next week's visit.*  
> **Why Auditors Will Claw Back `$24.65` / `$26.52`:**
> 1. Crosses the `12:00 PM – 1:00 PM` hour without using mandatory military time (`12:50 – 13:05`) required by BRIDGES.
> 2. Fails to list the **full name, title, and agency** of the person contacted (OIDD Ch. 13, p. 45; SCDHHS Manual p. 14).
> 3. Includes non-billable texting/appointment reminder inside a billed time block (SCDHHS Manual p. 12).
> 4. Lacks specific purpose, outcome of contact, and needed follow-up.

✅ **AUDIT-PROOF GOLD STANDARD NOTE (`T1016-TL`):**
> - **Child Name:** Liam Smith | **Date of Service:** 10/23/2026
> - **Service & Procedure Code:** Service Coordination (`T1016-TL`)
> - **Time & Units (Military Time Used for 12:00–1:00 PM Hour):** `12:50 – 13:05` (`15 Minutes` = **1 Unit**)
> - **Type & Location of Contact:** Telephone Collateral Contact (EI Office)
> - **Person Contacted (Name, Title & Agency):** Rebecca Ortiz, MS, CCC-SLP (Speech-Language Pathologist, Palmetto Pediatric Therapy) | **EI:** Jennifer McMakin, BS, EI (Service Coordinator, Upstate EI Services)
> - **Purpose of Contact (Linked to IFSP Outcome #1):** Monthly service coordination monitoring and multidisciplinary collaboration regarding speech therapy initiation and expressive communication strategies prior to Liam's upcoming 6-Month IFSP Periodic Review due `11/15/2026`.
> - **Intervention / Services Provided:** Discussed Liam's progress toward IFSP Outcome #1 (functional single words during routines) and coordinated feeding/oral-motor observations reported by Mother (Sarah Smith) regarding pocketing of solid textures. Verified that SLP services are being delivered weekly at the authorized IFSP frequency (1x/week for 30 minutes in the home).
> - **Outcome of Contact:** SLP (Rebecca Ortiz) confirmed she has completed 4 of 4 authorized October sessions and will provide an updated quarterly progress summary by `11/05/2026` for the 6-month IFSP review. SLP recommended sharing mealtime pacing strategies across both Speech Therapy and Family Training sessions.
> - **Needed Follow-Up:** Service Coordinator will contact Mother (Sarah Smith) by `10/27/2026` to confirm mutually agreeable date/time for the 6-Month IFSP Periodic Review meeting and issue 7-day Prior Written Notice no later than `11/07/2026`.

---

#### Example 3: Make-Up Visit Split Log (`T1027-TL` — 30 Minutes / 2 Units)

✅ **AUDIT-PROOF GOLD STANDARD NOTE (`T1027-TL` Make-Up Segment — Logged as Separate Non-Overlapping Entry):**
> - **Child Name:** Liam Smith | **Date of Service:** 10/23/2026
> - **Service & Procedure Code:** Family Training / Special Instruction (`T1027-TL`) — **[MAKE-UP VISIT CHECKBOX SELECTED IN BRIDGES]**
> - **Time & Units:** `11:00 AM – 11:30 AM` (`30 Minutes` = **2 Units**) *(Entered as separate non-overlapping log immediately following `10:00 AM – 11:00 AM` regular session)*
> - **Make-Up Visit Justification (SCDHHS Manual p. 15 / OIDD Ch. 9 p. 26):** This 30-minute session represents part 1 of 2 incremental make-up sessions (30 mins today + 30 mins scheduled for `10/30/2026`) for the 60-minute Family Training visit missed on `10/09/2026` due to a provider-driven cancellation (EI illness), as requested and agreed to by Mother (Sarah Smith) within the same calendar month.
> - **Location:** Child's Home (Bedroom / Dressing Area)
> - **Persons Present:** Liam Smith (Child), Sarah Smith (Mother), Jennifer McMakin, BS, EI (Family Trainer, Upstate EI Services)
> - **Targeted IFSP Outcome Addressed:** *Outcome #3 (Adaptive / Self-Help):* Liam will cooperate with dressing routines by extending arms through sleeves and pulling off socks independently during morning and bath routines.
> - **Coaching Strategies & Active Parent Participation:** EI coached Mother on backward chaining during sock removal (pulling sock past the heel so Liam only completes the final pull over his toes) and using a simple two-step visual/verbal cue (*"Push arm, peek-a-boo hand!"*). Mother practiced backward chaining on both socks across 4 trials, adjusting how far she pulled the heel down so Liam succeeded independently.
> - **Child's Response & Progress:** Liam pulled both socks off from the toe position on 4 of 4 trials without frustration and extended his right arm into his shirt sleeve with verbal prompting from Mother.
> - **Follow-Up Plan:** Mother will use backward chaining for sock removal every evening before bath time. Remaining 30 minutes of incremental make-up time will be delivered on `10/30/2026` from `11:00 AM – 11:30 AM`.

---

## 5. Government Portal Upload, API, EDI `837P` & 1-Click Auto-Fill Architecture

Per Chef's requirement (`[t2585u]`), we audited the exact technical interfaces of South Carolina's three Early Intervention portals (**BabyNet `BRIDGES`**, **SC DDSN/OIDD `Therap -> CDSS`**, and **SC Healthy Connections Medicaid / MCO `ASC X12 837P` EDI**) as of May–October 2026:

### 5.1 Portal-by-Portal API & Upload Capability Matrix (2026 Verified)

| State System / Portal | Governing Agency | Public REST API for Direct Case Note Writes? | Official Batch / EDI Upload Mechanism | How Our App Integrates ("Zero Double-Typing") |
| :--- | :--- | :--- | :--- | :--- |
| **1. `BRIDGES`** (*BabyNet Reporting & Intervention Data Gathering Electronic System*) | **SC DHHS** (Ages 0–3 BabyNet) | **No.** `BRIDGES` is a closed state web portal with MFA/login attempt limits (updated Jan 27, 2026) and no public third-party REST API for external software to POST service logs directly. | Saving a Service Log inside the `BRIDGES` web UI automatically creates an Accounts Payable journal entry and transmits the claim to SC Medicaid `MMIS`. | **1-Click `BRIDGES` Companion Chrome Extension + Smart Clipboard Packet:** While the EI is logged into `BRIDGES` on their laptop, clicking **"Auto-Fill BRIDGES Service Log"** injects the structured JSON packet directly into the active `BRIDGES` DOM fields (Date, Military/Standard Start & End Time, Procedure Code `T1027`/`T1016`, Make-Up Checkbox, Location, Outcome #, and Narrative) in `<1 second`. |
| **2. `Therap` $\rightarrow$ `CDSS` Interface** | **SC BHDD / OIDD (formerly DDSN)** (Ages 3–6 EI & Case Management) | **Partial (Enterprise Only):** Therap offers **Therap External APIs** (for Demographics & Users) and **External Data Feed (ExDF)** exports, plus direct electronic `837P` claim generation from the Therap Attendance/Case Note grid. Per OIDD Director Constance Holloway's **May 13, 2026 Memorandum**, *"invoices for CM and EI services are generated based on documentation entered in Therap. Through an interface, Therap then provides information back to CDSS from which provider invoices are produced."* | Therap Case Notes / Attendance Grid $\rightarrow$ Nightly automated interface to `CDSS` $\rightarrow$ Direct `837P` submission to SC DHHS / DDSN FFS invoice generation on the 5th business day of the month. | **1-Click `Therap` Auto-Fill & CSV/JSON Attendance Export:** The same Chrome Extension auto-fills **Therap T-Logs / Case Activity Notes / Attendance Grids** in 1 click, AND exports a **Therap-ready CSV/Excel Audit Log** for EI Supervisors conducting their mandatory monthly 2-file quality reviews (`OIDD Ch. 4`). |
| **3. SC Medicaid `MMIS` & Medicaid MCOs (`X12 837P` EDI)** | **SC DHHS Healthy Connections & MCOs** (Select Health, Molina, Absolute Total Care, Healthy Blue, Humana) | **Yes — Standard HIPAA `ASC X12 837P` EDI Gateway.** Per SC DHHS BabyNet FAQ, while `BRIDGES` auto-transmits FFS claims, **"Providers must bill respective MCOs directly when rendering services to a BabyNet child enrolled in an MCO."** | Standard **HIPAA `ASC X12N 837P` (Professional Health Care Claim)** via **SC Medicaid / BCBS EDI Gateway (`GPNet 20.3`)** with a Trading Partner Agreement (`EDIG.Support@PalmettoGBAServices.com`) or modern JSON-to-EDI clearinghouse APIs (**Stedi API**, **Availity**, **Office Ally**). | **1-Click `837P` EDI & Agency Billing CSV Export:** Our app generates both a standards-compliant **`ASC X12 837P` Professional Claim file** (pre-populated with `T1027-TL` / `T1016-TL`, ICD-10 `F81.9`/`F89`, NPI, Taxonomy, Units, and Prior Auth #) and a ** Clearinghouse CSV/JSON Batch** so agency owners can submit all MCO claims in seconds without manual re-keying. |

### 5.2 Exact DOM Field Mapping for the 1-Click `BRIDGES` & `Therap` Auto-Fill Extension

When an EI clicks **"⚡ 1-Click Auto-Fill BRIDGES"** in our Desktop Web Mode, the app packages a local JSON payload (with the child's real name re-attached locally on-device) that maps 1-to-1 to the `BRIDGES` Service Log screen:

1. `plan_selector`: Matches active IFSP date range (`IFSP_Start_Date` to `IFSP_End_Date`) to prevent the dreaded BRIDGES **`"Not BTW"`** (*Date of service not between plan start/end dates*) error.
2. `service_dropdown`: Selects `T1027 - Family Training & Counseling (15 Min.) TL` or `T1016 - Service Coordination TL` or `T1018 - Family Training IFSP Meeting TL`.
3. `service_date`: `MM/DD/YYYY` (validated to be $\le 7$ calendar days old for audit compliance and $< 365$ days old per the Sept 3, 2025 BRIDGES AP rule).
4. `start_time` & `end_time`: Automatically converts to **24-hour Military Time (`HH:MM`, e.g., `12:45` to `13:45`)** whenever the session touches the `12:00 PM – 1:00 PM` hour (per SCDHHS BabyNet FAQ), and enforces zero time overlap across same-day logs.
5. `makeup_checkbox`: Automatically checks the **Sept 3, 2025 BRIDGES Make-Up Visit Checkbox** if the session is flagged as a make-up visit, and splits $>60$-minute combined visits into two non-overlapping logs (`Log 1: 60m Regular` + `Log 2: 30m Make-Up`).
6. `status_code`: Sets `Services Delivered` (billable) or non-billable tracking codes (`No-Show`, `Absence due to family`, `Absence due to provider`).
7. `natural_environment_location`: `Home`, `Community Childcare Center`, or `Other Natural Environment`.
8. `ifsp_outcomes_targeted`: Array of Outcome numbers (`Outcome #1`, `Outcome #2`).
9. `service_note_narrative`: Injects the complete 12-point audit-proof narrative (including explicit active caregiver participation per `ACIS EI-427` and carryover plan per `ACIS EI-426`).
