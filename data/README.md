# Beneficios Medicare - Data Files

Central data folder for all plan data used by the widget (widget-v4.html).

## Plan year 2027 (live data for widget-v4, since T-017, 2026-10-02)

### plans_{STATE}_2027.json (56 files)
Every MA, SNP, Cost and PDP plan CMS lists for 2027, one file per state/territory, ~5.6 MB total
(California 515 KB, 33 KB compressed). Built from the CMS CY2027 Landscape (data last updated
09/22/2026) and CMS PBP Benefits 2027 (released 2026-10-01) by
`SHIP/reference/tools/build-plan-data-2027.py`, which lives OUTSIDE this repo because repo-root
files are served publicly. Checked against the raw CMS files by `spot-check-plan-data-2027.py`
(same folder). Each file carries its own `year` and `source`; the widget displays those.
- Format: `{year, state, source, statewide, zips:{zip:county}, counties:{county:[plan index]}, plans:[...]}`
- Plan fields: id, name, org, parent (CMS parent organization), cat, type, snp, drug, prem, partc,
  partd, dded (Part D deductible), moop, stars (null until CMS publishes 2027 ratings), sanction,
  pcp, spec, er, urg, dental, vision, hearing, otc, tiers, dbt (Part D benefit type).
- Card detail added 2026-10-02 (T-017 b3-b7, b6b), all from PBP 2027: hosp (inpatient 1a: per stay,
  per-day intervals, or Original Medicare cost share), ohosp (9a), asc (9b), amb {ground, air} (10a),
  trans (10b rides; false = not offered), fit (14c4 fitness), dent {prev, comp, pmax, cmax} (16b/16c),
  vis {exam, exam_cs, wear, wmax} (17a/17b), hear {exam, exam_cs, aids, amax{amt,per,ear}, acopay} (18a/18b),
  ins (insulin 1-month cap), noded (tiers the drug deductible skips). Each tier: v = standard pharmacy,
  p = preferred pharmacy when the plan has a preferred network. Dollar maximums carry CMS's period;
  no amount in the file = no amount shown.
- The ZIP -> county map is the 2026 one, reused. Known gaps: backlog D-054.
- Every PBP field for every plan is kept outside the repo in
  `SHIP/now/2027-plan-data/pbp-full/` (34 MB, internal tools only).

### represented-2027.json
Licensed states (AZ CA FL IA IL KS MO OK TX) and, per state, the CMS parent organizations we are
appointed with and Ready to Sell for 2027. Drives the agent button. RED: change only with AB's sign-off.

### plan-year.json
Says 2027. Kept in step; the widget reads the year from the plan file itself.

## Plan year 2026 (kept for rollback, no longer loaded by widget-v4)

The files below (`cms_*.js`, `benefits_*_2026.json`) are the 2026 data. Do not delete them until
2027 has been live through AEP; rollback is one revert of the T-017 commit.

## File Index

### zip_index.js
Maps every US ZIP code to its state code. Used by `loadPlansForZip()` to determine
which state data file to load.
- Format: `const ZIP_INDEX = {"00501":"NY","00544":"NY",...};`
- ~521 KB

### cms_{STATE}.js (56 files)
Medicare Advantage, PDP, and SNP plan data from CMS landscape files.
One file per state/territory. Covers all 50 states + DC + territories (AS, GU, MP, PR, VI).
- Format: `const CMS_STATE_DATA = {state, zips:{...}, plans:{county:[...]}};`
- Total: ~31 MB
- Source: CMS landscape data (2026)
- Plan types: HMO, HMO-POS, PPO, Regional PPO, PFFS, PDP, HMO D-SNP, PPO D-SNP, HMO C-SNP, HMO I-SNP

### medigap_all.js
Medigap / Medicare Supplement plan data scraped from Medicare.gov API.
All states combined in one file.
- Format: `const MEDIGAP_ALL_DATA = {"CA":{state,plans:[{type,premium_min,premium_max,policies:[...]}]},...};`
- ~354 KB
- Source: Medicare.gov Medigap API (March 2026)
- Plan types per state: A, B, C, D, F, HIGH_F, G, HIGH_G, K, L, N (up to 12)
- Each plan type includes carrier policies with company name, rating type, and premium

#### Medigap coverage status (33 of 51):
- **Have data:** AK, AL, AR, AZ, CA, CO, CT, DC, DE, FL, GA, HI, IA, ID, IL,
  IN, KS, KY, LA, MD, ME, MI, MN, MO, MS, MT, NE, NH, NJ, NM, NV, NY
- **Missing (rate limited):** MA*, NC, ND, OH, OK**, OR, PA, RI, SC, SD, TN, TX**, UT, VA, VT, WA, WV, WI, WY

  *MA returned 0 plans (Massachusetts has its own Medigap system)
  **OK and TX are licensed states still missing Medigap data


## How to Update

### CMS Data
Run the CMS landscape scraper (tools/cms-scraper.html or Node script).
New data is published by CMS annually for the upcoming plan year.

### Medigap Data
Option A: Use tools/medigap-scraper-v2.html (open in browser, click Start).
Option B: Navigate to medicare.gov and run API fetches from the console.
Medicare.gov rate-limits after ~15-18 states per session. Use a different
browser or wait and retry for remaining states.

API endpoints:
- Plans: `/api/v1/data/plan-compare/medigap/plans?state={ST}&zipcode={ZIP}`
- Policies: `/api/v1/data/plan-compare/medigap/policies?medigap_plan_type={TYPE}&state={ST}&zipcode={ZIP}`


## Last Updated
- 2027 plan data: October 2, 2026 (T-017)
- CMS data: March 8, 2026
- Medigap data: March 9, 2026 (33 of 51 states)
- ZIP index: March 8, 2026
