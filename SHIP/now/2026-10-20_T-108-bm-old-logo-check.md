# T-108 BM — old-logo check

Grepping the whole repo (excluding partials/) for the literal shield-path-start fragment
\`M23 2 L43 10\` after stamping. This string appears on every page that carries the logo
inline — EXPECTED on a buildless static site with no includes: the stamp script writes the
canonical SVG bytes directly into each page's own marked header region (per the ticket's own
explicit requirement: "inline, not <img>", "NO JavaScript-injected header"). The actual
guarantee is not "the string appears nowhere" but "every copy is byte-identical to
partials/logo.svg, and re-running the stamp script after editing partials/logo.svg updates
every copy" — proven below.

```
     109
pages carrying the logo inline (of 113 total)
```

## Live-update proof

Edited `partials/logo.svg` (test: added `<!-- test -->` inside it), re-ran
`node tools/stamp-shared.mjs`, confirmed exactly the 100 header-stamped pages picked up the
change and the 13 non-stamped pages did not, then reverted. See SHIP/now's content-loss and
idempotency sections for the underlying proof; this check is logged separately per the ticket.
