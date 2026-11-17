/*
 * Події, описи та фотографії завантажуються з data/timeline.json.
 * Шлях до JSON відносний до pages/chronology.html.
 */
(async () => {
  const scroller = document.querySelector("#timeline-scroller");
  const eventsList = document.querySelector("#timeline-events");
  const previousButton = document.querySelector("[data-timeline-prev]");
  const nextButton = document.querySelector("[data-timeline-next]");
  const lightbox = document.querySelector("#timeline-lightbox");
  const lightboxImage = lightbox?.querySelector(".lightbox-image");
  const lightboxYear = lightbox?.querySelector(".lightbox-year");
  const lightboxTitle = lightbox?.querySelector("#lightbox-title");
  const lightboxDescription = lightbox?.querySelector("#lightbox-description");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");
  const lightboxStage = lightbox?.querySelector(".lightbox-stage");
  if (!scroller || !eventsList || !previousButton || !nextButton || !lightbox || !lightboxImage || !lightboxClose || !lightboxStage) return;

  let timelineEvents;
  try {
    const response = await fetch("../data/timeline.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const records = await response.json();
    if (!Array.isArray(records) || records.length !== 25) {
      throw new Error("Очікується 25 записів хронології.");
    }
    timelineEvents = records.map((record) => ({
      id: Number(record.id),
      year: record.date,
      title: record.label,
      description: record.text,
      image: record.image
    }));
    if (timelineEvents.some((event, index) =>
      event.id !== index + 1 || !event.year || typeof event.title !== "string" || !event.title.trim() ||
      typeof event.description !== "string" || !event.description.trim() ||
      typeof event.image !== "string" || !event.image
    )) {
      throw new Error("Записи хронології мають неповні або неправильні поля.");
    }
  } catch (error) {
    console.error("Хронологія: не вдалося завантажити data/timeline.json.", error);
    const message = document.createElement("li");
    message.className = "timeline-load-error";
    message.setAttribute("role", "alert");
    message.textContent = "Не вдалося завантажити дані хронології.";
    eventsList.replaceChildren(message);
    previousButton.disabled = true;
    nextButton.disabled = true;
    return;
  }

  const uniqueIds = new Set();
  const fragment = document.createDocumentFragment();

  timelineEvents.forEach((event, index) => {
    if (uniqueIds.has(event.id)) {
      console.warn(`Хронологія: повторюється id події ${event.id}.`);
      return;
    }
    uniqueIds.add(event.id);

    const item = document.createElement("li");
    item.className = "timeline-event";
    if (index === 0) item.classList.add("is-first");
    if (index === timelineEvents.length - 1) item.classList.add("is-last");

    const photo = document.createElement("button");
    photo.className = "event-photo";
    photo.type = "button";
    photo.setAttribute("aria-label", `Відкрити фотографію: ${event.year}, ${event.title}`);
    photo.setAttribute("aria-haspopup", "dialog");
    photo.setAttribute("aria-pressed", "false");
    const image = document.createElement("img");
    image.src = event.image;
    image.alt = `${event.year} — ${event.title}`;
    image.loading = index < 3 ? "eager" : "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      if (!image.src.endsWith("/event-placeholder.svg")) {
        image.src = "../images/timeline/event-placeholder.svg";
      }
    }, { once: true });
    photo.append(image);

    const copy = document.createElement("div");
    copy.className = "event-copy";
    const year = document.createElement("span");
    year.className = "event-year";
    year.textContent = event.year;
    const title = document.createElement("h2");
    title.textContent = event.title;
    const description = document.createElement("p");
    description.textContent = event.description;
    copy.append(year, title, description);
    item.append(photo, copy);
    item.dataset.eventId = String(event.id);
    fragment.append(item);
  });

  eventsList.append(fragment);

  const syncControls = () => {
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    previousButton.disabled = scroller.scrollLeft <= 2;
    nextButton.disabled = scroller.scrollLeft >= maxScroll - 2;
  };
  const scrollByCard = (direction) => {
    const card = eventsList.querySelector(".timeline-event");
    if (!card) return;
    const styles = window.getComputedStyle(eventsList);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    scroller.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };

  const galleryButtons = [...eventsList.querySelectorAll(".event-photo")];
  let activeTrigger = null;
  let activeAnimation = null;
  let savedScrollY = 0;
  let closeTimer = 0;

  lightboxImage.addEventListener("error", () => {
    if (!lightboxImage.src.endsWith("/event-placeholder.svg")) {
      lightboxImage.src = "../images/timeline/event-placeholder.svg";
    }
  });

  const selectEvent = (event) => {
    eventsList.querySelectorAll(".timeline-event").forEach((card) => {
      const selected = card.dataset.eventId === String(event.id);
      card.classList.toggle("is-selected", selected);
      card.querySelector(".event-photo")?.setAttribute("aria-pressed", String(selected));
    });
  };

  const setBodyScrollLock = () => {
    savedScrollY = window.scrollY;
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add("has-timeline-lightbox");
  };

  const unlockBodyScroll = () => {
    document.body.classList.remove("has-timeline-lightbox");
    document.body.style.top = "";
    window.scrollTo(0, savedScrollY);
  };

  const animateFromThumbnail = (thumbnail) => {
    const finish = () => {
      if (!lightbox.classList.contains("is-open")) return;
      const destination = lightboxImage.getBoundingClientRect();
      const origin = thumbnail.getBoundingClientRect();
      if (!destination.width || !destination.height || !origin.width || !origin.height) return;
      const translateX = origin.left + origin.width / 2 - (destination.left + destination.width / 2);
      const translateY = origin.top + origin.height / 2 - (destination.top + destination.height / 2);
      // Uniform scaling keeps the source image proportions intact during expansion.
      const scale = Math.min(origin.width / destination.width, origin.height / destination.height);
      if (typeof lightboxImage.animate === "function") {
        activeAnimation = lightboxImage.animate([
          { transform: `translate(${translateX}px, ${translateY}px) scale(${scale})` },
          { transform: "translate(0, 0) scale(1, 1)" }
        ], { duration: 420, easing: "cubic-bezier(.22,.8,.25,1)", fill: "both" });
      } else {
        lightboxImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        requestAnimationFrame(() => { lightboxImage.style.transform = "translate(0, 0) scale(1, 1)"; });
      }
    };
    if (lightboxImage.complete && lightboxImage.naturalWidth) finish();
    else lightboxImage.addEventListener("load", finish, { once: true });
  };

  const openLightbox = (event, trigger) => {
    if (lightbox.classList.contains("is-open")) return;
    activeTrigger = trigger;
    selectEvent(event);
    lightboxImage.alt = `${event.year} — ${event.title}`;
    lightboxImage.src = event.image;
    lightboxYear.textContent = event.year;
    lightboxTitle.textContent = event.title;
    lightboxDescription.textContent = event.description;
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    setBodyScrollLock();
    requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
      animateFromThumbnail(trigger);
    });
    lightboxClose.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    if (!lightbox.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    if (activeAnimation?.playState === "running" || activeAnimation?.playState === "finished") {
      try { activeAnimation.reverse(); } catch { /* CSS fade remains as a graceful fallback. */ }
    }
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      lightbox.hidden = true;
      lightboxImage.style.transform = "";
      activeAnimation?.cancel();
      unlockBodyScroll();
      activeTrigger?.focus({ preventScroll: true });
      activeAnimation = null;
    }, 430);
  };

  galleryButtons.forEach((button, index) => {
    button.addEventListener("click", () => openLightbox(timelineEvents[index], button));
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (!event.target.closest(".lightbox-image, .lightbox-close")) closeLightbox();
  });
  lightboxStage.addEventListener("click", (event) => {
    if (event.target === lightboxStage) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "Tab") {
      event.preventDefault();
      lightboxClose.focus();
    }
  });

  syncControls();
  previousButton.addEventListener("click", () => scrollByCard(-1));
  nextButton.addEventListener("click", () => scrollByCard(1));
  scroller.addEventListener("scroll", syncControls, { passive: true });
  window.addEventListener("resize", syncControls, { passive: true });
})();
