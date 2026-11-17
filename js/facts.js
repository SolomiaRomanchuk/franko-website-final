async function initFactsPage() {
  const factsResponse = await fetch('../data/facts.json?v=20261116-1', { cache: 'no-store' });
  if (!factsResponse.ok) throw new Error(`Failed to load facts: ${factsResponse.status}`);
  const facts = await factsResponse.json();

  const STORAGE_KEY = 'ivan-franko-displayed-fact-ids-v2';
  const card = document.querySelector('#fact-card');
  const actionButton = document.querySelector('#fact-action');
  const actionLabel = actionButton?.querySelector('.fact-action-label');
  const statusLabel = card?.querySelector('.fact-card-label');
  const numberLabel = card?.querySelector('.fact-card-number');
  const introState = card?.querySelector('.fact-intro-state');
  const resultText = card?.querySelector('.fact-result');
  const completionState = card?.querySelector('.fact-complete');
  const progressText = document.querySelector('#fact-progress-text');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!card || !actionButton || !actionLabel || !statusLabel || !numberLabel || !introState || !resultText || !completionState || !progressText) return;

  // Ignore invalid or duplicate IDs so edits cannot make a fact repeat or lock the list.
  const uniqueFacts = [];
  const knownIds = new Set();
  facts.forEach((fact) => {
    if (!fact || typeof fact.id !== 'string' || !fact.id.trim() || typeof fact.text !== 'string' || knownIds.has(fact.id)) {
      console.warn('Fact skipped: each entry needs a unique, non-empty string id and text.');
      return;
    }
    knownIds.add(fact.id);
    uniqueFacts.push(fact);
  });

  function readDisplayedIds() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(stored)) return new Set();
      // IDs for removed facts are discarded; newly added IDs remain available automatically.
      return new Set(stored.filter((id) => knownIds.has(id)));
    } catch {
      return new Set();
    }
  }

  let displayedIds = readDisplayedIds();

  function saveDisplayedIds() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...displayedIds]));
    } catch {
      // The current browser session still works if storage is disabled or unavailable.
    }
  }

  function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  let availableFacts = shuffle(uniqueFacts.filter((fact) => !displayedIds.has(fact.id)));
  let currentTone = 0;
  const tones = ['fact-tone-olive', 'fact-tone-blue', 'fact-tone-beige'];

  function updateRemaining() {
    progressText.querySelector('span').textContent = String(availableFacts.length);
    card.querySelector('.fact-card-count').textContent = `${String(availableFacts.length).padStart(2, '0')} ФАКТІВ ЩЕ НЕ ВІДКРИТО`;
  }

  function showComplete({ keepResult = false } = {}) {
    introState.hidden = true;
    completionState.hidden = false;
    if (!keepResult) resultText.hidden = true;
    card.classList.add('is-complete');
    statusLabel.textContent = 'УСІ ФАКТИ ВІДКРИТІ';
    numberLabel.textContent = `${uniqueFacts.length} / ${uniqueFacts.length}`;
    actionLabel.textContent = 'Почати спочатку';
    updateRemaining();
  }

  function restoreIntro() {
    card.classList.remove('is-complete');
    card.classList.remove(...tones);
    card.classList.add(tones[0]);
    introState.hidden = false;
    completionState.hidden = true;
    resultText.hidden = true;
    resultText.textContent = '';
    statusLabel.textContent = 'ВАША НАСТУПНА ЗУПИНКА';
    numberLabel.textContent = '—';
    actionLabel.textContent = 'Здивуй мене';
    updateRemaining();
  }

  function displayFact(fact) {
    introState.hidden = true;
    completionState.hidden = true;
    resultText.hidden = false;
    resultText.textContent = fact.text;
    statusLabel.textContent = 'ЦІКАВИЙ ФАКТ';
    numberLabel.textContent = '';
    card.classList.remove('is-complete', ...tones);
    currentTone = (currentTone + 1) % tones.length;
    card.classList.add(tones[currentTone]);
    actionLabel.textContent = 'Дізнатися ще';

    // Count a fact as displayed only after it has finished revealing.
    displayedIds.add(fact.id);
    saveDisplayedIds();
    if (availableFacts.length === 0) showComplete({ keepResult: true });
    updateRemaining();
  }

  let isAnimating = false;
  async function revealNextFact() {
    if (isAnimating) return;
    if (availableFacts.length === 0) {
      showComplete();
      return;
    }

    isAnimating = true;
    actionButton.disabled = true;
    actionButton.setAttribute('aria-busy', 'true');
    actionLabel.textContent = 'Обираємо факт…';
    card.setAttribute('aria-live', 'off');
    card.setAttribute('aria-busy', 'true');

    const pickedIndex = Math.floor(Math.random() * availableFacts.length);
    const selectedFact = availableFacts.splice(pickedIndex, 1)[0];

    if (!reducedMotion) {
      const shuffleDuration = 1450;
      const stepDuration = 145;
      const steps = Math.floor(shuffleDuration / stepDuration);
      for (let step = 0; step < steps; step += 1) {
        const preview = availableFacts.length ? availableFacts[Math.floor(Math.random() * availableFacts.length)] : selectedFact;
        resultText.hidden = false;
        resultText.textContent = preview.text;
        numberLabel.textContent = '···';
        card.classList.add('is-shuffling');
        await new Promise((resolve) => window.setTimeout(resolve, stepDuration));
        card.classList.remove('is-shuffling');
      }
    }

    displayFact(selectedFact);
    card.setAttribute('aria-live', 'polite');
    card.removeAttribute('aria-busy');
    actionButton.removeAttribute('aria-busy');
    actionButton.disabled = false;
    isAnimating = false;
  }

  function resetCollection() {
    displayedIds = new Set();
    availableFacts = shuffle(uniqueFacts);
    saveDisplayedIds();
    restoreIntro();
    card.focus({ preventScroll: true });
  }

  actionButton.addEventListener('click', () => {
    if (availableFacts.length === 0) resetCollection();
    else revealNextFact();
  });

  if (availableFacts.length === 0) showComplete();
  else updateRemaining();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFactsPage, { once: true });
} else {
  initFactsPage();
}
