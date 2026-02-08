<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Philosophy: Design Argument</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="wrap">
    <div class="title">
      <h1>Philosophy: Design Argument</h1>
      <p class="sub">Click the card to flip. Use search + shuffle.</p>
    </div>

    <div class="controls">
      <input id="search" type="search" placeholder="Search cards…" />
      <button id="shuffleBtn" type="button">Shuffle</button>
      <button id="resetBtn" type="button" class="secondary">Reset</button>
      <a class="secondary" href="flashcards.csv" download>Download CSV</a>
    </div>
  </header>

  <main class="wrap">
    <section class="cardShell" aria-live="polite">
      <button id="card" class="card" type="button" aria-label="Flashcard. Click to flip.">
        <div class="face front">
          <div class="label">Front</div>
          <div id="frontText" class="text">Loading…</div>
        </div>
        <div class="face back">
          <div class="label">Back</div>
          <div id="backText" class="text"></div>
        </div>
      </button>

      <div class="nav">
        <button id="prevBtn" type="button" class="secondary">← Prev</button>
        <div class="status">
          <span id="count">0 / 0</span>
        </div>
        <button id="nextBtn" type="button" class="secondary">Next →</button>
      </div>
    </section>
  </main>

  <script src="script.js"></script>
</body>
</html>
