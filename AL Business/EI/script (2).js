// CSV-backed flashcards (Front,Back)
let allCards = [];
let viewCards = [];
let idx = 0;

const els = {
  card: document.getElementById('card'),
  front: document.getElementById('frontText'),
  back: document.getElementById('backText'),
  count: document.getElementById('count'),
  mode: document.getElementById('mode'),
  prev: document.getElementById('prevBtn'),
  next: document.getElementById('nextBtn'),
  shuffle: document.getElementById('shuffleBtn'),
  reset: document.getElementById('resetBtn'),
  search: document.getElementById('search'),
};

function parseCSV(text){
  // Simple CSV parser with quoted fields; expects headers Front,Back
  const rows = [];
  let i = 0, field = '', row = [], inQuotes = false;

  while (i < text.length){
    const c = text[i];

    if (inQuotes){
      if (c === '"' && text[i+1] === '"'){ field += '"'; i += 2; continue; }
      if (c === '"'){ inQuotes = false; i++; continue; }
      field += c; i++; continue;
    } else {
      if (c === '"'){ inQuotes = true; i++; continue; }
      if (c === ','){ row.push(field); field = ''; i++; continue; }
      if (c === '\n'){
        row.push(field); field = '';
        if (row.some(x => x.trim().length)) rows.push(row);
        row = []; i++; continue;
      }
      if (c === '\r'){ i++; continue; }
      field += c; i++; continue;
    }
  }
  row.push(field);
  if (row.some(x => x.trim().length)) rows.push(row);

  if (!rows.length) return [];

  const headers = rows[0].map(h => (h || '').trim().toLowerCase());
  const frontIdx = headers.indexOf('front');
  const backIdx  = headers.indexOf('back');

  const out = [];
  for (const r of rows.slice(1)){
    const front = (r[frontIdx] ?? '').trim();
    const back  = (r[backIdx] ?? '').trim();
    if (front || back) out.push({front, back});
  }
  return out;
}

function setModeLabel(){
  els.mode.textContent = (viewCards.length === allCards.length)
    ? 'All cards'
    : `Filtered (${viewCards.length})`;
}

function render(){
  if (!viewCards.length){
    els.front.textContent = 'No cards match your search.';
    els.back.textContent = '';
    els.count.textContent = '0 / 0';
    setModeLabel();
    els.card.classList.remove('is-flipped');
    return;
  }
  idx = ((idx % viewCards.length) + viewCards.length) % viewCards.length;
  const c = viewCards[idx];
  els.front.textContent = c.front || '(no front text)';
  els.back.textContent = c.back || '(no back text)';
  els.count.textContent = `${idx + 1} / ${viewCards.length}`;
  setModeLabel();
}

function flip(){ els.card.classList.toggle('is-flipped'); }
function next(){ els.card.classList.remove('is-flipped'); idx++; render(); }
function prev(){ els.card.classList.remove('is-flipped'); idx--; render(); }

function shuffleInPlace(arr){
  for (let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function applySearch(q){
  const s = (q || '').trim().toLowerCase();
  if (!s){
    viewCards = [...allCards];
    idx = 0;
    render();
    return;
  }
  viewCards = allCards.filter(c =>
    c.front.toLowerCase().includes(s) || c.back.toLowerCase().includes(s)
  );
  idx = 0;
  render();
}

async function init(){
  try{
    const res = await fetch('flashcards.csv', {cache:'no-store'});
    const text = await res.text();
    allCards = parseCSV(text);
    viewCards = [...allCards];
    idx = 0;
    render();
  } catch (e){
    els.front.textContent = 'Could not load flashcards.csv';
    els.back.textContent = String(e);
  }
}

els.card.addEventListener('click', flip);
els.next.addEventListener('click', next);
els.prev.addEventListener('click', prev);
els.shuffle.addEventListener('click', () => { shuffleInPlace(viewCards); idx = 0; render(); });
els.reset.addEventListener('click', () => { els.search.value=''; viewCards=[...allCards]; idx=0; render(); });
els.search.addEventListener('input', (e) => applySearch(e.target.value));

window.addEventListener('keydown', (e) => {
  if (e.key === ' '){ e.preventDefault(); flip(); }
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

init();
