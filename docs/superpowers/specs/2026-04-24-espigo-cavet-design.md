# Disseny: Web de seguiment de l'Espigó del Cavet

**Data:** 2026-04-24  
**Projecte:** `espigo-cavet`  
**Domini:** `espigo.cavecavet.org`  
**Idioma:** Català

---

## Resum

Web estàtica per documentar l'evolució fotogràfica de l'Espigó del Cavet (Cambrils). Permet comparar l'estat de cada subzona de l'espigó al llarg del temps mitjançant una galeria per zones i un slider interactiu d'abans/després.

---

## Arquitectura

**Tecnologia:** HTML/CSS/JS pur. Cap framework, cap pas de compilació.  
**Allotjament:** GitHub Pages amb domini personalitzat `espigo.cavecavet.org` (CNAME al DNS).  
**Repositori:** `espigo-cavet` (separat de `cavecavet.github.io`).  
**Flux de treball:** desenvolupament en local, un sol push final a GitHub.

### Estructura de fitxers

```
espigo-cavet/
├── index.html
├── style.css
├── app.js
├── data.json
├── CNAME                        ← conté "espigo.cavecavet.org"
├── logos/
│   ├── diputacio.png            ← DIPTA_H_col.png
│   └── glups.jpg                ← LogoGlups.jpg
└── fotos/
    ├── talus-est/
    │   ├── se-1/
    │   └── se-2/                ← subzones a definir amb les fotos reals
    ├── cap/
    │   └── c-1/
    └── talus-oest/
        └── so-1/
```

---

## Dades: `data.json`

Fitxer únic que conté tota l'estructura de zones, subzones i fotos. Afegir una sessió nova = copiar les fotos a la carpeta i afegir una entrada al JSON.

```json
{
  "zones": [
    {
      "id": "talus-est",
      "nom": "Talús est",
      "subzones": [
        {
          "id": "se-1",
          "nom": "Talús est – sector 1",
          "fotos": [
            {
              "data": "2026-04-01",
              "fitxer": "fotos/talus-est/se-1/2026-04-01.jpg",
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

Les subzones i els seus identificadors es definiran durant la implementació, un cop revisades les fotos existents.

---

## Interfície i navegació

Pàgina única (`index.html`). Tot es renderitza dinàmicament amb JS llegint `data.json`. Cap canvi de pàgina.

### Flux de navegació

1. **Capçalera** — títol, subtítol i logos dels patrocinadors
2. **Selector de zona** — tres botons: `Talús est` / `Cap de l'espigó` / `Talús oest`
3. **Llista de subzones** de la zona activa
4. Per cada subzona:
   - **1 foto:** es mostra la imatge amb data i peu de foto
   - **≥2 fotos:** es mostra el slider de comparació amb selector de dates

### Slider de comparació

Biblioteca: [`img-comparison-slider`](https://img-comparison-slider.sneas.io/)  
Integració via CDN (una sola línia). Lleuger, accessible, sense dependències.  
L'usuari pot seleccionar quines dues dates vol comparar dins d'una subzona.

### Disseny visual

- Estil marí: tonalitats blaves i grises
- Tipografia clara i llegible
- Responsive: funciona en mòbil (ús en camp durant les sessions fotogràfiques)

---

## Patrocinadors i crèdits

### Capçalera

```
Evolució de l'Espigó del Cavet
Seguiment fotogràfic de l'estat de l'espigó

[Logo Diputació de Tarragona]    [Logo Glups Diving]
```

### Peu de pàgina

```
Amb el suport de: Diputació de Tarragona
Col·laborador: Glups Diving
Projecte de l'Associació Cave Cavet · cavecavet.org
```

**Fonts dels logos:**
- `DIPTA_H_col.png` — Google Drive / Logos / LogosAltresEntitats
- `LogoGlups.jpg` — Google Drive / Logos / LogosAltresEntitats

---

## Gestió de contingut

- **Responsable:** tècnic únic, sense restriccions d'habilitats
- **Freqüència:** nova sessió fotogràfica cada ~15 dies
- **Procés:** copiar fotos a `fotos/<zona>/<subzona>/YYYY-MM-DD.jpg` + afegir entrades al `data.json`
- **No es requereix CMS** ni cap eina addicional

---

## Desenvolupament local

El `data.json` es carrega via `fetch()`, que no funciona amb el protocol `file://`. Per provar en local cal un servidor mínim:

```bash
cd espigo-cavet
python3 -m http.server 8000
# obrir http://localhost:8000
```

---

## Publicació

1. Copiar logos des de Google Drive a `logos/diputacio.png` i `logos/glups.jpg`
2. Crear repositori `espigo-cavet` a GitHub (compte `cavecavet`)
3. Fitxer `CNAME` amb el valor `espigo.cavecavet.org`
4. Activar GitHub Pages (branca `main`, arrel `/`)
5. Afegir registre CNAME al DNS: `espigo` → `cavecavet.github.io`
6. Un sol push amb tot el projecte acabat
