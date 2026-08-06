# Animal Rescue — System Design

> Documento de referencia técnica del sistema. Consulta también:
> `docs/plan.md` (decisiones de producto) · `docs/execution-plan.md` (estado y bitácora)
> · `docs/content-guidelines.md` (cómo crear contenido).

## 1. Visión general

Sitio web estático (SSG) en francés para concienciar sobre especies en peligro de
extinción. Sin backend, sin base de datos, sin analítica, sin cookies.

- **Framework**: Astro (SSG) v7
- **Islas interactivas**: React + react-leaflet (mapa) y React (lista con filtros)
- **Hospedaje**: GitHub Pages (proyecto en subpath `https://elijahizar.github.io/animal-rescue/`)
- **Contenido**: Content Collections con Zod, por locale (`fr`)
- **Noticias**: feeds RSS francófonos, procesados en build time

```
┌─────────────┐   ┌──────────────┐   ┌───────────┐   ┌──────────────┐
│ Feeds RSS   │──▶│ fetch-rss    │──▶│ Content   │──▶│ astro build  │──▶ dist/
│ (6 fuentes) │   │ .mjs (build) │   │ news/fr   │   │ (SSG)        │
└─────────────┘   └──────────────┘   └───────────┘   └──────┬───────┘
                                                            │
┌─────────────┐   ┌──────────────┐   ┌───────────┐          ▼
│ Wikimedia   │──▶│ fetch-images │──▶│ Content   │          GitHub Pages
│ Commons     │   │ .mjs (once)  │   │ animals/fr│          /animal-rescue/
│ (descarga)  │   └──────────────┘   │ + assets  │
└─────────────┘                      └───────────┘
```

## 2. Arquitectura

### 2.1 Componentes estáticos (Astro)
- `src/layouts/BaseLayout.astro` — `<html>`, meta/OG, header, footer, título `… · Animal Rescue`
- `src/components/Header.astro` / `Footer.astro` — navegación con `getRelativeLocaleUrl`
- `src/components/Causes.astro` — chips de causas con iconos SVG inline
- Páginas bajo `src/pages/fr/` (el prefijo `/fr/` es el locale por defecto)

### 2.2 Islas React
- `src/components/AnimalMap.tsx` — mapa Leaflet + OpenStreetMap, `client:only="react"`
  (Leaflet no funciona en SSR: `window is not defined`; por eso `client:only`)
- `src/components/AnimalList.tsx` — tarjetas con búsqueda y filtros (causa, estatus, continente).
  Los filtros son chips con **color-coding por categoría**: borde con el color del token de
  cada causa/estatus (`--chip-accent`, neutral forest para continentes), activo = verde
  bosque sólido + check `✓`, y estados `hover` (tinte suave), `:focus-visible` (borde naranja)
  y `:active` (presionado). Diseño definido 2026-08-05.

### 2.3 Sin dependencias de servidor
Build 100% estático: ninguna página necesita runtime. El "backend" son los
archivos de contenido + el script de RSS en build time.

## 3. Modelo de datos (Content Collections)

Definido en `src/content.config.ts` con `glob` de `astro/loaders` y Zod.

### 3.1 Colección `animals` — `src/content/animals/fr/*.md`
| Campo | Tipo | Notas |
|---|---|---|
| `slug` | string | id estable usado en URLs (`/fr/aide/{slug}/`) |
| `name` | string | nombre común (fr) |
| `scientificName` | string | nombre científico en cursiva |
| `iucnStatus` | enum | `CR` \| `EN` \| `VU` \| `NT` \| `LC` |
| `gallery` | array | `{ src, author, page, licence, alt? }` — fotos Wikimedia Commons |
| `causes` | array | ids de la taxonomía (`src/lib/causes.ts`) |
| `aider` | string | markdown "Comment aider" (renderizado con `marked`) |
| `regions` | array | ids → colección `regions` |
| `tags` | array | opcional, para SEO/agrupación |

El cuerpo markdown = descripción de ~2 párrafos en francés con datos verificados.

### 3.2 Colección `regions` — `src/content/regions/fr/*.json`
`{ id, animalId, label, continent, lat, lng }` — usada por la ficha (mini-mapa),
la página `/carte/` y los filtros de la lista.

### 3.3 Colección `news` — `src/content/news/fr/*.md`
`{ title, date (ISO), url (fuente), source, animal (tag) }` + body = extracto.
El **nombre de archivo es estable** (slug del título): los enlaces no cambian al
re-ejecutar `fetch-rss` (el script no sobrescribe archivos existentes).

> **Retención (decisión 2026-08-05)**: el script solo escribe archivos nuevos y nunca
> elimina. La "últimas 30" (`MAX_ITEMS=30`) aplica **por ejecución**, no al total en
> disco: la colección acumula sin límite para preservar URLs estables. Si se quisiera
> podar (p. ej. borrar noticias > N días), debe decidirse y documentarse aquí; no
> improvisar (ver ADR-0005).

### 3.4 Constantes compartidas
- `src/lib/causes.ts` — 8 causas con `label` y `color` (taxonomía reutilizable)
- `src/lib/iucn.ts` — 5 estatus con `label`, `color`, `order`
- `src/lib/news.ts` — etiquetas de tags, formato de fecha fr, extractos

## 4. Flujo de datos: noticias (RSS)

1. **Cron/redeploy**: (pendiente — ver ADR-0005) el trigger actual es `push` a `main`
   (workflow `deploy.yml`); el plan prevé `schedule` diario para re-ejecutar el build.
2. **`scripts/fetch-rss.mjs`** (`npm run fetch-news`): descarga 6 feeds francófonos,
   filtra por keywords con **límites de palabra** (`\b`), ordena por fecha, guarda las
   30 más recientes en `src/content/news/fr/` como archivos `.md`.
   - Los archivos existentes no se sobrescriben (URLs estables).
   - Falsos positivos evitados con regex de límites (ej. "lion" no coincide en "millions").
   - `MAX_ITEMS=30` por ejecución: solo se escriben archivos nuevos; no hay poda en
     disco (ver retención en §3.3).
3. **Build**: Astro genera las páginas de noticias (índice + paginación 10/página +
   tags + artículo por noticia) desde la colección.

## 5. i18n

- `astro.config.mjs`: `locales: ['fr']`, `defaultLocale: 'fr'`,
  `prefixDefaultLocale: true` + `redirectToDefaultLocale: true`.
- Contenido por locale en `src/content/{animals,regions,news}/fr/`.
- Enlaces con `getRelativeLocaleUrl(locale, path)` (añade `base` y prefijo).
- Redirección generada en build: `/` → `/fr/` (meta refresh + canonical).
- La marca "Animal Rescue" es universal; solo el subtítulo se localiza.

## 6. Deploy (GitHub Pages)

- **Config**: `site: 'https://elijahizar.github.io'`, `base: '/animal-rescue/'` en
  `astro.config.mjs`. Todos los enlaces internos usan `getRelativeLocaleUrl` o
  `import.meta.env.BASE_URL` (nada de rutas absolutas hardcodeadas).
- **Workflow** `.github/workflows/deploy.yml`:
  1. `npm ci`
  2. `npm run fetch-news` (noticias frescas en build time)
  3. `npm run build`
  4. `actions/configure-pages` → `upload-pages-artifact` (dist) → `deploy-pages`
- **Triggers**: `push` a `main` + `workflow_dispatch` (manual). El cron diario es
  una mejora pendiente (añadir `schedule`).
- Requiere en GitHub: Settings → Pages → Source "GitHub Actions" (ya activo).

## 7. Rendimiento e imágenes

- **Fotos**: auto-gestionadas en local y optimizadas con `astro:assets`
  (ADR-0007, supersede ADR-0004). Cada ficha referencia imágenes locales en
  `src/assets/species/{slug}/` vía `gallery[].image: image()`. El componente
  `<Image>` genera webp/avif + `srcset` (500/960/1280/1920) en build; el
  `heroImage` de OG también es local. Las islas React (`AnimalList`) reciben
  `image.src` procesado y usan `<img>` simple.
  Importación: `npm run fetch-images` (`scripts/fetch-species-images.mjs`) lee
  las urls de la galería, las descarga una vez (secuencial, pausa, reintentos —
  evita el HTTP 429 de Wikimedia) y reescribe el frontmatter. NO se llama a
  Wikimedia en build ni en visita.
- **CSS**: un `global.css` con tokens de diseño (verde bosque `#2D6A4F`, crema
  `#FEFAE0`, naranja `#E76F51`).
- **SEO**: sitemap (`@astrojs/sitemap`), `robots.txt`, OG tags en fichas, noticias
  y home. `og:url` y `og:image` absolutos (`site` + base + path).

## 8. Estructura de carpetas

```
.github/workflows/deploy.yml   pipeline CI/CD
docs/                          plan, execution-plan, system-design, content-guidelines, adr/
public/                        favicon, robots.txt
scripts/fetch-rss.mjs          importación de noticias
src/
  components/                  Header, Footer, Causes, AnimalMap (React), AnimalList (React)
  content/                     animals/regions/news por locale (fr)
  content.config.ts            schemas Zod + loaders
  i18n/                        configuración de locale
  layouts/BaseLayout.astro     layout raíz
  lib/                         causes, iucn, news (constantes y helpers)
  pages/fr/                    rutas públicas (aide, infos, carte, aider, apropos, legal, home)
  styles/global.css            tokens de diseño
```

## 9. Riesgos y notas

- **Wikimedia 429**: evitado con `fetch-images` (pausa + reintentos); en build y
  visita no hay peticiones a Wikimedia.
- **Feeds inestables**: algunos feeds cambian de URL (LPO/FNE/Geo rotos en
  2026-08); el script tolera errores por feed (try/catch).
- **WWF France**: el feed puede estar vacío (0 artículos); no es un error.
- **OpenStreetMap/Leaflet**: los tiles se cargan en el navegador desde
  `tile.openstreetmap.org` (tercero con política de uso). Dependencia de disponibilidad
  en tiempo de visita; la atribución ya está presente.
- **Islas React sin fallback**: `/aide` (lista y filtros) y `/carte` dependen de JS;
  sin JS no hay tarjetas ni markers. Añadir fallback estático y `aria-label` al mapa
  (accesibilidad) — pendiente.
- **Fechas en UTC**: `formatDate` usa `timeZone: 'UTC'` — una noticia publicada el 27
  por la noche (hora francesa) se muestra como 28. Menor, pero considerarlo.
- **Subpath**: si algún día se usa dominio propio, quitar `base` y actualizar
  `robots.txt` + `site`.
