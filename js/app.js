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

function attachImageFallbacks(root) {
  root.querySelectorAll('img').forEach(img => {
    if (img.dataset.fallbackAttached) return;
    img.dataset.fallbackAttached = '1';
    img.addEventListener('error', () => {
      const fallback = document.createElement('div');
      fallback.className = 'card-thumb-empty';
      fallback.textContent = 'Imatge no disponible';

      const slider = img.closest('img-comparison-slider');
      if (slider) {
        slider.replaceWith(fallback);
      } else {
        img.replaceWith(fallback);
      }
    });
  });
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

  attachImageFallbacks(grid);

  grid.querySelectorAll('.subzone-card').forEach(card => {
    const handler = (triggerEl) => openModal(subzones.find(sz => sz.id === card.dataset.id), triggerEl);
    card.addEventListener('click', () => handler(card));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(card); });
  });
}

function renderPersonesGallery(galeria) {
  document.getElementById('persones-intro').textContent = galeria.text || '';
  const grid = document.getElementById('persones-grid');
  grid.innerHTML = galeria.fotos.map((foto, i) => `
    <figure class="persones-thumb" data-index="${i}" tabindex="0" role="button" aria-label="Amplia la imatge">
      <img src="${foto.fitxer}" alt="${galeria.nom}" loading="lazy" />
    </figure>
  `).join('');

  attachImageFallbacks(grid);

  grid.querySelectorAll('.persones-thumb').forEach(thumb => {
    const handler = () => openPhotoModal(galeria.fotos[thumb.dataset.index].fitxer, galeria.nom, thumb);
    thumb.addEventListener('click', handler);
    thumb.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
  });
}

let _lastFocus = null;

function openPhotoModal(fitxer, titol, triggerEl) {
  const modal = document.getElementById('modal');
  document.getElementById('modal-title').textContent = titol;
  document.getElementById('modal-body').innerHTML = `<img src="${fitxer}" alt="${titol}" />`;
  document.getElementById('modal-date').textContent = '';

  attachImageFallbacks(document.getElementById('modal-body'));
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  _lastFocus = triggerEl ?? null;
  document.getElementById('modal-close').focus();
}

function openModal(subzone, triggerEl) {
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

  attachImageFallbacks(body);
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  _lastFocus = triggerEl ?? null;
  document.getElementById('modal-close').focus();
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.remove('open');
  if (_lastFocus) { _lastFocus.focus(); _lastFocus = null; }
}

async function init() {
  let data;
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch {
    document.getElementById('cards-grid').innerHTML =
      '<p class="no-data">Error carregant les dades. Torna-ho a intentar.</p>';
    return;
  }

  if (!data.zones?.length) {
    document.getElementById('cards-grid').innerHTML =
      '<p class="no-data">Encara no hi ha zones definides.</p>';
    return;
  }

  const galeria = data.galeria_persones;
  const tabs = galeria
    ? [...data.zones, { id: 'persones', nom: galeria.nom }]
    : data.zones;
  let activeZone = data.zones[0].id;
  let personesRendered = false;

  function selectZone(zoneId) {
    activeZone = zoneId;
    renderTabs(tabs, activeZone, selectZone);

    const esPersones = zoneId === 'persones';
    document.getElementById('cards-grid').hidden = esPersones;
    document.getElementById('persones-view').hidden = !esPersones;

    if (esPersones) {
      if (!personesRendered) { renderPersonesGallery(galeria); personesRendered = true; }
    } else {
      const zone = data.zones.find(z => z.id === zoneId);
      renderCards(zone.subzones);
    }
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
