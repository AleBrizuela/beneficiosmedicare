/* T-105 · the link preview of a shared comparison, per link (AB 2026-10-18).
 *
 * WhatsApp, iMessage, Facebook and Gmail do not run JavaScript: the preview is whatever HTML the server
 * hands their crawler. /opciones-compartidas is one static file for every link, so on its own every preview
 * reads the same. For a link-preview crawler only, this serves that same file with its og/twitter tags
 * rewritten from the link: the agent for the ZIP's state (T-102: Susana for KS, MO, TX, FL; Alejandra for
 * everything else), her card image (1200x630, og-opciones-<agent>-<lang>.jpg), and a title that says the
 * comparison itself ("3 opciones de Medicare 2027 en Douglas, KS: Devoted Choice 001 ...").
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
const toFileId = raw => { const m = String(raw).split('-'); return m[0] + '_' + (m[1] || '') + '_' + (m[2] || '0'); };
// the display rules the widget uses for a name: no trailing "(HMO)"-type bracket, no trailing "Plan",
// capitals set in proper case (a short version of properName: enough for a preview title)
function shortName(n) {
  let s = String(n || '').replace(/\s*\([^()]*\)\s*$/, '').replace(/\s+Plan\s*$/i, '').trim();
  if (/[A-Z]/.test(s) && s === s.toUpperCase()) {
    const UP = /^(HMO|PPO|POS|SNP|D-SNP|C-SNP|I-SNP|PDP|MA|MAPD|QMB|AARP|SCAN|[A-Z]{2}|I{1,3}|IV|V|VI{0,3}|IX|X)$/;
    s = s.split(/\s+/).map((w, i) => (UP.test(w) && (w.length !== 2 || i > 0)) ? w : w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  }
  return s;
}
// '"<key>":"<value>"' found by plain search
function pick(text, key) {
  const k = '"' + key + '":"', i = text.indexOf(k);
  if (i < 0) return '';
  const j = text.indexOf('"', i + k.length);
  return j < 0 ? '' : text.slice(i + k.length, j);
}
function planName(text, fileId) {
  const k = '"id":"' + fileId + '"';
  let i = text.indexOf(k);
  if (i < 0) return '';
  // the name sits in the same object; look a short way either side of the id
  const win = text.slice(Math.max(0, i - 600), i + 600);
  const m = win.match(/"name":"((?:[^"\\]|\\.)*)"/g);
  if (!m) return '';
  // the closest "name" to the id
  const off = i - Math.max(0, i - 600);
  let best = '', bd = 1e9;
  for (const x of m) { const p = win.indexOf(x); const d = Math.abs(p - off); if (d < bd) { bd = d; best = x; } }
  try { return JSON.parse(best.slice(7)); } catch (e) { return ''; }
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
    if (!/^\d{5}$/.test(zip) || !ids.length) return res;
    const en = url.searchParams.get('lang') === 'en';

    const zi = await env.ASSETS.fetch(new URL('/data/zip_index.js', url.origin));
    const st = zi.ok ? pick(await zi.text(), zip) : '';
    if (!/^[A-Z]{2}$/.test(st)) return res;
    const ak = SUSANA[st] ? 'susana' : 'alejandra', A = AGENTS[ak];

    let county = '', names = [];
    const pf = await env.ASSETS.fetch(new URL('/data/plans_' + st + '_2027.json', url.origin));
    if (pf.ok) {
      const t = await pf.text();
      county = pick(t, zip);
      names = ids.map(r => planName(t, toFileId(r))).filter(Boolean).map(shortName);
    }
    const n = ids.length;
    const where = (county ? county + ', ' : '') + st;
    // T-105 (9): "Compartir lo que cambia" tags its link ?chg=1 so the preview says what it is,
    // not "N options" -- the page and image are otherwise the same single-plan share.
    const chg = url.searchParams.get('chg') === '1';
    const title = chg
      ? (en ? 'What changes in your plan in 2027' : 'Lo que cambia en su plan en 2027')
      : en
      ? `${n} Medicare option${n === 1 ? '' : 's'} for 2027 in ${where}` + (names.length ? `: ${names.join(', ')}` : '')
      : `${n} ${n === 1 ? 'opción' : 'opciones'} de Medicare 2027 en ${where}` + (names.length ? `: ${names.join(', ')}` : '');
    // never "free" / "licensed" in a preview (the T-090 og rule site-check.py enforces on static pages)
    const desc = en
      ? `Side by side, with the CMS costs. Questions? ${A.name}, ${A.tel}.`
      : `Lado a lado, con los costos de CMS. ¿Preguntas? ${A.name}, ${A.tel}.`;
    const img = `${url.origin}/og-opciones-${ak}-${en ? 'en' : 'es'}.jpg`;
    const alt = en ? `${A.name}, ${A.tel}, BeneficiosMedicare.com` : `${A.name}, ${A.tel}, BeneficiosMedicare.com`;

    const html = (await res.text())
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)} | Beneficios Medicare</title>`)
      .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`)
      .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`)
      .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${esc(img)}">`)
      .replace(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="${esc(alt)}">`)
      .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`)
      .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(desc)}">`)
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
