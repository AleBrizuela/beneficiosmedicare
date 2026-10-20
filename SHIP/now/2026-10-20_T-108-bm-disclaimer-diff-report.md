# T-108 BM — disclaimer / footer-content diff report

**Stamped (byte-identical to majority, shared via partials/footer-{es,en}.html): 81 pages.**
**Kept own footer (not touched): 25 pages.**

- `california/cities/bakersfield.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/beverly-hills.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/culver-city.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/del-rey.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/el-segundo.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/fresno.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/index.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/long-beach.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/los-angeles.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/mar-vista.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/marina-del-rey.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/mid-city.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/orange-county.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/playa-del-rey.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/playa-vista.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/riverside.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/sacramento.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/san-diego.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/san-francisco.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/san-jose.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/santa-monica.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `california/cities/westchester.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `presentacion.html` — footer text differs from es canonical (not touched — see disclaimer-diff report)
- `presentation.html` — footer text differs from en canonical (not touched — see disclaimer-diff report)
- `team.html` — footer text differs from en canonical (not touched — see disclaimer-diff report)

## What the "kept own" differences actually are (hand-verified)

- **22 `california/cities/*` pages**: disclaimer WORDING is byte-identical to the majority.
  Only difference: the staging-badge script's CSS position (production-invisible, only
  renders on *.pages.dev). Not folded in this pass — flagged for a tiny separate follow-up.
- **`team.html`**: footer TEXT identical to the EN majority, word for word. Only difference:
  HTML serialization (self-closing vs explicit-close SVG tags, `&copy;` vs `©`) — renders
  identically either way. Not folded in this pass for the same reason.
- **`presentacion.html` / `presentation.html`**: approved partner pages (CLAUDE.md, AB
  2026-09-24), different design by intent, not drift. Out of scope.

**No page's actual disclaimer WORDING differs from the majority** — the "7 organizaciones /
255 productos" figure is identical everywhere a footer exists.
