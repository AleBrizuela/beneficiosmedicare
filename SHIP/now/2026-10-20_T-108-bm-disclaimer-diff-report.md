# T-108 BM — disclaimer / footer-content diff report

Footer content (the CMS multi-plan disclaimer paragraph and everything else in <footer>) was
compared byte-for-byte against the ES/EN majority. Pages below did NOT match and were left
completely untouched — their own footer text is unchanged.

**Stamped (byte-identical to majority, now shared via partials/footer-{es,en}.html): 81 pages.**

**Kept own footer (differs from majority, not touched): 25 pages.**

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

## What the differences actually are (hand-verified, not guessed)

- **22 `california/cities/*` pages**: disclaimer WORDING is byte-identical to the majority.
  The only difference is the (production-invisible) staging-badge script's CSS position:
  majority pages position it `bottom-left`, these 22 position it `top-right`. The badge only
  renders on `*.pages.dev` hosts, never on production. Not stamped this pass out of caution —
  recommend a tiny, separate, content-preserving follow-up to normalize the position and fold
  these in, rather than doing it silently inside T-108.
- **`team.html`**: footer TEXT is identical to the EN majority (`benefits.html` etc.), word for
  word. The only differences are HTML serialization (`<path d="..."/>` vs `<path d="..."></path>`,
  `&copy;` vs `©`) — both render identically. Not stamped this pass for the same reason as above.
- **`presentacion.html` / `presentation.html`**: the approved partner/chamber-of-commerce pages
  (CLAUDE.md, Alejandra 2026-09-24). Different design (`topbar` class, no `sm-footer` class) by
  design, not drift. Out of scope, not touched.

**No page's actual disclaimer WORDING differs from the majority.** The multi-plan figure
("7 organizaciones / 255 productos") is identical everywhere a footer exists.
