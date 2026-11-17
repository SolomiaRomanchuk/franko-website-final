(() => {
  const layout = document.querySelector(".quote-layout");
  const textElement = document.querySelector("#quote-text");
  const sourceElement = document.querySelector("#quote-source");
  const counterElement = document.querySelector("#quote-counter");
  const nextButton = document.querySelector("#next-quote");
  const quoteDisplay = document.querySelector("#quote-display");
  if (!layout || !textElement || !sourceElement || !counterElement || !nextButton || !quoteDisplay) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shuffleDuration = 1450;
  const stepDuration = 145;

  function trimBlankLines(lines) {
    let first = 0;
    let last = lines.length;
    while (first < last && !lines[first].trim()) first += 1;
    while (last > first && !lines[last - 1].trim()) last -= 1;
    return lines.slice(first, last).join("\n");
  }

  function parseQuotes(fileText) {
    const blocks = fileText.replace(/\r\n?/g, "\n").split(/^[\t ]*---[\t ]*$/m);
    const quotes = [];

    blocks.forEach((block, blockIndex) => {
      if (!block.trim()) return;

      let field = "";
      let quoteFound = false;
      let sourceFound = false;
      const quoteLines = [];
      const sourceLines = [];

      for (const line of block.split("\n")) {
        if (line.startsWith("Цитата:")) {
          if (quoteFound || sourceFound) {
            throw new Error(`Некоректний формат цитати ${blockIndex + 1}: повторне поле «Цитата:».`);
          }
          quoteFound = true;
          field = "quote";
          quoteLines.push(line.slice("Цитата:".length).replace(/^[\t ]/, ""));
        } else if (line.startsWith("Твір:")) {
          if (!quoteFound || sourceFound) {
            throw new Error(`Некоректний формат цитати ${blockIndex + 1}: джерело не відповідає цитаті.`);
          }
          sourceFound = true;
          field = "source";
          sourceLines.push(line.slice("Твір:".length).replace(/^[\t ]/, ""));
        } else if (field === "quote") {
          quoteLines.push(line);
        } else if (field === "source") {
          sourceLines.push(line);
        } else if (line.trim()) {
          throw new Error(`Некоректний формат запису ${blockIndex + 1}: відсутнє поле «Цитата:».`);
        }
      }

      const text = trimBlankLines(quoteLines);
      const source = trimBlankLines(sourceLines);
      if (!quoteFound || !sourceFound || !text || !source) {
        throw new Error(`Запис ${blockIndex + 1} не містить цитати або джерела.`);
      }
      quotes.push({ text, source });
    });

    return quotes;
  }

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function showLoadError(message) {
    textElement.textContent = message;
    sourceElement.textContent = "";
    counterElement.textContent = "";
    nextButton.disabled = true;
    layout.classList.add("is-unavailable");
  }

  function renderQuote(quote, index, total) {
    textElement.textContent = quote.text;
    sourceElement.textContent = quote.source;
    counterElement.textContent = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  }

  async function init() {
    let fileText;
    try {
      const response = await fetch("../data/quotes.txt", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      fileText = await response.text();
    } catch (error) {
      console.error("Could not load data/quotes.txt", error);
      showLoadError("Не вдалося завантажити цитати. Перевірте файл data/quotes.txt.");
      return;
    }

    let quotes;
    try {
      quotes = parseQuotes(fileText);
    } catch (error) {
      console.error("Could not parse data/quotes.txt", error);
      showLoadError("Не вдалося прочитати цитати. Перевірте формат файлу data/quotes.txt.");
      return;
    }

    if (!quotes.length) {
      showLoadError("У файлі поки немає коректних цитат.");
      return;
    }

    let currentIndex = Math.floor(Math.random() * quotes.length);
    let selectionCycle = [];
    let isAnimating = false;

    function refillSelectionCycle() {
      selectionCycle = shuffle(quotes.map((_, index) => index).filter((index) => index !== currentIndex));
    }

    renderQuote(quotes[currentIndex], currentIndex, quotes.length);
    refillSelectionCycle();
    nextButton.disabled = false;

    nextButton.addEventListener("click", async () => {
      if (isAnimating) return;
      if (!selectionCycle.length) refillSelectionCycle();

      const selectedIndex = selectionCycle.pop();
      const selectedQuote = quotes[selectedIndex];
      isAnimating = true;
      nextButton.disabled = true;
      nextButton.setAttribute("aria-busy", "true");
      layout.setAttribute("aria-live", "off");
      layout.setAttribute("aria-busy", "true");

      try {
        if (!reducedMotion) {
          const steps = Math.floor(shuffleDuration / stepDuration);
          const previews = shuffle(quotes
            .map((_, index) => index)
            .filter((index) => index !== currentIndex && index !== selectedIndex));

          for (let step = 0; step < steps; step += 1) {
            const previewIndex = previews[step % previews.length] ?? selectedIndex;
            renderQuote(quotes[previewIndex], previewIndex, quotes.length);
            counterElement.textContent = "···";
            quoteDisplay.classList.remove("is-shuffling-step");
            // Force a fresh short content animation for each rapid preview.
            void quoteDisplay.offsetWidth;
            quoteDisplay.classList.add("is-shuffling-step");
            await new Promise((resolve) => window.setTimeout(resolve, stepDuration));
          }
        }

        currentIndex = selectedIndex;
        renderQuote(selectedQuote, selectedIndex, quotes.length);
      } finally {
        quoteDisplay.classList.remove("is-shuffling-step");
        layout.setAttribute("aria-live", "polite");
        layout.removeAttribute("aria-busy");
        nextButton.removeAttribute("aria-busy");
        nextButton.disabled = false;
        isAnimating = false;
      }
    });
  }

  init();
})();
