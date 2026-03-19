// Shared header for all Beneficios Medicare pages
// Include: <script src="/shared-header.js"></script>
// Place AFTER the existing header in the HTML (it replaces it)
// Also replaces the disclaimer bar and mobile nav

(function() {
  var isEN = document.documentElement.lang === 'en'
    || window.location.pathname.includes('-en.')
    || window.location.pathname.includes('privacy-en');

  var path = window.location.pathname;

  // Determine active page
  function isActive(page) {
    if (page === 'home') return path === '/' || path.endsWith('index.html') || path.endsWith('index-en.html');
    if (page === 'beneficios') return path.includes('beneficio');
    if (page === 'blog') return path.includes('blog');
    if (page === 'contacto') return path.includes('contact') || path.includes('contacto');
    if (page === 'estados') return path.includes('estado') || path.includes('california');
    if (page === 'careers') return path.includes('career');
    return false;
  }

  function cls(page) { return isActive(page) ? ' class="active"' : ''; }

  // Build disclaimer
  var disc = document.createElement('div');
  disc.id = 'cms-disclaimer';
  disc.style.cssText = 'background:#fff;color:#9CA3AF;text-align:center;padding:4px 16px;font-size:12px;line-height:1.4;font-weight:400;position:relative;z-index:1100';
  disc.textContent = isEN
    ? 'This site is not part of the federal government or the Medicare program. For official information visit Medicare.gov or call 1-800-Medicare.'
    : 'Sitio no es parte del gobierno federal ni del programa de Medicare. Para informaci\u00f3n oficial visite Medicare.gov o llame al 1-800-Medicare.';

  // Build header
  var header = document.createElement('header');
  header.className = 'header';
  header.id = 'header';

  var homeLink = isEN ? '/index-en.html' : '/';
  var beneLink = isEN ? '/beneficios-en.html' : '/beneficios.html';
  var contLink = isEN ? '/contacto-en.html' : '/contacto.html';
  var langES = isEN ? 'onclick="window.location.href=\'' + path.replace('-en.html', '.html').replace('-en/', '/') + '\'"' : '';
  var langEN = isEN ? '' : 'onclick="window.location.href=\'' + path.replace('.html', '-en.html') + '\'"';

  // For pages without EN counterparts (blog, estados, careers), toggle goes to homepage
  if (path.includes('blog') || path.includes('estado') || path.includes('career') || path.includes('privacidad')) {
    langEN = 'onclick="window.location.href=\'/index-en.html\'"';
    langES = '';
  }
  if (path.includes('-en.') || path.includes('privacy-en')) {
    langES = 'onclick="window.location.href=\'/\'"';
    langEN = '';
  }

  var esActive = isEN ? '' : 'lp-active';
  var enActive = isEN ? 'lp-active' : '';

  var navLinks = isEN
    ? '<a href="' + homeLink + '"' + cls('home') + '>Home</a>'
      + '<a href="' + beneLink + '"' + cls('beneficios') + '>Benefits</a>'
      + '<a href="' + contLink + '"' + cls('contacto') + '>Contact</a>'
    : '<a href="' + homeLink + '"' + cls('home') + '>Inicio</a>'
      + '<a href="' + beneLink + '"' + cls('beneficios') + '>Beneficios</a>'
      + '<a href="' + contLink + '"' + cls('contacto') + '>Cont\u00e1ctenos</a>';

  var langPill = '<div class="lang-pill">'
    + '<button class="' + esActive + '" ' + langES + ' aria-label="Espa\u00f1ol">ES</button>'
    + '<button class="' + enActive + '" ' + langEN + ' aria-label="English">EN</button>'
    + '</div>';

  header.innerHTML = '<div class="header-inner">'
    + '<a href="' + homeLink + '" class="logo">'
    + '<svg class="logo-full" viewBox="0 0 380 48" width="285" height="36" xmlns="http://www.w3.org/2000/svg">'
    + '<defs><linearGradient id="navShieldGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#00897B"/><stop offset="100%" style="stop-color:#00796B"/></linearGradient></defs>'
    + '<path d="M23 2 L43 10 L43 26 C43 37 35 43 23 49 C11 43 3 37 3 26 L3 10 Z" fill="url(#navShieldGrad)"/>'
    + '<polyline points="14,27 20,33 33,19" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<text y="34" font-family="\'Open Sans\',\'Segoe UI\',\'Helvetica Neue\',Arial,sans-serif"><tspan x="54" font-size="26" font-weight="700" fill="#1a1a1a">Beneficios</tspan><tspan dx="6" font-size="26" font-weight="600" fill="#26A69A">Medicare</tspan></text>'
    + '</svg></a>'
    + '<nav id="desktop-nav">' + navLinks + langPill + '</nav>'
    + '<button class="mobile-menu-btn" onclick="document.getElementById(\'mobile-nav\').classList.toggle(\'open\')" aria-label="Menu"><i class="fas fa-bars"></i></button>'
    + '</div>';

  // Build mobile nav
  var mobileNav = document.createElement('div');
  mobileNav.className = 'mobile-nav';
  mobileNav.id = 'mobile-nav';
  mobileNav.innerHTML = navLinks + langPill;

  // Inject: replace existing disclaimer, header, mobile-nav
  var existingDisc = document.getElementById('cms-disclaimer') || document.querySelector('.disc');
  var existingHeader = document.querySelector('header') || document.querySelector('.header');
  var existingMobile = document.getElementById('mobile-nav');

  if (existingDisc) existingDisc.parentNode.replaceChild(disc, existingDisc);
  else document.body.insertBefore(disc, document.body.firstChild);

  if (existingHeader) existingHeader.parentNode.replaceChild(header, existingHeader);
  else disc.parentNode.insertBefore(header, disc.nextSibling);

  if (existingMobile) existingMobile.parentNode.replaceChild(mobileNav, existingMobile);
  else header.parentNode.insertBefore(mobileNav, header.nextSibling);

  // Scroll behavior: hide disclaimer on scroll, show header shadow
  function onScroll() {
    if (window.scrollY > 60) {
      disc.style.transform = 'translateY(-100%)';
      disc.style.transition = 'transform 0.25s ease';
      header.classList.add('disclaimer-gone');
    } else {
      disc.style.transform = 'translateY(0)';
      header.classList.remove('disclaimer-gone');
    }
    header.classList.toggle('scrolled', window.scrollY > 0);
  }
  window.addEventListener('scroll', onScroll, {passive: true});

  // Set header top position based on disclaimer height
  function setTop() {
    header.style.top = disc.offsetHeight + 'px';
  }
  setTop();
  window.addEventListener('resize', setTop);
  onScroll();
})();
