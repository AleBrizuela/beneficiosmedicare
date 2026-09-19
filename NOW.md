# Lead Ingestion, Email Alerts & Footer Clean-Swap — Status

Branch: `feature/lead-ingestion-footer-swap` (created from `production`, not pushed yet)
Sibling repo: `medicare-california` (local: `mc-temp`), same branch name, not pushed yet.

## What actually exists vs. the original brief

The task brief assumed a `SHIP/` monorepo, `californiaseniorsbenefits.com`, and 8 symmetric
form endpoints. None of that matched the real repos. Ground truth, confirmed by direct
audit of both codebases:

- Real repos: `github.com/AleBrizuela/beneficiosmedicare` (prod branch `production`) and
  `github.com/AleBrizuela/medicare-california` (prod branch `main`).
- `californiaseniorsbenefits.com` was a **retired domain name** for the California site —
  found only as stale canonical/og/schema URLs and an old business-name string in
  `mc-temp/contact.html` and `mc-temp/contact-es.html`. Cleaned up to `medicare-california.com`
  / "Medicare California" branding (6 files).
- `medicare-california.com` has **no lead form of its own** in production — by design
  (see its `_redirects`: all its Spanish pages 301 to beneficiosmedicare.com — "Spanish
  pages that were wrongly hosted same-domain"). It embeds `beneficiosmedicare.com/widget-v4.html`
  via iframe for lead capture. Per your instruction, this was left as-is; only its broken
  `careers.html` fallback was flagged (see below), not fixed.
- Real lead-capture surface = **3 forms**, not 8: `contacto.html` (ES), `contacto-en.html` (EN),
  and `widget-v4.html` (bilingual conversational widget, the live one — `widget.html` and
  `widget-v3.html` are unreferenced/dead and were left alone).

## Changes made

**Footer / disclaimer clean-swap** (replace, not append) — across 58 BM files + 37 MC files:
- TPMO plan-availability statement replaced with your approved copy, using **10 organizations /
  245 products** (the numbers you provided) — plain text, no hyperlinks.
- Non-endorsement sentence ("Not affiliated with or endorsed by the federal Medicare program or
  any government agency.") added once per page.
- 48-hour SOA rule: **no references found in either codebase** — nothing to delete. (Confirmed via
  web search that CMS did eliminate the 48-hour SOA wait, effective for CY2027 marketing
  Oct 1, 2026 — the SOA form itself is still required, just not the wait.)
- Also fixed `shared-footer.js`, a JS file that runs on 16 pages and **overwrites** the static
  `<footer>` at runtime with its own hardcoded copy — the HTML-only sweep would have missed this
  silently. Added a `?v=20260919` cache-buster to its `<script src>` tag on all 16 pages so
  visitors' browsers don't keep serving a stale cached copy of the old disclaimer after deploy.
- **Known gap**: 21 orphaned `index-v2.html`...`index-v21g.html` files in beneficiosmedicare
  (old A/B-test snapshots, unlinked from any live page, but still reachable by direct URL on
  Cloudflare Pages) still carry various older disclaimer variants, some with hyperlinked
  Medicare.gov text. Not touched — recommend deleting these files if they're not needed, or ask
  to run the same clean-swap against them.

**Form fields (contacto.html, contacto-en.html, widget-v4.html only):**
- Phone: `type="tel"`, `required` (already was), added `pattern` + `title` for HTML5 validation,
  tightened JS validation from "≥10 digits" to "exactly 10 digits" everywhere.
- Email: `type="email"`, no `required` (already was correct on all 3).
- Name: `required` (already was correct on all 3).
- Added TCPA consent line (your exact approved copy) directly above/near every submit button —
  4 separate screens in `widget-v4.html` (two of which had a generic "you agree to be contacted"
  line that got replaced, not stacked; two had none and got it added), plus both contact forms.

**Not changed (flagged, not fixed):**
- `careers.html` on **both** sites has a job-application form pointing at a literal placeholder
  `GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL'` — it's non-functional, but it's a recruiting form,
  not a Medicare consumer lead, so it was out of scope for the TCPA/field-attribute/sheet-routing
  work here. Worth fixing separately if you want it working.
- "Calendar meeting handlers" for the Appointments & Bookings sheet tab: the booking flow is an
  external Google Calendar link (`calendar.app.google/...`), not code in either repo. Routing
  its bookings into a sheet tab needs a Calendar-side trigger (Apps Script bound to the calendar,
  or Zapier/Make), not a website change.

## Still pending

1. **Apps Script backend** (Google Sheets 4-tab routing + instant email alert to
   alejamedicare@gmail.com): waiting on you to paste the current script source. Once in hand,
   will extend it with routing logic (Current Leads / Future Leads / Existing Customers /
   Appointments & Bookings) and the `MailApp.sendEmail` alert, then hand back the full script
   for you to paste into the Apps Script editor and redeploy.
2. **Push to remote / staging**: nothing has been pushed. Will confirm with you before pushing
   either branch.
3. Confirm the exact live Cloudflare Pages preview URLs (couldn't verify `pages.dev` URLs from
   the repo alone — no `wrangler.toml` in either repo).
