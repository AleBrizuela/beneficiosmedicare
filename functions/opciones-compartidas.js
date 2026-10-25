/* T-105 · the link preview of a shared comparison, per link (AB 2026-10-18).
 * T-113 (AB 2026-10-19 audit, ZIP 64078) · "less is more":
 *   - the title no longer lists plan names. That was the actual bug AB found: with 3 plans it read
 *     "Humana Essentials Plus Giveback, Humana Essentials Plus Giveback, Huma..." -- one name repeated
 *     and the whole thing cut off by the platform's own title-length limit. The count and the place are
 *     enough; the names are one tap away on the page itself.
 *   - no description at all. The image already carries the tagline, the agent's name and phone, so a
 *     caption repeating them was pure duplication.
 *   - the "what changes" title no longer depends on a dedicated ?chg=1 flag. The widget only ever
 *     produces a single-plan share for that screen, with hoy= set to that same plan's id (T-113 dropped
 *     chg=1 as redundant with that), so ids.length===1 && hoy===ids[0] is the one-plan "what changes"
 *     share and anything else is an ordinary compare.
 *
 * WhatsApp, iMessage, Facebook and Gmail do not run JavaScript: the preview is whatever HTML the server
 * hands their crawler. /opciones-compartidas is one static file for every link, so on its own every preview
 * reads the same. For a link-preview crawler only, this serves that same file with its og/twitter tags
 * rewritten from the link: the agent for the ZIP's state (T-102: Susana for KS, MO, TX, FL; Alejandra for
 * everything else) and her card image (1200x630, og-plans-bm-<agent>-<lang>-20261024.jpg; T-136).
 *
 * People get the plain file, untouched and with no extra work: the page draws itself in the browser. Only a
 * crawler (or ?og=1, for checking) pays for the two lookups, and both are plain text searches, never a JSON
 * parse of a large plan file, to stay well inside a Function's CPU budget. Anything unexpected returns the
 * plain file, so a shared link always opens.
 *
 * Rebuilt 2026-10-18 13:05 spec: unchanged logic from the first T-105 build (reused), plus the Gmail image
 * proxy and page-renderer user agents. iMessage's crawler announces itself as facebookexternalhit/Facebot/
 * Twitterbot, so it is covered by those.
 */
const BOT = /facebookexternalhit|facebot|whatsapp|twitterbot|slackbot|linkedinbot|telegrambot|discordbot|skypeuripreview|googlebot|google-inspectiontool|googleimageproxy|google-pagerenderer|bingbot|applebot|pinterest|embedly|redditbot|iframely|vkshare|outbrain|quora link preview|nuzzel|bitlybot|xing-contenttabreceiver|mastodon|bluesky/i;
const SUSANA = { KS: 1, MO: 1, TX: 1, FL: 1 };
const AGENTS = {
  susana: { first: 'Susana', name: 'Susana Marcos', tel: '(913) 488-5341' },
  alejandra: { first: 'Alejandra', name: 'Alejandra Brizuela', tel: '(310) 597-9142' }
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// "H4348_001_0" -> "H4348-001" (the form a link carries), as planIdRaw does in the widget
const rawId = id => { const m = String(id).split('_'); return m[0] + (m[1] ? '-' + m[1] : '') + (m[2] && m[2] !== '0' ? '-' + m[2] : ''); };
// '"<key>":"<value>"' found by plain search
function pick(text, key) {
  const k = '"' + key + '":"', i = text.indexOf(k);
  if (i < 0) return '';
  const j = text.indexOf('"', i + k.length);
  return j < 0 ? '' : text.slice(i + k.length, j);
}

export async function onRequestGet(context) {
  const { request, env, next } = context;
  const res = await next();
  try {
    const url = new URL(request.url);
    const force = url.searchParams.get('og') === '1';
    if (!force && !BOT.test(request.headers.get('user-agent') || '')) return res;
    if (!/text\/html/i.test(res.headers.get('content-type') || '')) return res;
    const zip = url.searchParams.get('zip') || '';
    const ids = (url.searchParams.get('p') || '').split(',').filter(x => /^[A-Z0-9-]{4,}$/i.test(x)).slice(0, 3);
    // T-139: a shared LIST link carries no plan ids at all (it replays filters, not a plan set), so
    // its own count (n) and filter words (t) -- written by shareListURL() in widget-v4.html -- stand
    // in for what `ids` gives the compare case below.
    const listN = parseInt(url.searchParams.get('n') || '0', 10) || 0;
    const isList = !ids.length && listN > 0;
    if (!/^\d{5}$/.test(zip) || (!ids.length && !isList)) return res;
    const en = url.searchParams.get('lang') === 'en';

    const zi = await env.ASSETS.fetch(new URL('/data/zip_index.js', url.origin));
    const st = zi.ok ? pick(await zi.text(), zip) : '';
    if (!/^[A-Z]{2}$/.test(st)) return res;
    const ak = SUSANA[st] ? 'susana' : 'alejandra', A = AGENTS[ak];

    // T-138: the place is the CITY (USPS default city + state), never the county -- one fetch,
    // same plain-text pick() trick, replaces the old zip_index(state)+plans_ST_2027.json(county) pair.
    let place = '';
    const zc = await env.ASSETS.fetch(new URL('/data/zip_city.js', url.origin));
    if (zc.ok) place = pick(await zc.text(), zip);
    const where = place || st;

    const n = isList ? listN : ids.length;
    // T-113: the widget only ever shares a single plan from the "what changes" screen, tagged with
    // hoy= equal to that same plan's id (?chg=1 was redundant with that and is gone) -- so that
    // exact shape, and nothing else, is "what changes" rather than an ordinary compare.
    const hoy = url.searchParams.get('hoy') || '';
    const chg = !isList && n === 1 && !!hoy && hoy === ids[0];
    // T-139: list-share words (typeNameWords + priorityNameWords, written by the widget's own
    // shareListURL) go BEFORE "plan(s)" in English, AFTER "plan(es)" in Spanish -- same order as
    // the results screen's own headline (resultsTitlePlain), not the same position in both languages.
    const t = isList ? (url.searchParams.get('t') || '') : '';
    // T-138 (7): no "Medicare" -- the logo and the link already say it.
    const title = chg
      ? (en ? 'What changes in your plan for 2027' : 'Lo que cambia en su plan en 2027')
      : isList
      ? (en ? `${n}${t ? ' ' + t : ''} plan${n === 1 ? '' : 's'} in ${where}`
            : `${n} plan${n === 1 ? '' : 'es'}${t ? ' ' + t : ''} en ${where}`)
      : en
      ? `${n} plan${n === 1 ? '' : 's'} for 2027 in ${where}`
      : `${n} plan${n === 1 ? '' : 'es'} 2027 en ${where}`;
    const img = `${url.origin}/og-plans-bm-${ak}-${en ? 'en' : 'es'}-20261024.jpg`;
    const alt = en ? `${A.name}, ${A.tel}, BeneficiosMedicare.com` : `${A.name}, ${A.tel}, BeneficiosMedicare.com`;

    // T-113: no description at all -- the image already carries the tagline, the agent's name and
    // phone, so the static file's og:description/twitter:description tags were dropped; nothing here
    // replaces them.
    const html = (await res.text())
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)} | Beneficios Medicare</title>`)
      .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`)
      .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${esc(img)}">`)
      .replace(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="${esc(alt)}">`)
      .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`)
      .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${esc(img)}">`)
      .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${esc(url.toString())}">`);
    const headers = new Headers(res.headers);
    headers.set('content-type', 'text/html; charset=utf-8');
    headers.set('x-robots-tag', 'noindex, follow');
    headers.set('x-og-agent', ak);
    headers.delete('content-length');
    return new Response(html, { status: res.status, headers });
  } catch (e) {
    return res;
  }
}
