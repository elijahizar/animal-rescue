# ADR-0001 — Stack: Astro SSG + React (Leaflet)

- **Estado**: Aceptado (2026-08-05)
- **Contexto**: sitio informativo 100% estático en francés; contenido curatorial
  (especies, noticias), sin login ni datos dinámicos por usuario.
- **Decisión**: Astro en modo SSG con islas React:
  - React para el mapa (react-leaflet 5 + Leaflet 1.9) y la lista con filtros/búsqueda.
  - El resto de páginas, Astro nativo (HTML + CSS, zero JS).
- **Consecuencias**: 41 páginas estáticas en build (~1s); JS solo en las islas.
  Leaflet requiere `client:only="react"` (no existe en SSR: `window` no definido).
- **Alternativas descartadas**: Next.js (overkill SSR), SPA puro (SEO/JS), Astro
  con otras islas (sin ventaja para este caso).

## ADR-0002 — i18n: fr por defecto con prefijo + redirect

- **Estado**: Aceptado (2026-08-05)
- **Contexto**: contenido 100% fr ahora, multilingüe en el futuro; marca
  "Animal Rescue" universal.
- **Decisión**: `locales: ['fr']`, `defaultLocale: 'fr'`,
  `prefixDefaultLocale: true` y `redirectToDefaultLocale: true`. Todo el contenido
  por locale en `src/content/{animals,regions,news}/fr/`. Enlaces con
  `getRelativeLocaleUrl`.
- **Consecuencias**: URLs tipo `/fr/aide/guepard/`; redirect `/` → `/fr/` generado
  en build (meta refresh + canonical). Añadir un idioma = nueva carpeta en
  content + locale en config.

## ADR-0003 — Deploy: GitHub Pages (subpath) en lugar de Cloudflare Pages

- **Estado**: Aceptado (2026-08-05, cambio de plan del usuario)
- **Contexto**: se preveía Cloudflare Pages (subdominio gratuito + cron vía
  webhook). El usuario pidió "primera versión de deploy en GitHub Pages".
- **Decisión**: GitHub Pages como proyecto en subpath
  `https://elijahizar.github.io/animal-rescue/` con `base: '/animal-rescue/'` en
  `astro.config.mjs` y workflow GH Actions (`deploy.yml`).
- **Consecuencias**: `site`/`base` fijados; robots.txt/sitemap con URL del
  subpath; todos los enlaces internos vía `getRelativeLocaleUrl`/`BASE_URL`;
  legal actualizado (hébergeur GitHub, Inc.). Cron diario (antes "webhook
  Cloudflare") queda como `schedule` en el workflow (pendiente).

## ADR-0004 — Imágenes: hotlinking Wikimedia Commons en lugar de `astro:assets`

- **Estado**: Aceptado (2026-08-05)
- **Contexto**: galerías de 5 fotos por ficha desde Wikimedia Commons (remotas).
  Se probó `astro:assets` con `inferSize` para AVIF/WebP + srcset.
- **Decisión**: hotlinking de thumbnails (1280px) de Commons con
  `loading="lazy"` y `width`; sin `astro:assets`.
- **Consecuencias**: Wikimedia responde HTTP 429 a descargas masivas y
  concurrentes en build (rate-limit) — el pipeline de cron se volvía lento y
  frágil. El navegador del visitante carga la imagen directamente, sin coste de
  build ni riesgo de rotura del CI.
- **Riesgo**: dependencia de la disponibilidad de upload.wikimedia.org en
  tiempo de visita (aceptable; CDN global de Wikimedia).

## ADR-0005 — Noticias: RSS en build time (cron = redeploy)

- **Estado**: Aceptado (2026-08-05); cron diario pendiente
- **Contexto**: noticias frescas sin backend; automatización desde el día 1.
- **Decisión**: `scripts/fetch-rss.mjs` corre ANTES del build (`npm run
  fetch-news` dentro del workflow): 6 feeds francófonos, filtro por keywords con
  límites de palabra, últimas 30 noticias como Content Collection `news/fr`.
  El "cron diario" = redeploy del sitio (re-ejecución del workflow con
  `schedule`; pendiente).
- **Consecuencias**: noticias de máx. 24h de antigüedad; archivos `.md` estables
  (no se sobrescriben → URLs de artículos permanentes). Fetch manual:
  `npm run fetch-news`.

## ADR-0006 — Privacidad: sin analítica, sin cookies

- **Estado**: Aceptado (2026-08-05)
- **Contexto**: sitio informativo bénévole; respeto del usuario.
- **Decisión**: ninguna analítica, ningún cookie, ninguna publicidad, ningún
  formulario de datos personales. Único tercero: el CDN de GitHub Pages
  (logs de infraestructura, no usados por el proyecto).
- **Consecuencias**: sin banner de cookies; página de política de privacidad
  corta y clara; el sitio funciona sin JS salvo islas (mapa/filtros).
