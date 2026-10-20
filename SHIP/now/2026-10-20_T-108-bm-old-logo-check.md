# T-108 BM — old-logo check + "one file" proof

Grepping for the literal shield-path fragment `M23 2 L43 10` finds it on every page that carries
the logo inline — EXPECTED on a buildless static site with no includes (the ticket's own spec:
"inline, not <img>", "NO JavaScript-injected header"). The actual guarantee the ticket cares
about is not "the string appears nowhere" but "every copy is driven from partials/logo.svg, and
editing that ONE file updates every stamped page." That was tested directly:

## Live-update proof (actually run, not inferred)

1. Appended an HTML comment inside `partials/logo.svg`.
2. Ran `node tools/stamp-shared.mjs`.
3. `grep -rl` for that comment outside `partials/`: **100 pages** picked it up — exactly the
   100 pages `headerStamped` in the summary report, no more, no fewer.
4. Reverted `partials/logo.svg`, re-ran the script: comment count back to 0, `git diff` empty.

## Idempotency proof (actually run)

Ran `node tools/stamp-shared.mjs` twice in a row from a clean commit: second run produced
**zero** working-tree changes (`git diff --quiet` passed) and identical totals both times.

## Gate proven able to fail (actually run)

Hand-edited one word inside an already-stamped page's header (`equipo.html`: "Contáctenos" ->
"HAND-EDITED-BUG"), ran `node tools/check-shared.mjs`: it exited 1, correctly reported
`equipo.html` as the page that drifted, and re-synced it back to the canonical partial. Reverted
the hand-edit, re-ran: exits 0, "[PASS] every shared:* region matches its current partial."
