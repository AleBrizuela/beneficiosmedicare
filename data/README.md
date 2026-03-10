# Beneficios Medicare - Data Files

Central data folder for all plan data used by the widget (widget-v4.html).

## Susana's Licensed States

**CA, FL, IA, IL, KS, MO, OK, TX**

These 8 states are where Susana is licensed to sell. All other states are included
for informational purposes and may be flagged differently in the widget.


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
- CMS data: March 8, 2026
- Medigap data: March 9, 2026 (33 of 51 states)
- ZIP index: March 8, 2026
