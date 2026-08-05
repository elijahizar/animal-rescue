# Animal Rescue — Guía de Contenido

> Estándar de calidad para crear y mantener el contenido del sitio (100% en
> francés). Léela antes de añadir especies, regiones, noticias o ajustar feeds.
> Ver también `docs/system-design.md` para el modelo de datos.

## 1. Principios generales

1. **Veracidad científica**: los datos (estatus IUCN, poblaciones, tendencias)
   deben provenir de la Liste rouge de l'UICN o de fuentes científicas citables.
2. **Francés correcto**: ortografía y acentos correctos; estilo directo y claro.
3. **Créditos completos**: cada foto lleva autor, página de Commons y licencia.
4. **Sin inventar**: si una cifra no se puede verificar, se omite o se califica
   ("estimation", "selon la Liste rouge…").
5. **Reutilizar taxonomías**: usar siempre los ids de `src/lib/causes.ts`
   (causas) y `src/lib/iucn.ts` (estatus). Nunca inventar códigos nuevos.

## 2. Ficha de especie (`src/content/animals/fr/{slug}.md`)

### 2.1 Frontmatter (schema en `src/content.config.ts`)

```yaml
---
slug: guepard                # id estable, coincide con el nombre de archivo
name: Guépard                # nombre común en francés (fr)
scientificName: Acinonyx jubatus
iucnStatus: VU               # CR | EN | VU | NT | LC
gallery:
  - src: https://upload.wikimedia.org/.../1280px-....jpg   # ancho 1280
    author: Nom du photographe
    page: https://commons.wikimedia.org/wiki/File:...jpg
    licence: CC BY-SA 4.0    # o CC BY 2.0, CC0, Public domain…
    alt: Description de l'image
causes:
  - braconnage
  - perte-habitat
aider: >-
  - Action concrète 1.
  - Action concrète 2.
regions:
  - afrique-subsaharienne
  - iran
tags:
  - felin
  - afrique
---
```

> El archivo debe llamarse `{slug}.md`.

### 2.2 Body (markdown)

- **~2 párrafos**.
- **Párrafo 1** — presentación naturalista: tamaño, hábitat, alimentación,
  alguna curiosidad.
- **Párrafo 2** — estado de conservación: **citar estatus IUCN y evaluación**
  (ej. "Selon l'UICN (évaluation de Cooke, 2018)…"), población estimada, tendencia
  y principales amenazas.
- Énfasis: escribir el estatus en **negrita** la primera vez ("**En danger**").

### 2.3 Cómo seleccionar fotos de Wikimedia Commons

1. Buscar en Commons y elegir 3-6 fotos con **licencia libre**:
   `CC BY`, `CC BY-SA`, `CC0` o `Public domain`. Evitar `CC BY-NC*` y `CC BY-ND`.
2. Verificar que la URL del thumb responde `200`:
   ```bash
   curl -s -A "animal-rescue/0.1" -o /dev/null -w "%{http_code}" "<thumb_url>"
   ```
3. Usar thumbs de 1280 px (`.../thumb/<hash>/<file>/1280px-<file>`) y quitar los
   parámetros `?utm_*`.
4. Copiar el nombre `File:` y la URL de la página de Commons del autor; anotar la
   licencia exacta (se muestra en el `figcaption` de la ficha).
5. **No descargar de forma masiva en build** (Wikimedia responde 429): el
   navegador del visitante carga la imagen directamente (hotlinking) — es lo
   correcto.

## 3. Regiones (`src/content/regions/fr/{id}.json`)

```json
{
  "id": "kenya",
  "animalId": "rhinoceros-noir",
  "label": "Kenya (rhinocéros noir de l'Est)",
  "continent": "Afrique",
  "lat": 0.5,
  "lng": 37.5
}
```
- `id` y `animalId` deben coincidir con el `slug` de la ficha.
- `continent` en francés (reusar los ya usados): Afrique, Asie, Europe,
  Amérique du Nord, Amérique du Sud, Océanie, Océans.
- `lat`/`lng` aproximando el centro de la zona (no de la especie).

## 4. Noticias (`src/content/news/fr/`)

- **No se editan a mano**: las genera `npm run fetch-news` ("RSS en build time").
- Si aparecen noticias maletiquetadas, ajusta `scripts/fetch-rss.mjs` (feeds y
  keywords), borra los `.md` erróneos y re-ejecuta el script (los existentes no
  se sobrescriben).

### 4.1 Feeds verificados (2026-08)

| Fuente | URL | Estado |
|---|---|---|
| UICN Comité Français | `https://uicn.fr/feed/` | operativo |
| WWF France | `https://www.wwf.fr/rss.xml` | ok (puede estar vacío) |
| Le Monde — Planète | `https://www.lemonde.fr/planete/rss_full.xml` | operativo |
| Reporterre | `https://reporterre.net/spip.php?page=backend` | operativo |
| Sciences & Avenir | `https://www.sciencesetavenir.fr/rss.xml` | operativo |
| Fondation Tara Océan | `https://fondationtaraocean.org/feed/` | operativo |
| LPO / FNE / Geo / Le Point | — | URLs rotas / 403 — **no usar** |

### 4.2 Matching de keywords

El match se hace con límites de palabra (`\b`) sobre texto normalizado
(minúsculas + sin acentos) para evitar falsos positivos: ej. "lion" NO debe
coincidir dentro de "mil**lions**".

## 5. Cómo añadir una especie nueva (checklist completo)

- [ ] Crear `src/content/animals/fr/{slug}.md` con el esquema de la sección 2.1
- [ ] Verificar `iucnStatus` real en la UICN (citar evaluación/año en el body)
- [ ] Seleccionar 3-6 fotos Commons con licencia libre (curl 200, crédito completo)
- [ ] Crear sus regiones `src/content/regions/fr/{slug}-{zona}.json` (2-5 zonas)
- [ ] Usar solo `causes` de la taxonomía (`src/lib/causes.ts`)
- [ ] Añadir keywords nuevas a `scripts/fetch-rss.mjs` si aplica
- [ ] `npm run build` + `npx astro check` (0 errores)
- [ ] Revisar la ficha en local (`npm run dev`)
- [ ] Actualizar `docs/execution-plan.md` (checkboxes + bitácora)

## 5. Cómo añadir una región a una especie existente

- [ ] Comprobar que el `animalId` coincide con el slug de la ficha.
- [ ] Buscar centro geográfico verosímil (Wikipedia / maps approx).
- [ ] Elegir `continent` de la lista usada (ver sección 3).
- [ ] Añadir el id al campo `regions` de la ficha.
- [ ] Build + check.

## 6. Checklist de calidad (DoD contenido)

- [ ] Francés correcto (ortografía, acentos, concordancia, la/le)
- [ ] Estatus IUCN citado con fuente/evaluación
- [ ] Fotos con `author`, `page`, `licence`, `alt` propios y URL verificada (200)
- [ ] Sin causas fuera de la taxonomía; sin regiones huérfanas (animal inexistente)
- [ ] `npm run build` (0 errores) + `npx astro check` (0 errores)
- [ ] `docs/execution-plan.md` actualizado