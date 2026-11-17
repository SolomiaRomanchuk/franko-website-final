(() => {
  const sections = [...document.querySelectorAll('.work-section')];
  const progress = document.querySelector('.works-progress');
  const progressFill = progress?.querySelector('span');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loadWorkDescriptions = async () => {
    try {
      const response = await fetch('../data/works.json');
      if (!response.ok) throw new Error(`Could not load works.json (${response.status})`);

      const works = await response.json();
      if (!Array.isArray(works) || works.length !== sections.length || sections.length !== 10) {
        throw new Error('works.json must contain exactly 10 works');
      }

      const worksByNumber = new Map(works.map((work) => [Number(work.number), work]));
      sections.forEach((section) => {
        const number = Number(section.dataset.workNumber);
        const work = worksByNumber.get(number);
        const title = section.querySelector('.work-copy h2');
        const description = section.querySelector('.work-description');
        if (!work || !title || !description || !work.title || !work.description) {
          throw new Error(`Missing title or description for work ${number}`);
        }
      });

      sections.forEach((section) => {
        const work = worksByNumber.get(Number(section.dataset.workNumber));
        section.querySelector('.work-copy h2').textContent = work.title;
        section.querySelector('.work-description').textContent = work.description;
      });
    } catch (error) {
      console.error('Unable to load the work descriptions:', error);
      document.querySelectorAll('.work-description').forEach((description) => {
        description.textContent = 'Не вдалося завантажити опис твору.';
      });
    }
  };

  loadWorkDescriptions();

  const firstWorkLink = document.querySelector('.works-cta');
  firstWorkLink?.addEventListener('click', (event) => {
    const firstWork = document.querySelector('#work-01');
    if (!firstWork) return;
    event.preventDefault();
    firstWork.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });

  if ('IntersectionObserver' in window && !reducedMotion) {
    document.body.classList.add('works-page-has-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.works-reveal').forEach((section) => revealObserver.observe(section));
  }

  if (sections.length && progress && progressFill && 'IntersectionObserver' in window) {
    const workObserver = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      const number = Number(active.target.dataset.workNumber);
      progress.setAttribute('aria-valuenow', String(number));
      progress.setAttribute('aria-label', `Перегляд твору ${String(number).padStart(2, '0')} з 10`);
      progressFill.style.width = `${number * 10}%`;
    }, { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.15, 0.35, 0.6] });
    sections.forEach((section) => workObserver.observe(section));
  }

  const lightbox = document.querySelector('.works-lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const closeButton = lightbox?.querySelector('.works-lightbox-close');
  if (lightbox && lightboxImage && closeButton) {
    document.querySelectorAll('.work-photo-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const image = trigger.querySelector('img');
        if (!image) return;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightbox.showModal();
      });
    });
    closeButton.addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });
  }
})();
