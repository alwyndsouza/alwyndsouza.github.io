// main.js — Alwyn Dsouza personal site

// Highlight the active nav link based on current page
(function () {
  const links = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');

  links.forEach(function (link) {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/index\.html$/, '/');
    if (currentPath === linkPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
