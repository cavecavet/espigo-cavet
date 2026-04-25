# Web Espigó del Cavet — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page static website to document the photographic evolution of the Espigó del Cavet, organized by zones and subzones, with a before/after slider when ≥2 photos exist for a subzone.

**Architecture:** Single HTML page loads `data.json` via `fetch()`, renders zone tabs and subzone card grids dynamically, and shows a modal detail view (single photo or before/after slider) when a card is clicked. No build step, no dependencies beyond one CDN import.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox, grid), vanilla JS (ES6), img-comparison-slider v8 (CDN), GitHub Pages.

---

## File Map

| File | Status | Responsibility |
|------|--------|----------------|
| `logos/cavecavet.png` | Create | Cave Cavet association logo (download from Drive) |
| `data.json` | Modify | Add `ultima_actualitzacio` field |
| `index.html` | Create | Full app shell: header, tabs, content area, modal, footer |
| `css/style.css` | Create | All visual styles, mobile-first |
| `js/app.js` | Create | Data loading, tab rendering, card rendering, modal logic |

---

### Task 1: Download Cave Cavet logo

**Files:**
- Create: `logos/cavecavet.png`

- [ ] **Step 1: Download logo from Google Drive**

Use the Google Drive MCP tool to download file ID `1-H8VUOBJAKY0YWij71trvRJcfvC9Gcza` (`Logo1Negre.png`) and save it as `logos/cavecavet.png`.

- [ ] **Step 2: Verify**

```bash
ls -lh /Users/juanvi/Documents/GitHub/espigo-cavet/logos/
```
Expected: `cavecavet.png` appears with ~239KB size.

- [ ] **Step 3: Commit**

```bash
cd /Users/juanvi/Documents/GitHub/espigo-cavet
git add logos/cavecavet.png
git commit -m "feat: add Cave Cavet logo"
```

---

### Task 2: Create HTML skeleton

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Espigó del Cavet — Seguiment fotogràfic</title>
  <link rel="stylesheet" href="css/style.css" />
  <script type="module" src="https://unpkg.com/img-comparison-slider@8/dist/index.js"></script>
</head>
<body>

  <header class="site-header">
    <div class="header-inner">
      <img src="logos/cavecavet.png" alt="Cave Cavet" class="logo-main" />
      <div class="header-text">
        <h1>Espigó del Cavet</h1>
        <p class="subtitle">Seguiment fotogràfic de l'evolució</p>
      </div>
    </div>
  </header>

  <nav class="zone-tabs" role="tablist" aria-label="Zones de l'espigó"></nav>

  <main class="zone-content">
    <div class="cards-grid" id="cards-grid"></div>
  </main>

  <div class="modal-overlay" id="modal" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="modal-inner">
      <button class="modal-close" id="modal-close" aria-label="Tancar">✕</button>
      <h2 class="modal-title" id="modal-title"></h2>
      <div class="modal-body" id="modal-body"></div>
      <p class="modal-date" id="modal-date"></p>
    </div>
  </div>

  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-update" id="footer-update"></p>
      <div class="footer-credits">
        <span>Amb el suport de:</span>
        <img src="logos/diputacio.png" alt="Diputació de Tarragona" class="logo-credit" />
        <img src="logos/glups.jpg" alt="Glups Diving" class="logo-credit" />
      </div>
    </div>
  </footer>

  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify HTML loads**

Open `index.html` in a browser (File > Open). Expected: page loads with header area visible, no console errors about missing CSS/JS (those files don't exist yet — 404s are expected at this step).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add HTML skeleton"
```

---

### Task 3: Create CSS styles

**Files:**
- Create: `css/style.css`

- [ ] **Step 1: Create css/style.css**

```css
:root {
  --color-bg: #f4f6f8;
  --color-surface: #ffffff;
  --color-accent: #1e5f9e;
  --color-text: #1a1a2e;
  --color-text-light: #555e6c;
  --color-footer-bg: #1a1a2e;
  --color-footer-text: #c8d0dc;
  --radius: 10px;
  --shadow: 0 2px 12px rgba(0,0,0,0.10);
  --transition: 0.2s ease;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.site-header {
  background: var(--color-surface);
  border-bottom: 1px solid #e2e6ea;
  padding: 1rem 1.25rem;
}

.header-inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-main {
  height: 52px;
  width: auto;
  flex-shrink: 0;
}

.header-text h1 {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.2;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-top: 0.15rem;
}

/* Zone tabs */
.zone-tabs {
  background: var(--color-surface);
  border-bottom: 2px solid #e2e6ea;
  padding: 0 1.25rem;
  display: flex;
  overflow-x: auto;
}

.zone-tab {
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  padding: 0.85rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-light);
  cursor: pointer;
  white-space: nowrap;
  transition: color var(--transition), border-color var(--transition);
}

.zone-tab:hover { color: var(--color-accent); }

.zone-tab.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
  font-weight: 600;
}

/* Cards grid */
.zone-content {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 540px) {
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 800px) {
  .cards-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Subzone card */
.subzone-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition);
}

.subzone-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.14);
}

.card-thumb {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}

.card-thumb-empty {
  width: 100%;
  aspect-ratio: 4/3;
  background: #dde2e8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
  font-size: 0.8rem;
}

.card-info {
  padding: 0.75rem 1rem;
}

.card-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.card-date {
  font-size: 0.78rem;
  color: var(--color-text-light);
}

.card-badge {
  display: inline-block;
  margin-top: 0.4rem;
  font-size: 0.7rem;
  background: var(--color-accent);
  color: white;
  border-radius: 20px;
  padding: 0.1rem 0.55rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition);
}

.modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.modal-inner {
  background: var(--color-surface);
  border-radius: var(--radius);
  max-width: 820px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-text-light);
}

.modal-close:hover { color: var(--color-text); }

.modal-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-right: 2rem;
}

.modal-body img {
  width: 100%;
  border-radius: 6px;
  display: block;
}

.modal-body img-comparison-slider {
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
}

.modal-date {
  margin-top: 0.75rem;
  font-size: 0.82rem;
  color: var(--color-text-light);
  text-align: right;
}

/* Footer */
.site-footer {
  background: var(--color-footer-bg);
  color: var(--color-footer-text);
  padding: 1.5rem 1.25rem;
  margin-top: auto;
}

.footer-inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

@media (min-width: 600px) {
  .footer-inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.footer-update { font-size: 0.8rem; }

.footer-credits {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-credits span { font-size: 0.78rem; }

.logo-credit {
  height: 36px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.85;
}

.no-data {
  color: var(--color-text-light);
  text-align: center;
  padding: 3rem 1rem;
  grid-column: 1 / -1;
  font-size: 0.95rem;
}
```

- [ ] **Step 2: Verify styles**

Refresh `index.html` in the browser. Expected: white header with logo and title visible, light grey page background, no console errors.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add CSS styles"
```

---

### Task 4: Create JavaScript app logic

**Files:**
- Create: `js/app.js`
- Modify: `data.json`

- [ ] **Step 1: Create js/app.js**

```javascript
const MONTHS_CA = [
  'de gener', 'de febrer', 'de març', "d'abril", 'de maig', 'de juny',
  'de juliol', "d'agost", 'de setembre', "d'octubre", 'de novembre', 'de desembre'
];

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${day} ${MONTHS_CA[month - 1]} de ${year}`;
}

function renderTabs(zones, activeId, onSelect) {
  const nav = document.querySelector('.zone-tabs');
  nav.innerHTML = zones.map(z => `
    <button
      class="zone-tab${z.id === activeId ? ' active' : ''}"
      role="tab"
      aria-selected="${z.id === activeId}"
      data-zone="${z.id}"
    >${z.nom}</button>
  `).join('');
  nav.querySelectorAll('.zone-tab').forEach(btn =>
    btn.addEventListener('click', () => onSelect(btn.dataset.zone))
  );
}

function renderCards(subzones) {
  const grid = document.getElementById('cards-grid');
  if (!subzones.length) {
    grid.innerHTML = '<p class="no-data">Encara no hi ha subzones definides per a aquesta zona.</p>';
    return;
  }
  grid.innerHTML = subzones.map(sz => {
    const last = sz.fotos.at(-1) ?? null;
    const thumbHtml = last
      ? `<img class="card-thumb" src="${last.fitxer}" alt="${sz.nom}" loading="lazy" />`
      : `<div class="card-thumb-empty">Sense fotos</div>`;
    const dateHtml = last ? `<span class="card-date">${formatDate(last.data)}</span>` : '';
    const badgeHtml = sz.fotos.length >= 2
      ? `<span class="card-badge">Comparació disponible</span>`
      : '';
    return `
      <article class="subzone-card" data-id="${sz.id}" tabindex="0" role="button" aria-label="${sz.nom}">
        ${thumbHtml}
        <div class="card-info">
          <p class="card-name">${sz.nom}</p>
          ${dateHtml}
          ${badgeHtml}
        </div>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('.subzone-card').forEach(card => {
    const handler = () => openModal(subzones.find(sz => sz.id === card.dataset.id));
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
  });
}

function openModal(subzone) {
  const modal = document.getElementById('modal');
  document.getElementById('modal-title').textContent = subzone.nom;
  const body = document.getElementById('modal-body');
  const dateEl = document.getElementById('modal-date');

  if (subzone.fotos.length === 0) {
    body.innerHTML = '<p>Sense fotos disponibles.</p>';
    dateEl.textContent = '';
  } else if (subzone.fotos.length === 1) {
    const foto = subzone.fotos[0];
    body.innerHTML = `<img src="${foto.fitxer}" alt="${foto.peu || subzone.nom}" />`;
    dateEl.textContent = formatDate(foto.data);
  } else {
    const first = subzone.fotos[0];
    const last = subzone.fotos.at(-1);
    body.innerHTML = `
      <img-comparison-slider>
        <img slot="first" src="${first.fitxer}" alt="${formatDate(first.data)}" />
        <img slot="second" src="${last.fitxer}" alt="${formatDate(last.data)}" />
      </img-comparison-slider>
    `;
    dateEl.textContent = `${formatDate(first.data)} → ${formatDate(last.data)}`;
  }

  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.remove('open');
}

async function init() {
  const data = await fetch('data.json').then(r => r.json());
  let activeZone = data.zones[0].id;

  function selectZone(zoneId) {
    activeZone = zoneId;
    renderTabs(data.zones, activeZone, selectZone);
    const zone = data.zones.find(z => z.id === zoneId);
    renderCards(zone.subzones);
  }

  selectZone(activeZone);

  if (data.ultima_actualitzacio) {
    document.getElementById('footer-update').textContent =
      `Darrera actualització: ${formatDate(data.ultima_actualitzacio)}`;
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

init();
```

- [ ] **Step 2: Add `ultima_actualitzacio` to data.json**

Replace the contents of `data.json` with:

```json
{
  "ultima_actualitzacio": "2026-04-25",
  "zones": [
    {
      "id": "talus-est",
      "nom": "Talús est",
      "subzones": [
        {
          "id": "te-1",
          "nom": "Talús est — sector 1",
          "fotos": [
            {
              "data": "2026-04-01",
              "fitxer": "fotos/talus-est/te-1/2026-04-01.jpg",
              "peu": "Estat inicial"
            }
          ]
        }
      ]
    },
    {
      "id": "cap",
      "nom": "Cap de l'espigó",
      "subzones": []
    },
    {
      "id": "talus-oest",
      "nom": "Talús oest",
      "subzones": []
    }
  ]
}
```

- [ ] **Step 3: Verify in browser with local server**

Start local server (required — `fetch()` does not work with `file://`):
```bash
cd /Users/juanvi/Documents/GitHub/espigo-cavet
python3 -m http.server 8080
```
Open http://localhost:8080 in browser.

Check each of the following:
- Header shows Cave Cavet logo + title "Espigó del Cavet"
- 3 zone tabs visible: "Talús est", "Cap de l'espigó", "Talús oest"
- "Talús est" tab is active by default, shows 1 card "Talús est — sector 1"
- Clicking "Cap de l'espigó" tab shows "Encara no hi ha subzones" message
- Clicking the Talús est card opens a modal with the photo
- Modal closes with ✕ button
- Modal closes clicking outside it
- Modal closes pressing Escape
- Footer shows "Darrera actualització: 1 d'abril de 2026" (from ultima_actualitzacio)

- [ ] **Step 4: Commit**

```bash
git add js/app.js data.json
git commit -m "feat: add JS app logic and complete data structure"
```

---

### Task 5: Final review and push

**Files:** none

- [ ] **Step 1: Verify all required files are present**

```bash
ls /Users/juanvi/Documents/GitHub/espigo-cavet/
```
Expected output includes: `CNAME`, `data.json`, `index.html`, `css/`, `js/`, `fotos/`, `logos/`

```bash
ls /Users/juanvi/Documents/GitHub/espigo-cavet/logos/
```
Expected: `cavecavet.png`, `diputacio.png`, `glups.jpg`

- [ ] **Step 2: Check CNAME**

```bash
cat /Users/juanvi/Documents/GitHub/espigo-cavet/CNAME
```
Expected: `espigo.cavecavet.org`

- [ ] **Step 3: Full visual review at http://localhost:8080**

Verify:
- Desktop: 3-column card grid
- Mobile (DevTools > toggle device toolbar, 390px width): 1-column grid
- Logo in header visible and correctly sized
- Footer logos appear white (inverted) on dark background
- No JavaScript errors in DevTools console

- [ ] **Step 4: Push to GitHub**

```bash
cd /Users/juanvi/Documents/GitHub/espigo-cavet
git log --oneline
git push
```

---

## Self-Review

**Spec coverage:**
- ✅ Galeria per zones (tabs) + subzones (cards grid)
- ✅ Slider comparació quan hi ha ≥2 fotos d'una subzona
- ✅ HTML/CSS/JS pur, dades en `data.json`
- ✅ Logo Cave Cavet a la capçalera
- ✅ Crèdits Diputació de Tarragona + Glups Diving al peu
- ✅ Mobile-first responsive
- ✅ Idioma: català (tabs, missatges, dates)
- ✅ img-comparison-slider via CDN
- ✅ Peu de pàgina amb data d'última actualització

**Placeholder scan:** Cap TBD, TODO ni "similar to task N" detectat. Tot el codi és complet.

**Type consistency:** `subzone.fotos`, `subzone.id`, `subzone.nom`, `foto.fitxer`, `foto.data`, `foto.peu` usats de forma consistent entre `data.json`, `renderCards()` i `openModal()`.
