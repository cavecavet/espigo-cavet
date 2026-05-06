# Espigó del Cavet — Pla d'implementació

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Web estàtica per seguir l'evolució fotogràfica de l'Espigó del Cavet, amb galeria per zones i slider de comparació abans/després.

**Architecture:** Pàgina única HTML/CSS/JS pur. `app.js` carrega `data.json` via `fetch()` i renderitza dinàmicament zones, subzones i sliders. Sense framework ni pas de compilació.

**Tech Stack:** HTML5, CSS3, Vanilla JS (ES2020), [img-comparison-slider v8](https://img-comparison-slider.sneas.io/) via CDN, GitHub Pages.

---

## Mapa de fitxers

| Fitxer | Responsabilitat |
|---|---|
| `index.html` | Estructura HTML, capçalera, peu, contenidors buits |
| `style.css` | Tots els estils: layout, colors marins, responsive, slider |
| `app.js` | Lògica JS: carrega dades, renderitza zones/subzones/slider/selectores |
| `data.json` | Dades de zones, subzones i fotos (única font de veritat) |
| `CNAME` | Domini personalitzat per GitHub Pages |
| `logos/diputacio.png` | Logo Diputació de Tarragona (copiat del Drive) |
| `logos/glups.jpg` | Logo Glups Diving (copiat del Drive) |
| `fotos/<zona>/<subzona>/` | Imatges en format `YYYY-MM-DD.jpg` |

---

## Task 1: Estructura del projecte

**Files:**
- Create: `CNAME`
- Create: `data.json`
- Create: `logos/` (directori)
- Create: `fotos/talus-est/`, `fotos/cap/`, `fotos/talus-oest/`

- [ ] **Pas 1.1: Inicialitzar directoris i git**

```bash
cd /Users/juanvi/Documents/GitHub/espigo-cavet
git init
mkdir -p logos fotos/talus-est fotos/cap fotos/talus-oest
```

- [ ] **Pas 1.2: Crear el fitxer CNAME**

Crear `CNAME` amb el contingut:
```
espigo.cavecavet.org
```

- [ ] **Pas 1.3: Copiar els logos des del Drive**

```bash
cp "/Users/juanvi/associaciocavecavet@gmail.com - Google Drive/Mi unidad/Logos/LogosAltresEntitats/DIPTA_H_col.png" logos/diputacio.png
cp "/Users/juanvi/associaciocavecavet@gmail.com - Google Drive/Mi unidad/Logos/LogosAltresEntitats/LogoGlups.jpg" logos/glups.jpg
```

- [ ] **Pas 1.4: Crear `data.json` amb estructura de mostra**

Crear `data.json`:
```json
{
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

> Les subzones reals es definiran en el Task 6 a partir de les fotos existents.

- [ ] **Pas 1.5: Verificar estructura**

```bash
find /Users/juanvi/Documents/GitHub/espigo-cavet -not -path '*/.git/*' | sort
```

Resultat esperat: directoris `logos/`, `fotos/talus-est/`, `fotos/cap/`, `fotos/talus-oest/`, fitxers `CNAME` i `data.json`.

---

## Task 2: HTML base (`index.html`)

**Files:**
- Create: `index.html`

- [ ] **Pas 2.1: Crear `index.html`**

```html
<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evolució de l'Espigó del Cavet</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/img-comparison-slider@8/dist/styles.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <div class="header-text">
      <h1>Evolució de l'Espigó del Cavet</h1>
      <p class="subtitol">Seguiment fotogràfic de l'estat de l'espigó</p>
    </div>
    <div class="logos">
      <img src="logos/diputacio.png" alt="Diputació de Tarragona">
      <img src="logos/glups.jpg" alt="Glups Diving">
    </div>
  </header>

  <main>
    <nav id="selector-zona" class="selector-zona"></nav>
    <section id="contingut"></section>
  </main>

  <footer>
    <p>Amb el suport de: <strong>Diputació de Tarragona</strong></p>
    <p>Col·laborador: <strong>Glups Diving</strong></p>
    <p>Projecte de l'<a href="https://cavecavet.org">Associació Cave Cavet</a></p>
  </footer>

  <script defer src="https://cdn.jsdelivr.net/npm/img-comparison-slider@8/dist/index.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Pas 2.2: Verificar al navegador**

```bash
cd /Users/juanvi/Documents/GitHub/espigo-cavet && python3 -m http.server 8000
```

Obrir `http://localhost:8000`. Ha de mostrar la capçalera amb títol i logos (sense estils encara). Aturar el servidor amb Ctrl+C.

---

## Task 3: Estils (`style.css`)

**Files:**
- Create: `style.css`

- [ ] **Pas 3.1: Crear `style.css`**

```css
:root {
  --blau-fosc: #1a3a5c;
  --blau-mig: #2e6da4;
  --blau-clar: #d6e8f7;
  --gris: #6c757d;
  --gris-clar: #f0f4f8;
  --blanc: #ffffff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #222;
  background: var(--gris-clar);
  line-height: 1.5;
}

header {
  background: var(--blau-fosc);
  color: var(--blanc);
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

header h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.subtitol {
  font-size: 0.95rem;
  color: var(--blau-clar);
  margin-top: 0.25rem;
}

.logos {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.logos img {
  height: 50px;
  max-width: 150px;
  object-fit: contain;
  background: var(--blanc);
  border-radius: 4px;
  padding: 4px 8px;
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.selector-zona {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn-zona {
  padding: 0.6rem 1.2rem;
  border: 2px solid var(--blau-mig);
  background: var(--blanc);
  color: var(--blau-mig);
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.btn-zona:hover {
  background: var(--blau-clar);
}

.btn-zona.actiu {
  background: var(--blau-mig);
  color: var(--blanc);
}

.subzona {
  background: var(--blanc);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.subzona h2 {
  font-size: 1.1rem;
  color: var(--blau-fosc);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--blau-clar);
  padding-bottom: 0.5rem;
}

.foto-unica img {
  width: 100%;
  border-radius: 6px;
  display: block;
}

.peu-foto {
  font-size: 0.85rem;
  color: var(--gris);
  margin-top: 0.5rem;
}

.slider-controls {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.slider-controls label {
  font-size: 0.9rem;
  color: var(--gris);
}

.slider-controls select {
  margin-left: 0.4rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}

img-comparison-slider {
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
}

img-comparison-slider img {
  width: 100%;
  display: block;
}

.sense-dades {
  color: var(--gris);
  font-style: italic;
  font-size: 0.9rem;
}

footer {
  background: var(--blau-fosc);
  color: var(--blau-clar);
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
  line-height: 2;
}

footer a {
  color: var(--blanc);
}

footer strong {
  color: var(--blanc);
}

@media (max-width: 600px) {
  header {
    flex-direction: column;
    text-align: center;
  }
  .logos {
    justify-content: center;
  }
  header h1 {
    font-size: 1.2rem;
  }
  .slider-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

- [ ] **Pas 3.2: Verificar al navegador**

```bash
cd /Users/juanvi/Documents/GitHub/espigo-cavet && python3 -m http.server 8000
```

Obrir `http://localhost:8000`. Ha de mostrar la capçalera blava fosc amb els logos i el peu de pàgina estilitzat. Aturar el servidor.

---

## Task 4: Lògica JS — Zones i navegació (`app.js`)

**Files:**
- Create: `app.js`

- [ ] **Pas 4.1: Crear `app.js` amb càrrega de dades i renderització de zones**

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetch('data.json').then(r => r.json());
  const selectorEl = document.getElementById('selector-zona');
  const contingutEl = document.getElementById('contingut');

  let zonaActiva = data.zones[0].id;

  function formatData(dataStr) {
    const [any, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${any}`;
  }

  function renderFotoUnica(foto) {
    return `
      <div class="foto-unica">
        <img src="${foto.fitxer}" alt="${foto.peu || foto.data}" loading="lazy">
        <p class="peu-foto">${formatData(foto.data)}${foto.peu ? ' — ' + foto.peu : ''}</p>
      </div>`;
  }

  function renderSlider(subzona) {
    const fotos = subzona.fotos;
    const idA = `select-a-${subzona.id}`;
    const idB = `select-b-${subzona.id}`;
    const sliderId = `slider-${subzona.id}`;

    const opcionsA = fotos.map((f, i) =>
      `<option value="${i}">${formatData(f.data)}${f.peu ? ' — ' + f.peu : ''}</option>`
    ).join('');

    const opcionsB = fotos.map((f, i) =>
      `<option value="${i}" ${i === fotos.length - 1 ? 'selected' : ''}>${formatData(f.data)}${f.peu ? ' — ' + f.peu : ''}</option>`
    ).join('');

    return `
      <div class="slider-controls">
        <label>Abans: <select id="${idA}">${opcionsA}</select></label>
        <label>Després: <select id="${idB}">${opcionsB}</select></label>
      </div>
      <img-comparison-slider id="${sliderId}">
        <img slot="first" src="${fotos[0].fitxer}" alt="${formatData(fotos[0].data)}" loading="lazy">
        <img slot="second" src="${fotos[fotos.length - 1].fitxer}" alt="${formatData(fotos[fotos.length - 1].data)}" loading="lazy">
      </img-comparison-slider>`;
  }

  function attachSliderListeners(zona) {
    zona.subzones.forEach(subzona => {
      if (subzona.fotos.length < 2) return;
      const slider = document.getElementById(`slider-${subzona.id}`);
      const selectA = document.getElementById(`select-a-${subzona.id}`);
      const selectB = document.getElementById(`select-b-${subzona.id}`);

      function updateSlider() {
        const fotoA = subzona.fotos[parseInt(selectA.value)];
        const fotoB = subzona.fotos[parseInt(selectB.value)];
        slider.querySelector('[slot="first"]').src = fotoA.fitxer;
        slider.querySelector('[slot="second"]').src = fotoB.fitxer;
      }

      selectA.addEventListener('change', updateSlider);
      selectB.addEventListener('change', updateSlider);
    });
  }

  function renderContingut() {
    const zona = data.zones.find(z => z.id === zonaActiva);

    if (!zona || zona.subzones.length === 0) {
      contingutEl.innerHTML = '<p class="sense-dades">Encara no hi ha fotos per aquesta zona.</p>';
      return;
    }

    contingutEl.innerHTML = zona.subzones.map(subzona => `
      <div class="subzona">
        <h2>${subzona.nom}</h2>
        ${subzona.fotos.length === 0
          ? '<p class="sense-dades">Sense fotos.</p>'
          : subzona.fotos.length === 1
            ? renderFotoUnica(subzona.fotos[0])
            : renderSlider(subzona)}
      </div>`
    ).join('');

    attachSliderListeners(zona);
  }

  function renderZones() {
    selectorEl.innerHTML = '';
    data.zones.forEach(zona => {
      const btn = document.createElement('button');
      btn.className = 'btn-zona' + (zona.id === zonaActiva ? ' actiu' : '');
      btn.textContent = zona.nom;
      btn.addEventListener('click', () => {
        zonaActiva = zona.id;
        renderZones();
        renderContingut();
      });
      selectorEl.appendChild(btn);
    });
  }

  renderZones();
  renderContingut();
});
```

- [ ] **Pas 4.2: Verificar navegació entre zones**

```bash
cd /Users/juanvi/Documents/GitHub/espigo-cavet && python3 -m http.server 8000
```

Obrir `http://localhost:8000`. Verificar:
- Apareixen tres botons de zona
- El botó actiu es ressalta en blau
- En clicar "Cap de l'espigó" o "Talús oest" apareix el missatge "Encara no hi ha fotos per aquesta zona"
- En clicar "Talús est" es mostra la subzona de mostra (la foto pot donar error 404 si no existeix encara — és normal)

Aturar el servidor.

---

## Task 5: Fotos reals i subzones definitives

**Files:**
- Modify: `data.json`
- Create: `fotos/<zona>/<subzona>/YYYY-MM-DD.jpg` (les fotos existents)

- [ ] **Pas 5.1: Localitzar les fotos existents**

Revisar les fotos que ja teniu i decidir la nomenclatura de les subzones. Cada subzona ha de correspondre a un punt de l'espigó que es fotografiarà sempre des del mateix angle.

Conveni de noms:
- Talús est: `te-1`, `te-2`, `te-3`...
- Cap: `cap-1`, `cap-2`...
- Talús oest: `to-1`, `to-2`, `to-3`...

- [ ] **Pas 5.2: Crear la estructura de carpetes definitiva i copiar les fotos**

Exemple per a cada subzona identificada:
```bash
mkdir -p fotos/talus-est/te-1
cp /ruta/a/la/foto.jpg fotos/talus-est/te-1/2026-04-01.jpg
```

Format del nom de fitxer: `YYYY-MM-DD.jpg` (la data de quan es va fer la foto).

- [ ] **Pas 5.3: Actualitzar `data.json` amb les subzones i fotos reals**

Substituir l'estructura de mostra amb les dades reals. Exemple amb dues subzones al talús est:

```json
{
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
        },
        {
          "id": "te-2",
          "nom": "Talús est — sector 2",
          "fotos": [
            {
              "data": "2026-04-01",
              "fitxer": "fotos/talus-est/te-2/2026-04-01.jpg",
              "peu": "Estat inicial"
            }
          ]
        }
      ]
    },
    {
      "id": "cap",
      "nom": "Cap de l'espigó",
      "subzones": [
        {
          "id": "cap-1",
          "nom": "Cap — sector 1",
          "fotos": [
            {
              "data": "2026-04-01",
              "fitxer": "fotos/cap/cap-1/2026-04-01.jpg",
              "peu": "Estat inicial"
            }
          ]
        }
      ]
    },
    {
      "id": "talus-oest",
      "nom": "Talús oest",
      "subzones": [
        {
          "id": "to-1",
          "nom": "Talús oest — sector 1",
          "fotos": [
            {
              "data": "2026-04-01",
              "fitxer": "fotos/talus-oest/to-1/2026-04-01.jpg",
              "peu": "Estat inicial"
            }
          ]
        }
      ]
    }
  ]
}
```

- [ ] **Pas 5.4: Verificar que les fotos es veuen correctament**

```bash
cd /Users/juanvi/Documents/GitHub/espigo-cavet && python3 -m http.server 8000
```

Obrir `http://localhost:8000` i navegar per totes les zones. Verificar que totes les fotos carreguen (sense errors 404 a la consola del navegador). Aturar el servidor.

---

## Task 6: Verificació final del slider

> Aquest task s'executa un cop tingueu ≥2 fotos en alguna subzona (a la propera sessió fotogràfica, al cap de ~15 dies).

**Files:**
- Modify: `data.json` (afegir la segona sessió de fotos)

- [ ] **Pas 6.1: Copiar les fotos de la segona sessió**

```bash
cp /ruta/a/foto-nova.jpg fotos/talus-est/te-1/2026-04-15.jpg
```

- [ ] **Pas 6.2: Afegir la nova foto al `data.json`**

A la subzona corresponent, afegir una entrada al array `fotos`:
```json
{
  "data": "2026-04-15",
  "fitxer": "fotos/talus-est/te-1/2026-04-15.jpg",
  "peu": ""
}
```

- [ ] **Pas 6.3: Verificar el slider de comparació**

```bash
cd /Users/juanvi/Documents/GitHub/espigo-cavet && python3 -m http.server 8000
```

Obrir `http://localhost:8000`. A la subzona amb 2 fotos verificar:
- Apareix el slider interactiu (barra lliscant al mig)
- Els desplegables "Abans" i "Després" mostren les dates disponibles
- Canviar les dates als desplegables actualitza les imatges del slider

Aturar el servidor.

---

## Task 7: Publicació a GitHub

**Files:** Tots els fitxers del projecte

- [ ] **Pas 7.1: Crear el repositori a GitHub**

```bash
gh repo create cavecavet/espigo-cavet --public --description "Seguiment fotogràfic de l'evolució de l'Espigó del Cavet" --source . --remote origin
```

Si no funciona amb l'organització, crear-lo manualment a github.com amb el nom `espigo-cavet` sota el compte `cavecavet`, i després:
```bash
git remote add origin https://github.com/cavecavet/espigo-cavet.git
```

- [ ] **Pas 7.2: Fer el commit i el push únics**

```bash
cd /Users/juanvi/Documents/GitHub/espigo-cavet
git add index.html style.css app.js data.json CNAME logos/ fotos/
git commit -m "Publicació inicial: web de seguiment de l'Espigó del Cavet"
git push -u origin main
```

- [ ] **Pas 7.3: Activar GitHub Pages**

A GitHub → repositori `espigo-cavet` → Settings → Pages:
- Source: `Deploy from a branch`
- Branch: `main`, carpeta `/ (root)`
- Clicar Save

- [ ] **Pas 7.4: Configurar el domini personalitzat a GitHub Pages**

A la mateixa pàgina de Settings → Pages → Custom domain:
- Escriure `espigo.cavecavet.org`
- Clicar Save

- [ ] **Pas 7.5: Afegir el registre CNAME al DNS**

Al panell DNS del vostre proveïdor de domini (el que gestiona `cavecavet.org`), afegir:

| Tipus | Nom | Valor |
|---|---|---|
| CNAME | `espigo` | `cavecavet.github.io` |

- [ ] **Pas 7.6: Verificar la publicació**

Esperar 5-10 minuts i obrir `https://espigo.cavecavet.org`. Ha de mostrar la web completa amb HTTPS actiu.

Si el DNS triga més (pot tardar fins a 24h), es pot verificar primer a `https://cavecavet.github.io/espigo-cavet`.

---

## Afegir fotos en sessions futures

Cada cop que tingueu fotos noves (cada ~15 dies):

1. Copiar les fotos a `fotos/<zona>/<subzona>/YYYY-MM-DD.jpg`
2. Afegir les entrades corresponents al `data.json`
3. Fer el push:
```bash
git add fotos/ data.json
git commit -m "Fotos sessió YYYY-MM-DD"
git push
```
