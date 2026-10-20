# T-108 BM — internal link diff report

Compared every href in the full page (a superset of header+footer+call-bar) before vs after,
across all 113 pages. **0 pages show any added or removed href.**

This is the expected, by-construction result: the stamp script only ever wraps a page's header,
footer or head region in markers when that region's content, INCLUDING every href in it, is
already byte-identical to the canonical partial (after re-substituting the page's own language-link
value back in); any page that doesn't match is left completely untouched. The content-loss and
idempotency checks (see the main report) independently confirm this.
