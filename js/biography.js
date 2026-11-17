(() => {
  const progress = document.querySelector('.bio-progress');
  const progressFill = progress?.querySelector('span');
  const lightbox = document.querySelector('.bio-lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const statNumbers = document.querySelectorAll('.bio-stat-number[data-target]');
  const numberFormatter = new Intl.NumberFormat('en-US');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  statNumbers.forEach((element) => {
    const target = Number(element.dataset.target);
    const prefix = element.dataset.prefix || '';
    if (!Number.isFinite(target)) return;

    const showValue = (value) => {
      element.textContent = `${prefix}${numberFormatter.format(value)}`;
    };

    if (reduceMotion || target === 0) {
      showValue(target);
      return;
    }

    const startTime = performance.now();
    const duration = 1500;
    showValue(0);

    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      showValue(Math.round(target * easedProgress));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });

  function updateProgress() {
    if (!progress || !progressFill) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progressFill.style.transform = `scaleX(${amount})`;
    progress.setAttribute('aria-valuenow', String(Math.round(amount * 100)));
  }

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealSections = document.querySelectorAll('.bio-reveal');
    try {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealSections.forEach((section) => revealObserver.observe(section));
      document.body.classList.add('bio-page-has-reveal');
    } catch {
      revealSections.forEach((section) => section.classList.add('is-visible'));
    }
  }

  if (lightbox && lightboxImage && lightboxClose) {
    document.querySelectorAll('.bio-photo-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const image = trigger.querySelector('img');
        if (!image) return;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightbox.showModal();
      });
    });
    lightboxClose.addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });
  }
})();
