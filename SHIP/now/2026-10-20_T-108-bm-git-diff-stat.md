# T-108 BM — git diff --stat sanity check (CLAUDE.md content-loss rule)

Per CLAUDE.md: a commit whose stated purpose is a small tweak should show a SMALL,
roughly-equal-per-file diff; a drop of dozens/hundreds of lines in any file is content loss,
not cleanup, regardless of the commit message. Checked: **every one of the 107 changed HTML
pages shows an 8-line-or-smaller delta** (just the <!-- shared:X --> comment pairs added
around content that was already there). Zero files exceed a 30-line delta.

```
 404.html                                           |  4 ++++
 beneficios.html                                    |  6 ++++++
 benefits.html                                      |  6 ++++++
 ...ntes-inscripcion-anual-medicare-california.html | 12 +++++++++++-
 ...cion-abierta-medicare-advantage-california.html | 16 +++++++++++++---
 blog/agente-medicare-confiable-california.html     | 16 +++++++++++++---
 ...-adicionales-medicare-advantage-california.html | 16 +++++++++++++---
 ...beneficios-preventivos-medicare-california.html | 12 +++++++++++-
 ...on-estrellas-medicare-advantage-california.html | 12 +++++++++++-
 blog/carta-anoc-medicare-california.html           | 12 +++++++++++-
 blog/cirugia-cataratas-medicare-california.html    | 12 +++++++++++-
 ...parar-planes-medicare-advantage-california.html | 16 +++++++++++++---
 blog/comparar-supplement-advantage-california.html | 12 +++++++++++-
 ...cambiar-plan-medicare-advantage-california.html | 12 +++++++++++-
 blog/errores-inscripcion-medicare-california.html  | 12 +++++++++++-
 blog/examen-cancer-piel-medicare-california.html   | 12 +++++++++++-
 ...ee-medicare-preventive-services-california.html | 22 ++++++++++++++++------
 ...a-hijos-adultos-medicare-padres-california.html | 12 +++++++++++-
 blog/index.html                                    | 10 +++++++++-
 blog/inscripcion-anual-aep-2027-california.html    | 22 ++++++++++++++++------
 blog/inscripcion-inicial-cumplir-65.html           | 22 ++++++++++++++++------
 ...a-los-65-medicare-seguro-social-california.html | 12 +++++++++++-
 ...tos-bolsillo-medicare-advantage-california.html | 12 +++++++++++-
 blog/lista-medicare-ano-nuevo-california.html      | 12 +++++++++++-
 ...al-y-medicare-beneficios-dobles-california.html | 22 ++++++++++++++++------
 blog/medicamentos-medicare-parte-d-california.html | 16 +++++++++++++---
 blog/medicare-dental-california.html               | 16 +++++++++++++---
 .../medicare-dental-vision-hearing-california.html | 22 ++++++++++++++++------
 blog/medicare-diabetes-california.html             |  6 +++++-
 blog/medicare-diabetes-cobertura-california.html   | 22 ++++++++++++++++------
 ...edicare-gimnasio-silversneakers-california.html | 12 +++++++++++-
 blog/medicare-hmo-vs-ppo-california.html           | 22 ++++++++++++++++------
 ...re-jubilacion-familias-hispanas-california.html | 22 ++++++++++++++++------
 ...icare-late-enrollment-penalties-california.html | 22 ++++++++++++++++------
 ...are-para-residentes-permanentes-california.html | 22 ++++++++++++++++------
 blog/medicare-part-b-irmaa-california.html         | 22 ++++++++++++++++------
 blog/medicare-parte-a-california.html              | 22 ++++++++++++++++------
 blog/medicare-parte-d-medicamentos-california.html | 22 ++++++++++++++++------
 blog/medicare-seguro-empleador-california.html     | 22 ++++++++++++++++------
 ...care-special-enrollment-periods-california.html | 22 ++++++++++++++++------
 blog/medicare-supplement-plans-california.html     | 22 ++++++++++++++++------
 blog/medicare-vaccine-coverage-california.html     | 22 ++++++++++++++++------
 blog/medicare-viajes-fuera-california.html         | 12 +++++++++++-
 ...are-viajes-fuera-estados-unidos-california.html | 22 ++++++++++++++++------
 ...care-wellness-visit-vs-physical-california.html | 22 ++++++++++++++++------
 blog/medigap-plan-g-vs-plan-n-california.html      | 12 +++++++++++-
 blog/oep-termina-marzo-2026.html                   | 22 ++++++++++++++++------
 ...inscripcion-anual-medicare-california-2026.html | 12 +++++++++++-
 ...necesidades-especiales-medicare-california.html | 12 +++++++++++-
 blog/preparese-inscripcion-anual-aep.html          | 22 ++++++++++++++++------
 ...eta-flex-otc-medicare-advantage-california.html | 12 +++++++++++-
 ...medicamentos-medicare-advantage-california.html | 12 +++++++++++-
 ...red-doctores-medicare-advantage-california.html | 12 +++++++++++-
 california/cities/bakersfield.html                 |  8 +++++++-
 california/cities/beverly-hills.html               |  8 +++++++-
 california/cities/culver-city.html                 |  8 +++++++-
 california/cities/del-rey.html                     |  8 +++++++-
 california/cities/el-segundo.html                  |  8 +++++++-
 california/cities/fresno.html                      |  8 +++++++-
 california/cities/index.html                       |  4 ++++
 california/cities/long-beach.html                  |  8 +++++++-
 california/cities/los-angeles.html                 |  8 +++++++-
 california/cities/mar-vista.html                   |  8 +++++++-
 california/cities/marina-del-rey.html              |  8 +++++++-
 california/cities/mid-city.html                    |  8 +++++++-
 california/cities/orange-county.html               |  8 +++++++-
 california/cities/playa-del-rey.html               |  8 +++++++-
 california/cities/playa-vista.html                 |  8 +++++++-
 california/cities/riverside.html                   |  8 +++++++-
 california/cities/sacramento.html                  |  8 +++++++-
 california/cities/san-diego.html                   |  8 +++++++-
 california/cities/san-francisco.html               |  8 +++++++-
 california/cities/san-jose.html                    |  8 +++++++-
 california/cities/santa-monica.html                |  8 +++++++-
 california/cities/westchester.html                 |  8 +++++++-
 california/index.html                              |  6 ++++++
 careers.html                                       |  4 ++++
 como-inscribirse-medicare.html                     | 14 +++++++++++---
 contact.html                                       |  6 ++++++
 contacto.html                                      |  6 ++++++
 costos-medicare-2026.html                          | 14 +++++++++++---
 doble-elegibilidad-medicare-medicaid.html          | 14 +++++++++++---
 en.html                                            |  2 ++
 equipo.html                                        |  8 ++++++++
 estados/california.html                            |  6 ++++++
 estados/florida.html                               |  6 ++++++
 estados/illinois.html                              |  6 ++++++
 estados/index.html                                 |  6 ++++++
 estados/iowa.html                                  |  6 ++++++
 estados/kansas.html                                |  6 ++++++
 estados/missouri.html                              |  6 ++++++
 estados/oklahoma.html                              |  6 ++++++
 estados/texas.html                                 |  6 ++++++
 index.html                                         |  2 ++
 inscripcion-anual-aep.html                         | 14 +++++++++++---
 medicare-advantage-california.html                 | 14 +++++++++++---
 medigap-suplementos-california.html                | 14 +++++++++++---
 nosotros.html                                      | 22 ++++++++++++++++------
 partes-medicare.html                               | 14 +++++++++++---
 politica-editorial.html                            | 22 ++++++++++++++++------
 privacidad.html                                    | 22 ++++++++++++++++------
 privacy.html                                       | 22 ++++++++++++++++------
 que-es-medicare.html                               | 14 +++++++++++---
 site-check.py                                      |  3 ++-
 team.html                                          |  4 ++++
 widget-v3.html                                     |  2 ++
 widget.html                                        |  2 ++
 107 files changed, 1076 insertions(+), 237 deletions(-)
```
