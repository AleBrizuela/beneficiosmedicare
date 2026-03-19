# Beneficios Medicare QA Checklist

Run this before EVERY production deploy. Check staging first, fix issues, then promote.

Staging: https://staging.beneficiosmedicare.pages.dev
Production: https://beneficiosmedicare.com

---

## 1. HEADER (check on every page)

| Check | How to verify |
|-------|--------------|
| SVG logo visible (shield + "Beneficios Medicare") | Visual |
| Logo links to homepage | Click it |
| Nav links: Inicio, Beneficios, Contáctenos | Visual |
| Language toggle (ES/EN pill) visible | Visual |
| Toggle works: ES shows Spanish, EN redirects to EN page | Click both |
| Mobile: hamburger menu appears on small screen | Resize to 375px |
| Mobile: menu opens and shows all nav links | Tap hamburger |
| NO double headers (only ONE header visible) | Visual |
| Header sticks on scroll (mobile) | Scroll down on phone |

## 2. FOOTER (check on every page)

| Check | How to verify |
|-------|--------------|
| "Susana Marcos LLC" brand text | Visual |
| Nav row: Inicio, Beneficios, Estados, Blog, Carreras | Visual, count 5 links |
| Contact row: Llame, Agende Cita Virtual, Email, WhatsApp | Visual, count 4 links |
| Privacy policy link present | Visual |
| Legal disclaimer text present | Visual |
| NO hours of operation showing | Visual |
| All links work (no 404s) | Click each one |
| Footer is identical across all pages | Compare 3+ pages |

## 3. DISCLAIMER BAR (check on every page)

| Check | How to verify |
|-------|--------------|
| White background (not gray) | Visual |
| Light gray text (#9CA3AF) | Visual |
| Text: "Sitio no es parte del gobierno federal..." | Read it |
| Hides on scroll (slides up after scrolling down) | Scroll |

## 4. HOMEPAGE (ES + EN)

| Check | How to verify |
|-------|--------------|
| Hero: uppercase teal label visible | Visual |
| Hero: "Expertos en Beneficios de Medicare" heading | Read it |
| Hero: subtitle on ONE line | Visual |
| Zip code form visible and functional | Type 90001, click Comenzar |
| Widget loads after zip submission | Submit zip |
| Trust badges: Agentes Licenciadas, Certificación AHIP, Equipo Familiar | Visual |
| 3-step section: Asesoría, Comparación, Inscripción | Scroll down |
| Plan types section | Scroll down |
| Team section with photos | Scroll down |
| Carrier logos visible | Scroll down |
| Testimonials section | Scroll down |
| States section (8 states listed) | Scroll down |
| FAQ accordion: all questions expand/collapse | Click each one |
| CTA banner: light blue background, navy text | Visual |
| WhatsApp floating button visible | Visual |
| Mobile: sticky CTA bar at bottom | Check on phone |
| Padding: hero content not cramped (mobile) or too spacious (desktop) | Visual |

## 5. BENEFICIOS PAGE (ES + EN)

| Check | How to verify |
|-------|--------------|
| Hero: "BENEFICIOS DE MEDICARE" label + heading | Visual |
| Hero padding matches contacto page (~140px) | Compare side by side |
| Compare Planes button works | Click it |
| Widget loads and is functional | Submit zip |
| All sections render (Qué es Medicare, Parts A/B/C/D, etc.) | Scroll through |

## 6. CONTACTO PAGE (ES + EN)

| Check | How to verify |
|-------|--------------|
| Hero: "HABLEMOS" label + "Contáctenos" heading | Visual |
| Subtitle: one line, no wrapping | Visual |
| Contact form renders with all fields | Visual |
| WhatsApp / Calendar / Email cards visible on right | Visual |
| Form submission works | Fill and submit |
| NO hours of operation anywhere on page | Ctrl+F "7am" |

## 7. CAREERS PAGE

| Check | How to verify |
|-------|--------------|
| Hero: bilingual tags (We Provide Leads, 100% Remote, Commission-Based) | Visual |
| NO "AI-Powered Tools" tag | Visual |
| 5 job cards visible | Count them |
| Each card has NEW badge (where applicable) | Visual |
| Click card: expands to show details | Click one |
| Other cards stay normal size when one expands | Visual |
| "Apply Now" button scrolls to form | Click it |
| Application form: all fields present | Visual |
| State checkboxes (8 states + N/A) | Count |
| Language checkboxes (English, Español, Other) | Visual |
| "Other" language shows text field when checked | Check the box |
| Resume link field (not file upload) | Visual |
| Form submission works (or shows mailto fallback) | Submit test |
| ES/EN toggle works on careers page | Click both |

## 8. BLOG PAGES

| Check | How to verify |
|-------|--------------|
| Blog index: 3 article cards visible | Visual |
| Each card links to article page | Click one |
| Article page loads with full content | Visual |
| Blog header matches main site style | Compare |
| Blog footer matches main site (shared-footer.js) | Visual |
| NO double headers | Visual |
| Blog nav has: Inicio, Beneficios, Blog, Contáctenos | Visual |

## 9. ESTADO PAGES

| Check | How to verify |
|-------|--------------|
| Page loads for each state: CA, TX, FL, IL, KS, MO, IA, OK | Visit each |
| Header with logo and nav | Visual |
| Language toggle present | Visual |
| Zip code form functional | Type zip |
| Stats section (beneficiaries, plans, experience) | Scroll |
| Footer has Carreras link | Scroll to footer |
| Footer has privacy link | Visual |
| Estados index page lists all 8 states | Visit /estados/ |

## 10. PRIVACY PAGES

| Check | How to verify |
|-------|--------------|
| ES privacy page loads (/privacidad) | Visit |
| EN privacy page loads (/privacy-en) | Visit |
| Content is readable and formatted | Scroll through |
| Footer present and correct | Visual |

## 11. CROSS-PAGE CONSISTENCY

| Check | How to verify |
|-------|--------------|
| Same logo on every page | Compare 5+ pages |
| Same nav links on every page | Compare |
| Same footer on every page | Compare |
| Same disclaimer bar on every page | Compare |
| Font: Open Sans everywhere (no DM Sans, no Crimson) | Inspect |
| Teal color: #00897B everywhere (not #0d9488 or others) | Inspect |
| Navy: #002147 everywhere | Inspect |
| No broken links across entire site | Click through everything |

## 12. MOBILE QA (repeat key checks at 375px width)

| Check | How to verify |
|-------|--------------|
| Homepage hero readable, not cramped | Visual |
| Zip form usable on mobile | Try it |
| Hamburger menu works | Tap |
| Job cards stack vertically on careers | Visual |
| Blog cards stack vertically | Visual |
| Footer links wrap properly | Visual |
| WhatsApp button doesn't block content | Visual |
| All forms submittable on mobile | Try |

## 13. SEO / TECHNICAL

| Check | How to verify |
|-------|--------------|
| Title tag present on every page | View source |
| Meta description present | View source |
| hreflang tags correct (ES/EN pairs) | View source |
| Canonical URL present | View source |
| robots.txt accessible | Visit /robots.txt |
| sitemap.xml accessible | Visit /sitemap.xml |
| No console errors | Open DevTools > Console |
| Page load < 3 seconds | DevTools > Network |

---

## SCORING

Count total PASS vs FAIL. Calculate percentage.

- **95%+**: Ship to production
- **90-94%**: Ship with known issues documented
- **80-89%**: Fix critical issues, re-test, then ship
- **Below 80%**: Do NOT ship. Fix everything first.

---

## QUICK DEPLOY CHECKLIST (after QA passes)

1. `git checkout production`
2. `git merge staging`
3. `git push origin production`
4. `git checkout main && git merge production && git push origin main`
5. Wait 2 minutes for Cloudflare rebuild
6. Spot-check 3 pages on production
7. Done
