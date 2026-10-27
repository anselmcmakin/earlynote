# 03 — Demo & QA Template Caseload Guide

Reference date: **Monday, Oct 26, 2026**. Synthetic data only: no real PHI and no dollar amounts.
Data file: `prototype/template_caseload.json`. It's embedded into `prototype/index.html` at build time from `prototype/build_template.html`. To rebuild, replace `__DATA__` with the JSON.

## The 8 children

| # | Child | Program | DOB | Intake | IFSP Start | What it tests | Countdown (as of Oct 26) |
|---|---|---|---|---|---|---|---|
| 0 | Liam Smith (22 mos) | BabyNet | 2024-12-14 | 2025-03-20 | 2026-05-03 | 6-mo periodic review (Start+180d) and 7-day PWN; BRIDGES 12:45 PM noon safeguard | Oct 30, 2026 (4d) |
| 1 | Maya Thompson (33 mos) | BabyNet → LEA | 2024-01-22 | 2024-09-10 | 2026-02-15 | LEA transition conf. (DOB+3y−90d = Oct 24, open now); DDSN continuation Jan 8, 2027; daycare visit | Turns 3 Jan 22, 2027 (88d) |
| 2 | Noah Brooks (14 mos) | BabyNet referral | 2025-08-19 | 2026-09-18 | 2026-11-02 (pending) | 45-day intake→initial IFSP; 38 min = 3u boundary | Nov 2, 2026 (7d) |
| 3 | Ava Robinson (35 mos) | BabyNet → DDSN | 2023-11-06 | 2024-04-02 | 2025-11-10 | 3rd-birthday billing hard cutoff; DDSN 14-day window (opened Oct 23); make-up split | Nov 6, 2026 (11d) |
| 4 | Caleb Jenkins (25 mos) | BabyNet | 2024-09-12 | 2024-09-25 | 2025-11-08 | 365-day annual IFSP + vision/hearing; T1016-TL service coord. | Nov 8, 2026 (13d) |
| 5 | Chloe Vance (4y 2m) | DDSN | 2022-08-14 | 2025-08-01 | 2026-06-01 | Ages 3–6 DDSN, Therap → CDSS nightly sync, monthly SC contact | Monthly contact by Oct 31 |
| 6 | Lucas Martinez (19 mos) | BabyNet | 2025-03-11 | 2025-12-01 | 2026-01-12 | On-track state; Spanish interpreter + PT co-visit | Annual Jan 12, 2027 (78d) |
| 7 | Zoe Patel (9 mos, adj. 7) | BabyNet NICU | 2026-01-18 | 2026-06-15 | 2026-07-25 | 6-mo review approaching; 25 min = 2u | Jan 21, 2027 (87d) |

Urgent filter (≤14 days or transition window open): Liam, Maya, Noah, Ava, Caleb = **5**.

## Formulas the app calculates
- Initial IFSP = Intake + 45 calendar days
- Periodic review = IFSP Start + 180 days. Annual = IFSP Start + 365 days (billing block if it lapses)
- LEA transition conference = 3rd birthday − 90 days. DDSN continuation = 3rd birthday − 14 days. BabyNet billing hard stop = 3rd birthday

## Today's schedule (6 visits)
| Time (24h) | Child | Min | Units | Code | Status |
|---|---|---|---|---|---|
| 09:00–10:00 | Maya | 60 | 4 | T1027-TL | Signed |
| 10:30–11:08 | Noah | 38 | 3 | T1027-TL | Signed |
| 12:45–13:45 | Liam | 60 | 4 | T1027-TL | Active |
| 14:00–15:15 | Ava | 75 | 5 (3 Reg + 2 Make-Up) | T1027-TL | Upcoming |
| 15:45–16:10 | Caleb | 25 | 2 | T1016-TL | Upcoming |
| 16:30–17:15 | Chloe | 45 | 3 | DDSN Therap | Upcoming |

Total = **21 units** (against a 20-unit daily target). Weekly display: 68 / 85.

## Test matrix
**CMS 8-Minute Rule (15-min units):** 8–22 = 1, 23–37 = 2, 38–52 = 3, 53–67 = 4, 68–82 = 5. Edge cases: Zoe 25m → 2, Noah 38m → 3, Liam 60m → 4, Ava 75m → 5.
**BRIDGES 24h:** Any visit starting 12:xx PM must be entered as 12:xx in 24-hour time, never 00:xx. Liam's 12:45 PM visit goes in as 12:45–13:45. Entering 00:45 would calculate 52+ units.
**Make-Up Split:** Ava's visit becomes two log entries: 14:00–14:45 Regular (45m, 3u) and 14:45–15:15 Make-Up (30m, 2u).

## Sample voice dictations
- **Liam:** "Worked with Sarah at snack time on two-word requests; Liam said 'more cracker' twice. Practiced stairs, one hand held."
- **Maya:** "At Sunshine Sprouts with Ms. Green and Elena; Maya followed one-step directions at circle time 3 of 4 times with a visual cue."
- **Noah:** "Completed developmental assessment and family routines interview with Jasmine; eligibility review pending."
- **Ava:** "Forty-five minutes of regular spoon-feeding coaching, then a thirty-minute make-up for the canceled session; reviewed the DDSN transition."
- **Caleb:** "Phone call with Tara; scheduled the pediatric audiology appointment and sent the SLP referral."
- **Chloe:** "Coached Dana on the picture bedtime schedule; Chloe tolerated tooth brushing for 40 seconds."
- **Lucas:** "Joint visit with PT and a Spanish interpreter; Ana practiced pull-to-stand at the couch."
- **Zoe:** "Brief check-in on feeding and positioning; head control held in supported sitting; bottle took 22 minutes."

## Test links
`?theme=oat|terracotta|periwinkle` · `?view=schedule|child&child=0..7` · `?mobileScreen=schedule|recorder|caseload|child`
