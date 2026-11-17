(() => {
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('#site-menu');
  const backdrop = document.querySelector('.menu-backdrop');
  const closeButton = document.querySelector('.menu-close');

  if (!toggle || !drawer || !backdrop || !closeButton) return;

  const links = [...drawer.querySelectorAll('a')];
  // The legacy timeline page remains available, while the shared menu opens
  // the new standalone chronology page from either the root or pages folder.
  const timelineLink = links.find((link) => /(?:^|\/)timeline\.html(?:$|[?#])/.test(link.getAttribute('href') || ''));
  if (timelineLink) {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const isPagesDirectory = pathSegments[pathSegments.length - 2] === 'pages';
    timelineLink.href = isPagesDirectory ? 'chronology.html' : 'pages/chronology.html';
  }
  let closeTimer;

  function openMenu() {
    window.clearTimeout(closeTimer);
    drawer.inert = false;
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрити меню');
    requestAnimationFrame(() => {
      backdrop.classList.add('is-open');
      drawer.classList.add('is-open');
    });
    closeButton.focus();
  }

  function closeMenu({ restoreFocus = true } = {}) {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Відкрити меню');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;
    closeTimer = window.setTimeout(() => {
      if (!drawer.classList.contains('is-open')) backdrop.hidden = true;
    }, 390);
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });

  closeButton.addEventListener('click', () => closeMenu());
  backdrop.addEventListener('click', () => closeMenu());
  links.forEach((link) => link.addEventListener('click', () => closeMenu({ restoreFocus: false })));

  document.addEventListener('keydown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = [closeButton, ...links];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
