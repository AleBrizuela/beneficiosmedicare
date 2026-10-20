# T-108 BM — off-token / near-miss brand colors (audit only, nothing changed)

Color-token substitution (hex -> var(--name)) was attempted and REVERTED — see the top-of-file
note in tools/stamp-shared.mjs for why (it silently changes rendered color on pages that define
their own CSS variable of the same name with a different value, e.g. widget-v4.html's own
--teal is #00897B, not brand.css's #007B7B). This report is an audit only; zero pages were changed.

## #B2DFDB — NOT a phantom, this is real and widespread

The ticket text in NOW.md names `#B2DFDB` as BM's canonical mint. It is NOT:
`beneficiosmedicare-brand.css` (the actual source of truth per CLAUDE.md) defines
`--mint: #A8D8B9`. But `#B2DFDB` is not invented either — it is the literal, exact hex
hardcoded in the inline <style> block of a large share of BM pages (counted below). This is a
real site-wide divergence between the brand CSS file and what pages actually render, and needs
a DECIDE/DREAM call on which is canonical — not something this ticket should silently resolve.

Total near-miss/off-token hex hits found (file, hex) across inline <style> blocks: 94

- `#B2DFDB`: 89 occurrences
- `#00897B`: 3 occurrences
- `#00796B`: 2 occurrences

Full file list:
- `beneficios.html` — `#B2DFDB`
- `benefits.html` — `#B2DFDB`
- `blog/free-medicare-preventive-services-california.html` — `#B2DFDB`
- `blog/free-medicare-preventive-services-california.html` — `#B2DFDB`
- `blog/inscripcion-anual-aep-2027-california.html` — `#B2DFDB`
- `blog/inscripcion-anual-aep-2027-california.html` — `#B2DFDB`
- `blog/inscripcion-inicial-cumplir-65.html` — `#B2DFDB`
- `blog/inscripcion-inicial-cumplir-65.html` — `#B2DFDB`
- `blog/medi-cal-y-medicare-beneficios-dobles-california.html` — `#B2DFDB`
- `blog/medi-cal-y-medicare-beneficios-dobles-california.html` — `#B2DFDB`
- `blog/medicare-dental-vision-hearing-california.html` — `#B2DFDB`
- `blog/medicare-dental-vision-hearing-california.html` — `#B2DFDB`
- `blog/medicare-diabetes-cobertura-california.html` — `#B2DFDB`
- `blog/medicare-diabetes-cobertura-california.html` — `#B2DFDB`
- `blog/medicare-hmo-vs-ppo-california.html` — `#B2DFDB`
- `blog/medicare-hmo-vs-ppo-california.html` — `#B2DFDB`
- `blog/medicare-jubilacion-familias-hispanas-california.html` — `#B2DFDB`
- `blog/medicare-jubilacion-familias-hispanas-california.html` — `#B2DFDB`
- `blog/medicare-late-enrollment-penalties-california.html` — `#B2DFDB`
- `blog/medicare-late-enrollment-penalties-california.html` — `#B2DFDB`
- `blog/medicare-para-residentes-permanentes-california.html` — `#B2DFDB`
- `blog/medicare-para-residentes-permanentes-california.html` — `#B2DFDB`
- `blog/medicare-part-b-irmaa-california.html` — `#B2DFDB`
- `blog/medicare-part-b-irmaa-california.html` — `#B2DFDB`
- `blog/medicare-parte-a-california.html` — `#B2DFDB`
- `blog/medicare-parte-a-california.html` — `#B2DFDB`
- `blog/medicare-parte-d-medicamentos-california.html` — `#B2DFDB`
- `blog/medicare-parte-d-medicamentos-california.html` — `#B2DFDB`
- `blog/medicare-seguro-empleador-california.html` — `#B2DFDB`
- `blog/medicare-seguro-empleador-california.html` — `#B2DFDB`
- `blog/medicare-special-enrollment-periods-california.html` — `#B2DFDB`
- `blog/medicare-special-enrollment-periods-california.html` — `#B2DFDB`
- `blog/medicare-supplement-plans-california.html` — `#B2DFDB`
- `blog/medicare-supplement-plans-california.html` — `#B2DFDB`
- `blog/medicare-vaccine-coverage-california.html` — `#B2DFDB`
- `blog/medicare-vaccine-coverage-california.html` — `#B2DFDB`
- `blog/medicare-viajes-fuera-estados-unidos-california.html` — `#B2DFDB`
- `blog/medicare-viajes-fuera-estados-unidos-california.html` — `#B2DFDB`
- `blog/medicare-wellness-visit-vs-physical-california.html` — `#B2DFDB`
- `blog/medicare-wellness-visit-vs-physical-california.html` — `#B2DFDB`
- `blog/oep-termina-marzo-2026.html` — `#B2DFDB`
- `blog/oep-termina-marzo-2026.html` — `#B2DFDB`
- `blog/preparese-inscripcion-anual-aep.html` — `#B2DFDB`
- `blog/preparese-inscripcion-anual-aep.html` — `#B2DFDB`
- `california/cities/bakersfield.html` — `#B2DFDB`
- `california/cities/beverly-hills.html` — `#B2DFDB`
- `california/cities/culver-city.html` — `#B2DFDB`
- `california/cities/del-rey.html` — `#B2DFDB`
- `california/cities/el-segundo.html` — `#B2DFDB`
- `california/cities/fresno.html` — `#B2DFDB`
- `california/cities/index.html` — `#B2DFDB`
- `california/cities/index.html` — `#B2DFDB`
- `california/cities/long-beach.html` — `#B2DFDB`
- `california/cities/los-angeles.html` — `#B2DFDB`
- `california/cities/mar-vista.html` — `#B2DFDB`
- `california/cities/marina-del-rey.html` — `#B2DFDB`
- `california/cities/mid-city.html` — `#B2DFDB`
- `california/cities/orange-county.html` — `#B2DFDB`
- `california/cities/playa-del-rey.html` — `#B2DFDB`
- `california/cities/playa-vista.html` — `#B2DFDB`
- `california/cities/riverside.html` — `#B2DFDB`
- `california/cities/sacramento.html` — `#B2DFDB`
- `california/cities/san-diego.html` — `#B2DFDB`
- `california/cities/san-francisco.html` — `#B2DFDB`
- `california/cities/san-jose.html` — `#B2DFDB`
- `california/cities/santa-monica.html` — `#B2DFDB`
- `california/cities/westchester.html` — `#B2DFDB`
- `contact.html` — `#B2DFDB`
- `contact.html` — `#B2DFDB`
- `contact.html` — `#B2DFDB`
- `contacto.html` — `#B2DFDB`
- `contacto.html` — `#B2DFDB`
- `contacto.html` — `#B2DFDB`
- `en.html` — `#B2DFDB`
- `en.html` — `#B2DFDB`
- `equipo.html` — `#B2DFDB`
- `index.html` — `#B2DFDB`
- `index.html` — `#B2DFDB`
- `nosotros.html` — `#B2DFDB`
- `nosotros.html` — `#B2DFDB`
- `politica-editorial.html` — `#B2DFDB`
- `politica-editorial.html` — `#B2DFDB`
- `privacidad.html` — `#B2DFDB`
- `privacidad.html` — `#B2DFDB`
- `privacy.html` — `#B2DFDB`
- `privacy.html` — `#B2DFDB`
- `team.html` — `#B2DFDB`
- `widget-v4.html` — `#00897B`
- `widget-v4.html` — `#00897B`
- `widget-v4.html` — `#00897B`
- `widget-v4.html` — `#00796B`
- `widget-v4.html` — `#00796B`
- `widget-v4.html` — `#B2DFDB`
- `widget-v4.html` — `#B2DFDB`