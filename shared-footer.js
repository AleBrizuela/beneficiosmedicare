// Shared footer for all Beneficios Medicare pages
// Include this script at the bottom of every page:
//   <script src="/shared-footer.js"></script>
// It will replace the existing <footer> element with the standard footer.

(function() {
  // Detect language from page
  var isEN = document.documentElement.lang === 'en'
    || window.location.pathname.includes('-en.')
    || window.location.pathname.includes('privacy-en');

  // Detect current page for active state
  var path = window.location.pathname;

  // Build footer HTML
  var footer = document.createElement('footer');
  footer.style.cssText = 'background:#002147;padding:20px 24px 16px;text-align:center';

  var inner = '<div style="max-width:960px;margin:0 auto">';
  inner += '<div style="font-family:\'Open Sans\',sans-serif;font-size:18px;color:#B2DFDB;margin-bottom:10px">Susana Marcos LLC</div>';

  // Nav row 1
  inner += '<div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-bottom:6px;font-size:13px">';
  if (isEN) {
    inner += '<a href="/index-en.html" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-home"></i> Home</a>';
    inner += '<a href="/beneficios-en.html" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-heart"></i> Benefits</a>';
    inner += '<a href="/estados/" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-map-marked-alt"></i> States</a>';
    inner += '<a href="/blog/" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-pen"></i> Blog</a>';
    inner += '<a href="/careers.html" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-briefcase"></i> Careers</a>';
  } else {
    inner += '<a href="/" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-home"></i> Inicio</a>';
    inner += '<a href="/beneficios.html" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-heart"></i> Beneficios</a>';
    inner += '<a href="/estados/" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-map-marked-alt"></i> Estados</a>';
    inner += '<a href="/blog/" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-pen"></i> Blog</a>';
    inner += '<a href="/careers.html" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-briefcase"></i> Carreras</a>';
  }
  inner += '</div>';

  // Nav row 2 (contact)
  inner += '<div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-bottom:10px;font-size:13px">';
  if (isEN) {
    inner += '<a href="tel:+13105979142" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-phone-alt"></i> Call</a>';
    inner += '<a href="https://calendar.app.google/6D4obxzxERQXBpaf7" target="_blank" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-video"></i> Schedule Virtual Appointment</a>';
  } else {
    inner += '<a href="tel:+13105979142" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-phone-alt"></i> Llame</a>';
    inner += '<a href="https://calendar.app.google/6D4obxzxERQXBpaf7" target="_blank" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-video"></i> Agende Cita Virtual</a>';
  }
  inner += '<a href="mailto:alejamedicare@gmail.com" style="color:#E8F2FA;text-decoration:none"><i class="fas fa-envelope"></i> Email</a>';
  inner += '<a href="https://wa.me/13105979142" target="_blank" style="color:#E8F2FA;text-decoration:none"><i class="fab fa-whatsapp"></i> WhatsApp</a>';
  inner += '</div>';

  // Privacy link
  if (isEN) {
    inner += '<p style="font-size:12px;margin-bottom:8px"><a href="/privacy-en.html" style="color:rgba(255,255,255,0.5);text-decoration:none"><i class="fas fa-lock" style="font-size:12px"></i> Privacy Policy</a></p>';
  } else {
    inner += '<p style="font-size:12px;margin-bottom:8px"><a href="/privacidad.html" style="color:rgba(255,255,255,0.5);text-decoration:none"><i class="fas fa-lock" style="font-size:12px"></i> Pol\u00edtica de Privacidad</a></p>';
  }

  // Legal disclaimer
  if (isEN) {
    inner += '<p style="font-size:12px;color:rgba(255,255,255,0.3);line-height:1.5;margin:0">We do not offer every plan available in your area. Visit Medicare.gov or call 1-800-Medicare for all options. Site is not part of the federal government or Medicare.</p>';
  } else {
    inner += '<p style="font-size:12px;color:rgba(255,255,255,0.3);line-height:1.5;margin:0">No ofrecemos todos los planes disponibles en su \u00e1rea. Visite Medicare.gov o llame al 1-800-Medicare. Sitio no es parte del gobierno federal ni del programa de Medicare.</p>';
  }

  inner += '</div>';
  footer.innerHTML = inner;

  // Replace existing footer
  var existing = document.querySelector('footer');
  if (existing) {
    existing.parentNode.replaceChild(footer, existing);
  } else {
    document.body.appendChild(footer);
  }
})();
