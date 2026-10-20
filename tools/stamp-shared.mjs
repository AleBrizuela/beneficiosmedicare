#!/usr/bin/env node
// T-108 STEP 1 — BM. Wraps today's header/footer/head-fragments in <!-- shared:X --> markers
// and swaps them for the canonical partial content, ONLY when the page's current content is
// byte-identical to a known canonical variant (modulo the one documented per-page variable for
// header: the cross-language link anchor). No page is ever rewritten to content that differs
// from what it already rendered. A page that doesn't match any known canonical variant is left
// completely untouched and recorded in the "kept own X" report instead of guessed at.
//
// Idempotent: a page already wrapped in markers is treated as already-stamped (its marked
// region is re-synced to the current partial, which on a second run is a no-op diff).
//
// Usage: node tools/stamp-shared.mjs            (writes files, prints a summary)
//        node tools/stamp-shared.mjs --dry-run   (reports only, writes nothing)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const PARTIALS = path.join(ROOT, 'partials');
const DRY = process.argv.includes('--dry-run');

const NO_HEADER_FOOTER = new Set([
  'opciones-compartidas.html', 'social/bridge.html',
  'tools/medigap-scraper-v2.html', 'tools/medigap-scraper.html',
  'widget-v3.html', 'widget-v4.html', 'widget.html',
]);
// t31 home header system + topbar partner pages: a different, legitimate header design each,
// out of scope for this pass (see report). Footer/head stamping still attempted on these via
// the generic exact-match check (they may or may not qualify independently).
const HEADER_EXCLUDED = new Set(['index.html', 'en.html', 'presentacion.html', 'presentation.html']);
// "key" header family = sm-header wrapper with t33-head/t31-hcall inner controls (visible phone
// number + labeled menu button), used by the 3 nav-destination pages (benefits/contact/privacy)
// in both languages PLUS the 8 BM-only Spanish evergreen pillar guides that share the same design.
const KEY_PAGES = new Set([
  'beneficios.html', 'contacto.html', 'privacidad.html', 'benefits.html', 'contact.html', 'privacy.html',
  'como-inscribirse-medicare.html', 'costos-medicare-2026.html', 'doble-elegibilidad-medicare-medicaid.html',
  'inscripcion-anual-aep.html', 'medicare-advantage-california.html', 'medigap-suplementos-california.html',
  'partes-medicare.html', 'que-es-medicare.html',
]);

function read(p) { return fs.readFileSync(p, 'utf8'); }
function loadPartial(name) { return read(path.join(PARTIALS, name)); }

function walkHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'partials' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.name.endsWith('.html')) out.push(path.relative(ROOT, full));
  }
  return out;
}

function getLang(html) {
  const m = html.match(/<html[^>]*\blang=["']([a-zA-Z-]+)/);
  return m ? m[1] : null;
}

function extractTag(tag, html) {
  const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`);
  const m = html.match(re);
  return m ? m[0] : null;
}

function markerRegion(marker, html) {
  const re = new RegExp(`<!-- shared:${marker} -->[\\s\\S]*?<!-- /shared:${marker} -->`);
  const m = html.match(re);
  return m ? m[0] : null;
}

function wrap(marker, content) {
  return `<!-- shared:${marker} -->\n${content}\n<!-- /shared:${marker} -->`;
}

// Whitespace BETWEEN tags never affects rendering. Used only to compare/stamp the favicon and
// font link groups, which get pasted at different indent depths across pages; never used for
// header/footer (those compare byte-for-byte, no normalization, since they already match at
// high rates without it and real content differences must not be papered over there).
function normalizeInterTagWs(s) {
  return s.trim().replace(/>\s+</g, '><');
}

const LANGLINK_RE = /<a\s[^>]*(?:hreflang="en"|hreflang="es")[^>]*>(?:In English|En Español)<\/a>/g;

function tokenizeLangLink(headerHtml) {
  const matches = [...headerHtml.matchAll(LANGLINK_RE)].map(m => m[0]);
  const template = headerHtml.replace(LANGLINK_RE, '{{LANG_LINK}}');
  return { template, matches };
}

// ---------- load canonical partials ----------
const headerPartials = {
  'plain-es': loadPartial('header-es.html'),
  'plain-en': loadPartial('header-en.html'),
  'key-es': loadPartial('header-key-es.html'),
  'key-en': loadPartial('header-key-en.html'),
};
const footerPartials = {
  es: loadPartial('footer-es.html'),
  en: loadPartial('footer-en.html'),
};
const headPartial = loadPartial('head.html');
const ga4Canon = headPartial.match(/<!-- shared:head-ga4 -->\n([\s\S]*?)\n<!-- \/shared:head-ga4 -->/)[1];
const favCanon = headPartial.match(/<!-- shared:head-favicon -->\n([\s\S]*?)\n<!-- \/shared:head-favicon -->/)[1];
const fontCanon = headPartial.match(/<!-- shared:head-font -->\n([\s\S]*?)\n<!-- \/shared:head-font -->/)[1];
const favAlt = loadPartial('head-favicon-alt.html').trim();
const fontAlt = loadPartial('head-font-alt.html').trim();
const logoSvg = loadPartial('logo.svg').trim();

// sanity: canonical header partials must each carry exactly one {{LANG_LINK}} token (appearing
// twice: desktop + mobile nav) and exactly one {{LOGO}} token — the logo lives ONLY in
// partials/logo.svg; editing that one file and re-running this script updates every stamped page.
for (const [name, tmpl] of Object.entries(headerPartials)) {
  const n = (tmpl.match(/\{\{LANG_LINK\}\}/g) || []).length;
  if (n !== 2) throw new Error(`partial header-${name}.html: expected 2 {{LANG_LINK}} tokens, found ${n}`);
  const logoN = (tmpl.match(/\{\{LOGO\}\}/g) || []).length;
  if (logoN !== 1) throw new Error(`partial header-${name}.html: expected 1 {{LOGO}} token, found ${logoN}`);
}

// ---------- hex color audit (REPORT ONLY — see README for why substitution was abandoned) ----------
// T-108 STEP 1 originally planned to replace exact-match brand hex values inside each page's
// inline <style> with var(--name). ABANDONED after a dry run showed it is unsafe as a blind
// string substitution: (1) many pages — including widget-v4.html, the plan-finder widget on the
// lead path — already define their OWN :root with the SAME variable names (--navy, --teal,
// --gray, …) but DIFFERENT values (e.g. widget-v4.html's --teal is #00897B, the retired Material
// teal CLAUDE.md warns about, not brand.css's #007B7B), so substituting the literal hex for
// var(--teal) silently changes the rendered colour to whatever that page's own --teal already is.
// (2) brand-tokens.css is not linked into any page yet, so on pages with NO local redefinition
// the variable would resolve to nothing at all. (3) a first pass even rewrote INSIDE a page's own
// :root declaration line itself, turning `--navy:#002147` into the circular `--navy:var(--navy)`,
// which breaks the variable everywhere it's used on that page. This needs its own ticket: link
// brand-tokens.css, detect/reconcile each page's own :root first, then substitute — not a
// find/replace. This script only AUDITS and reports near-miss / off-token hexes; it changes none.
const BRANDISH_NEARMISS = [/#00897B/i, /#00796B/i, /#B2DFDB/i]; // Material defaults + the hex the ticket text used for "mint", which isn't brand.css's actual --mint

function auditColorsInStyle(html, relPath, offTokenLog) {
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/g;
  let m;
  while ((m = styleRe.exec(html))) {
    const inner = m[1];
    for (const re of BRANDISH_NEARMISS) {
      const matches = inner.match(new RegExp(re.source, 'gi'));
      if (matches) for (const hex of matches) offTokenLog.push({ file: relPath, hex });
    }
  }
}

// ---------- main ----------
const files = walkHtml(ROOT).filter(f => !f.startsWith('partials/'));
const report = {
  headerStamped: [], headerKept: [],
  footerStamped: [], footerKept: [],
  ga4Stamped: [], ga4Kept: [],
  favStamped: [], favKept: [],
  fontStamped: [], fontKept: [],
  logoInlined: 0,
  offTokenColors: [],
  errors: [],
};

for (const rel of files) {
  let html = read(path.join(ROOT, rel));
  const original = html;
  const lang = getLang(html);

  // ---- HEADER ----
  if (NO_HEADER_FOOTER.has(rel) || HEADER_EXCLUDED.has(rel)) {
    if (!NO_HEADER_FOOTER.has(rel)) report.headerKept.push({ file: rel, why: 'different header system (t31 home / topbar partner page), out of scope for STEP 1' });
  } else {
    const existingMarked = markerRegion('header', html);
    const currentHeader = existingMarked
      ? existingMarked.replace(/^<!-- shared:header -->\n/, '').replace(/\n<!-- \/shared:header -->$/, '')
      : extractTag('header', html);
    if (!currentHeader) {
      report.headerKept.push({ file: rel, why: 'no <header> found' });
    } else {
      const family = KEY_PAGES.has(rel) ? 'key' : 'plain';
      const famLang = lang === 'en' ? 'en' : 'es';
      const canon = headerPartials[`${family}-${famLang}`];
      const { template, matches } = tokenizeLangLink(currentHeader);
      const hasLogo = template.includes(logoSvg);
      const templateNoLogo = hasLogo ? template.replace(logoSvg, '{{LOGO}}') : template;
      // First run (no markers yet): a page only enters the shared system if its current content,
      // modulo the lang-link and the logo, is byte-identical to the family canon — this is the
      // one-time eligibility gate, never skipped. Once marked (any later run), the page is
      // trusted and unconditionally re-synced to whatever the partial says NOW — that is the
      // entire point of the markers ("future change = edit one partial, run the script, done").
      const eligible = existingMarked || (matches.length === 2 && matches[0] === matches[1] && hasLogo && templateNoLogo === canon);
      if (eligible && matches.length === 2 && matches[0] === matches[1]) {
        const rebuilt = canon.replace(/\{\{LANG_LINK\}\}/g, matches[0]).replace('{{LOGO}}', logoSvg);
        const newHeaderBlock = wrap('header', rebuilt);
        if (existingMarked) html = html.replace(existingMarked, newHeaderBlock);
        else html = html.replace(currentHeader, newHeaderBlock);
        report.headerStamped.push({ file: rel, family, lang: famLang });
        if (rebuilt.includes(logoSvg)) report.logoInlined++;
      } else {
        report.headerKept.push({ file: rel, why: `header content differs from ${family}-${famLang} canonical beyond the language link (or lang-link mismatch between desktop/mobile)` });
      }
    }
  }

  // ---- FOOTER ----
  {
    const existingMarked = markerRegion('footer', html);
    const currentFooter = existingMarked
      ? existingMarked.replace(/^<!-- shared:footer -->\n/, '').replace(/\n<!-- \/shared:footer -->$/, '')
      : extractTag('footer', html);
    if (currentFooter) {
      const famLang = lang === 'en' ? 'en' : 'es';
      const canon = footerPartials[famLang];
      // Same "trust once marked" rule as header: the exact-match gate only decides first-time
      // eligibility; once marked, a later edit to the partial propagates unconditionally.
      if (existingMarked || currentFooter === canon) {
        const newBlock = wrap('footer', canon);
        html = existingMarked ? html.replace(existingMarked, newBlock) : html.replace(currentFooter, newBlock);
        report.footerStamped.push({ file: rel, lang: famLang });
      } else {
        report.footerKept.push({ file: rel, why: `footer text differs from ${famLang} canonical (not touched — see disclaimer-diff report)` });
      }
    }
  }

  // ---- HEAD: GA4 ----
  {
    const existingMarked = markerRegion('head-ga4', html);
    const ga4Re = /<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+"><\/script>\s*<script>[\s\S]*?<\/script>/;
    const current = existingMarked
      ? existingMarked.replace(/^<!-- shared:head-ga4 -->\n/, '').replace(/\n<!-- \/shared:head-ga4 -->$/, '')
      : (html.match(ga4Re) || [null])[0];
    if (current) {
      if (existingMarked || current === ga4Canon || normalizeInterTagWs(current) === normalizeInterTagWs(ga4Canon)) {
        const newBlock = wrap('head-ga4', ga4Canon);
        html = existingMarked ? html.replace(existingMarked, newBlock) : html.replace(current, newBlock);
        report.ga4Stamped.push(rel);
      } else {
        report.ga4Kept.push({ file: rel, why: 'GA4 script block differs from canonical (not touched)' });
      }
    } else {
      report.ga4Kept.push({ file: rel, why: 'no GA4 script found on this page' });
    }
  }

  // ---- HEAD: favicon ----
  // Two known-good variants exist (primary 3-link, alt svg-only). Which one a page is pinned to
  // is recorded in the marker name itself (head-favicon vs head-favicon-alt) so a later run can
  // re-sync it from the right partial even if that partial's content has since changed.
  {
    const markedPrimary = markerRegion('head-favicon', html);
    const markedAlt = !markedPrimary ? markerRegion('head-favicon-alt', html) : null;
    const existingMarked = markedPrimary || markedAlt;
    const markedVariant = markedPrimary ? 'head-favicon' : (markedAlt ? 'head-favicon-alt' : null);
    const favRe = /<link\s+[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>(?:\s*<link\s+[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>)*/;
    const current = existingMarked
      ? existingMarked.replace(new RegExp(`^<!-- shared:${markedVariant} -->\\n`), '').replace(new RegExp(`\\n<!-- /shared:${markedVariant} -->$`), '')
      : (html.match(favRe) || [null])[0];
    if (current) {
      const cur = normalizeInterTagWs(current);
      if (markedVariant === 'head-favicon' || (!existingMarked && cur === normalizeInterTagWs(favCanon))) {
        const newBlock = wrap('head-favicon', favCanon.trim());
        html = existingMarked ? html.replace(existingMarked, newBlock) : html.replace(current, newBlock);
        report.favStamped.push({ file: rel, variant: 'primary' });
      } else if (markedVariant === 'head-favicon-alt' || (!existingMarked && cur === normalizeInterTagWs(favAlt))) {
        const newBlock = wrap('head-favicon-alt', favAlt);
        html = existingMarked ? html.replace(existingMarked, newBlock) : html.replace(current, newBlock);
        report.favStamped.push({ file: rel, variant: 'alt (svg-only)' });
      } else {
        report.favKept.push({ file: rel, why: 'favicon links differ from both known canonical variants' });
      }
    } else {
      report.favKept.push({ file: rel, why: 'no favicon link found on this page' });
    }
  }

  // ---- HEAD: font ----
  {
    const markedPrimary = markerRegion('head-font', html);
    const markedAlt = !markedPrimary ? markerRegion('head-font-alt', html) : null;
    const existingMarked = markedPrimary || markedAlt;
    const markedVariant = markedPrimary ? 'head-font' : (markedAlt ? 'head-font-alt' : null);
    const fontRe = /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?<\/noscript>/;
    const current = existingMarked
      ? existingMarked.replace(new RegExp(`^<!-- shared:${markedVariant} -->\\n`), '').replace(new RegExp(`\\n<!-- /shared:${markedVariant} -->$`), '')
      : (html.match(fontRe) || [null])[0];
    if (current) {
      const cur = normalizeInterTagWs(current);
      if (markedVariant === 'head-font' || (!existingMarked && cur === normalizeInterTagWs(fontCanon))) {
        const newBlock = wrap('head-font', fontCanon);
        html = existingMarked ? html.replace(existingMarked, newBlock) : html.replace(current, newBlock);
        report.fontStamped.push({ file: rel, variant: 'primary' });
      } else if (markedVariant === 'head-font-alt' || (!existingMarked && cur === normalizeInterTagWs(fontAlt))) {
        const newBlock = wrap('head-font-alt', fontAlt);
        html = existingMarked ? html.replace(existingMarked, newBlock) : html.replace(current, newBlock);
        report.fontStamped.push({ file: rel, variant: 'alt' });
      } else {
        report.fontKept.push({ file: rel, why: 'font-loading links differ from both known canonical variants' });
      }
    } else {
      report.fontKept.push({ file: rel, why: 'no font link found on this page' });
    }
  }

  // ---- inline <style> color audit (report only, never rewrites — see note above) ----
  auditColorsInStyle(html, rel, report.offTokenColors);

  if (html !== original && !DRY) {
    fs.writeFileSync(path.join(ROOT, rel), html, 'utf8');
  }
}

// ---------- print summary ----------
console.log(JSON.stringify({
  dryRun: DRY,
  totals: {
    files: files.length,
    headerStamped: report.headerStamped.length,
    headerKept: report.headerKept.length,
    footerStamped: report.footerStamped.length,
    footerKept: report.footerKept.length,
    ga4Stamped: report.ga4Stamped.length,
    ga4Kept: report.ga4Kept.length,
    favStamped: report.favStamped.length,
    favKept: report.favKept.length,
    fontStamped: report.fontStamped.length,
    fontKept: report.fontKept.length,
    offTokenColorsAudited: report.offTokenColors.length,
  },
}, null, 2));

fs.writeFileSync(path.join(ROOT, 'tools', '.last-stamp-report.json'), JSON.stringify(report, null, 2));
