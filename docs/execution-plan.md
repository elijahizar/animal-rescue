# Animal Rescue — Plan de Ejecución Detallado

> Documento vivo: se actualiza al final de cada sesión. Marcar tareas como `[x]` al completarlas, anotar decisiones nuevas en la sección "Bitácora".
> Producto/decisiones acordadas: ver `docs/plan.md`. Consultar ambos en cada sesión.

**Leyenda**: `[x]` hecho · `[ ]` pendiente · `[~]` en curso · `[!]` bloqueado

## Estado actual (2026-08-05)

- Repo clonado: `git@github.com:elijahizar/animal-rescue.git` (commit inicial `8641f53`)
- Plan de producto aprobado (`docs/plan.md`)
- Este plan de ejecución creado
- Directorio de trabajo: `/home/elijah/Documents/Projects/daniel/animal-rescue`
- **FASE 0 completada** (scaffold Astro v7, shell visual, arquitectura i18n `/fr/`)
- **FASE 1 completada** (tracer bullet guépard) — revisión aprobada por el usuario (2026-08-05)
- **FASE 2 COMPLETADA** (2026-08-05): 10 fichas + 36 regiones, `aider/`, `apropos/`, legal, blog INFOS con paginación/tags, optimizaciones SEO/OG, **deploy v1 en GitHub Pages** → https://elijahizar.github.io/animal-rescue/fr/ (workflow verde, URL verificada)
- Next: **cron diario de redeploy** (pendiente) → mejoras de contenido/SEO/i18n
- **FASE 3 COMPLETADA** (2026-08-05): documentación técnica y calidad al día (system-design, content-guidelines, 6 ADRs, session-kickoff, README, plan.md, AGENTS.md)
- **FASE 4 COMPLETADA** (2026-08-05): verificación de diseño (system-design vs código), rediseño e implementación de los chips de filtros en `/aide` (color-coded por categoría + estados), fix de scoping CSS de la isla `AnimalList` (los estilos nunca se aplicaban) y fix de doble slash en URLs de tarjetas
- Next: **Fase 5 (backlog priorizado)**: SEO (og:url absoluto, canonical, og:image noticias, srcset) → a11y (fallback sin-JS, mapa, contraste badges, skip-link) → rendimiento (preconnect, fetchpriority) → diseño/contenido (hero foto, OG home, fechas Europe/Paris) → operación (cron diario, 404)

---

## Fase 0 — Fundación

### 0.1 Git y repo
- [x] Clonar repo GitHub en directorio actual
- [x] Añadir `.gitignore` (node_modules/, dist/, .astro/) — viene con el template Astro
- [ ] Licencias: MIT (código) + CC BY-SA 4.0 (contenido) — omitidas por decisión del usuario (2026-08-05)

### 0.2 Scaffold de Astro
- [x] `npm create astro` (template minimal, TypeScript, npm) en el directorio actual
- [x] Verificar build local: `npm run dev` y `npm run build`
- [x] Commit: `chore: scaffold astro`

### 0.3 Base visual (shell navegable)
- [x] Tokens de diseño en CSS: verde bosque `#2D6A4F`, crema `#FEFAE0`, naranja `#E76F51`, neutros, tipografía
- [x] Layout raíz (`BaseLayout`): header con nav (AIDE · INFOS · CARTE · AIDER · À PROPOS), footer con legal
- [x] Estilo moderno/vibrante, fotos protagonistas
- [x] Commit: `feat: shell visual (layout, header, footer, tokens)`

### 0.4 Arquitectura i18n
- [x] Config `src/i18n`: `fr` como idioma por defecto, `src/pages/fr/` como raíz de contenido
- [x] Redirect de `/` → `/fr/` (routing `prefixDefaultLocale: true` + `redirectToDefaultLocale: true`)
- [x] Estructura de Content Collections por locale (carpetas `fr/` al menos)
- [x] Commit: `feat: arquitectura i18n (fr default)`

---

## Fase 1 — Tracer bullet: ficha de guépard (validación técnica vertical)

> Objetivo: validar TODA la cadena técnica (contenido, imágenes, mapa, RSS, i18n) con 1 especie antes de multiplicar contenido.

### 1.1 Modelo de datos (Content Collections + Zod)
- [x] Colección `animals` — schema: slug, nombre (fr), nombre scientifique, statut IUCN (enum CR/EN/VU/NT/LC + color badge), galería `[{src, crédit, licence}]`, description (markdown), causes (array de la taxonomía), comment aider (markdown), regiones (ids → colección `regions`), tags
- [x] Colección `regions` — schema: id, animalId, label (fr), lat, lng (+ `continent` para filtros de lista)
- [x] Colección `news` — schema: slug, título, fecha, url fuente, tag animal, excerpt
- [x] Taxonomía de causas en constantes compartidas (fr): déforestation, braconnage, pollution, changement climatique, perte d'habitat, surpêche, espèces invasives, trafic d'espèces
- [x] Rutas de contenido por locale (`src/content/animals/fr/`, `src/content/news/fr/`)

### 1.2 Contenido del guépard (Acinonyx jubatus)
- [x] Ficha completa en francés: descripción (~2 párrafos), causas (taxonomía), cómo ayudar (acciones concretas)
- [x] 4-6 fotos de Wikimedia Commons (verificar licencia libre y autor para crédito) — 6 fotos CC BY-SA 2.0/2.5/4.0 y CC0
- [x] Regiones `lat/lng` (África subsahariana, Irán — población asiática)
- [x] Verificar estadísticas IUCN reales (población estimada, tendencia) — VU, ~6 500 ind. matures, tendencia a la baja (IUCN 2022)

### 1.3 Página ficha `/aide/guépard/`
- [x] Galería de fotos con créditos visibles
- [x] Badge de estatus IUCN con color
- [x] Causas con iconos
- [x] Sección "Comment aider" (específica de la especie)
- [x] Mini-mapa Leaflet con la zona de distribución
- [x] OG tags + social sharing en esta página

### 1.4 Página lista `/aide/`
- [x] Tarjetas de animal (foto, nombre, estatus, continente)
- [x] Filtros por chips: causa, estatus IUCN, continente
- [x] Búsqueda por texto (nombre, nombre científico)
- [x] Isla interactiva React (según decisión: React + Leaflet)

### 1.5 CARTE mínimo
- [x] Leaflet + OpenStreetMap (sin API key) en página `/carte/`
- [x] Markers del guépard, popup → enlace a la ficha
- [x] Mapa mundial

### 1.6 INFOS mínimo (validación RSS)
- [x] Script `fetch-rss.mjs` local: descarga 3 feeds (UICN France, WWF France, Le Monde Planète), parseo XML, filtro por keywords, salida a datos
- [x] Ejecución manual `npm run fetch-news` y verificación de salida (12 noticias iniciales)
- [x] NOTA: el cron diario se configura en Fase 2 (Cloudflare)

### 1.7 Validación y revisión
- [x] Revisión con el usuario: diseño, tono, estructura de la ficha (aprobada 2026-08-05)
- [x] Ajustes (ninguno requerido)
- [x] Commit: `feat: tracer bullet — ficha guépard + lista + mapa + rss`

---

## Fase 2 — Contenido completo y pulido

### 2.1 Las 9 especies restantes
- [x] corail (grupo — entrada con subespecies en el texto)
- [x] tigre (Panthera tigris)
- [x] rhinocéros noir (Diceros bicornis)
- [x] lion blanc (Panthera leo — nota: no es especie, es morfo de color; redactar con precisión)
- [x] pingüino de Humboldt (Spheniscus humboldti)
- [x] thon rouge (grupo — entrada con subespecies)
- [x] dauphin commun (Delphinus delphis)
- [x] baleine bleue (Balaenoptera musculus)
- [x] requin blanc (Carcharodon carcharias)
- [x] Cada ficha: fotos Commons con crédito, regiones lat/lng, causas de taxonomía, cómo ayudar

### 2.2 Página `aider/` (global)
- [x] Acciones diarias (consommation, alimentation, transport, environnement)
- [x] Lista de ONGs: WWF France, Greenpeace France, LPO, Sea Shepherd France, Fondation Nicolas Hulot, Comité français de l'UICN (enlaces externos, nuevo tab; SIN enlaces de donación)

### 2.3 Páginas `apropos/` + legal
- [x] `apropos/`: misión, valores, qué hacemos
- [x] `mentions-legales/`: editor, hébergeur (Cloudflare), licencias CC BY-SA
- [x] `politique-de-confidentialite/`: sin recogida de datos, sin cookies

### 2.4 INFOS completo (blog)
- [x] `fetch-rss.mjs` final: 6 feeds francófonos verificados (UICN, WWF, Le Monde Planète, Reporterre, Sciences & Avenir, Tara Océan — FNE/LPO/Geo/Le Point: URLs rotas/404, descartados)
- [x] Verificar URLs RSS reales de cada feed
- [x] Blog `/infos/` con paginación (10 por página, `index` + `page/[page]`)
- [x] Tags por especie (página `infos/tag/[tag]`) + filtro en el índice
- [x] Artículo individual `/infos/[slug]` (contenido estable por nombre de archivo)
- [x] Fix de matching: límites de palabra `\b` (evita falso positivo "lion" en "mil**lion**s")

### 2.5 Optimizaciones
- [x] SEO básico: `@astrojs/sitemap` + `public/robots.txt` (site placeholder `animal-rescue.pages.dev`, actualizar en deploy)
- [x] OG tags + social sharing: fichas (og:image desde galería) y artículos de noticias (og:title/description/url). Lazy-load en galerías y home
- [x] `astro:assets`: probado con imágenes remotas, descartado por decisión (ver bitácora) — hotlinking de thumbs de Wikimedia Commons con lazy-load

### 2.6 Despliegue GitHub Pages
- [x] Config base/site en `astro.config.mjs` (`/animal-rescue/` en `elijahizar.github.io`)
- [x] Fix de 3 enlaces absolutos rotos bajo subpath (favicon en BaseLayout, botón en aider)
- [x] Coherencia: `robots.txt` (sitemap `/animal-rescue/`), `mentions-legales/` + `politique-de-confidentialite/` → hébergeur GitHub Pages; script `deploy` = fetch-news + build (sin wrangler)
- [x] Workflow `.github/workflows/deploy.yml`: triggers `push (main)` + `workflow_dispatch` (sin cron por ahora, decisión del usuario); npm ci + fetch-news + build + deploy-pages
- [x] **Acción del usuario (1 vez)**: GitHub → Settings → Pages → Source: "GitHub Actions" (ya estaba activado con `build_type: workflow`, verificado por API)
- [x] Probar deploy: workflow verde en 10s + URL `https://elijahizar.github.io/animal-rescue/fr/` verificada (200 en home, ficha, infos, sitemap; redirect raíz y hotlinking de Commons OK)
- [ ] Cron diario (pendiente): añadir `schedule` al workflow → redeploy = re-ejecuta `fetch-rss` y actualiza noticias automáticamente

---

## Fase 3 — Documentación técnica, consistencia y calidad

> Objetivo: cerrar las brechas de documentación detectadas (README de plantilla, kickoff desactualizado, sin system design ni guías) para que cualquier sesión futura o agente pueda operar con calidad y consistencia. Todo aprobado por el usuario (2026-08-05).

### 3.1 System design (`docs/system-design.md`)
- [x] Arquitectura general (Astro SSG + islas React/Leaflet, sin backend)
- [x] Modelo de datos: colecciones `animals` / `regions` / `news` + schemas
- [x] Flujo de datos: RSS → `fetch-rss.mjs` → contenido estático → build → deploy
- [x] i18n (fr default, prefijo, redirect) y estructura por locale
- [x] Deploy GitHub Pages: base `/animal-rescue/`, workflow GH Actions, triggers
- [x] Rendimiento y decisiones técnicas clave (hotlinking Commons, lazy-load)

### 3.2 Guía de contenido (`docs/content-guidelines.md`)
- [x] Esquema completo de ficha animal (frontmatter, body, reglas de francés)
- [x] Cómo añadir una especie nueva (checklist: IUCN real, fotos Commons con crédito/licencia/URL 200, regiones lat/lng, causas de la taxonomía)
- [x] Cómo añadir/ajustar feeds RSS y keywords
- [x] Reglas de verificación de fuentes y calidad del francés

### 3.3 ADRs (`docs/adr/`)
- [x] ADR-0001 Stack: Astro SSG + React (Leaflet)
- [x] ADR-0002 i18n: fr default con prefijo + redirect
- [x] ADR-0003 Deploy: GitHub Pages (subpath) en vez de Cloudflare
- [x] ADR-0004 Imágenes: hotlinking Wikimedia Commons en lugar de `astro:assets`
- [x] ADR-0005 Noticias: RSS en build time (cron = redeploy)
- [x] ADR-0006 Privacidad: sin analítica, sin cookies

### 3.4 Actualizar `docs/session-kickoff.md`
- [x] Estado de referencia al día (Fase 2 completa, deploy GitHub Pages, cron pendiente)
- [x] Decisiones clave corregidas (GitHub Pages, hotlinking, 6 ONGs, cron pendiente)
- [x] Referencias a system-design y content-guidelines

### 3.5 Reescribir `README.md`
- [x] Qué es el proyecto, URL en producción
- [x] Comandos útiles (dev/build/fetch-news/deploy), estructura de carpetas
- [x] Enlaces a los docs

### 3.6 Coherencia `docs/plan.md` y `AGENTS.md`
- [x] `plan.md`: cron "desde el día 1" → pendiente; `astro:assets` → hotlinking; ONGs (añadir UICN Comité français)
- [x] `AGENTS.md`: enlazar system-design + content-guidelines como lecturas obligatorias

### 3.7 Cierre
- [x] `npm run build` + `astro check` sin errores
- [x] Commit + push (docs)

---

## Fase 4 — Revisión de diseño y fixes de la lista `/aide`

> Objetivo: revisar el diseño del sistema vs código, rediseñar la interfaz de
> filtros y cerrar bugs de renderizado detectados en la revisión (2026-08-05).

### 4.1 Verificación de `system-design.md` vs código
- [x] Documento fiel a la implementación (config, schemas, islas, RSS, deploy, i18n)
- [x] Hallazgos documentados en `system-design.md` (retención de noticias, `og:url`, `srcset`, OSM, a11y, fechas UTC)

### 4.2 Rediseño de chips de filtros (`/aide`)
- [x] `AnimalList.tsx`: chips color-coded por categoría vía CSS var `--chip-accent` (color de cada causa/estatus; continentes neutral forest)
- [x] `AnimalList.css`: base tintada, `hover` con tinte del color (`color-mix`), `:active` prensado, `:focus-visible` naranja, activo = verde bosque sólido + check `✓`

### 4.3 Fixes de bugs encontrados
- [x] **Fix scoping CSS**: los estilos de la isla React (`:global(...)` en `aide.astro`) se compilaban con `data-astro-cid-*` que la isla no lleva → nunca se aplicaban. Movidos a `src/components/AnimalList.css` e importados desde el componente (patrón de `AnimalMap.tsx` + leaflet)
- [x] **Fix doble slash**: `baseUrl` (`getRelativeLocaleUrl(locale, 'aide')`) terminaba en `/` y el template añadía `${slug}/` → `/fr/aide//{slug}/`. Corregido con `baseUrl.replace(/\/+$/, '')`
- [x] Verificación: build (41 páginas), `astro check` 0 errores, 0 selectores con `data-astro-cid`, fichas responden 200 en dev

### 4.4 Pendientes documentados (futuras sesiones)

> El backlog completo y priorizado está en **Fase 5** (SEO → a11y → perf → diseño → operación).

---

## Fase 5 — Mejoras priorizadas (backlog)

> Orden de prioridad recomendado (2026-08-05): correctitud/SEO → accesibilidad →
> rendimiento quick wins → diseño/contenido → operación. Cada ítem es independiente;
> marcar `[x]` al completarlo y anotar en la bitácora.

### 5.1 SEO — prioridad 1
- [ ] 1. `og:url` absoluto (`site` + `base` + path) en `aide/[slug].astro` y `infos/[slug].astro`
- [ ] 2. `rel=canonical` absoluto en todas las páginas (falta por completo hoy)
- [ ] 3. `og:image` en artículos de noticias (hoy solo las fichas de especie lo tienen)
- [ ] 4. `srcset` (320/640/800px) en tarjetas del home, `/aide` y galerías (reduce bytes en móvil, LCP)

### 5.2 Accesibilidad — prioridad 2
- [ ] 1. Fallback sin-JS en `/aide`: listado estático (SSG) + isla React que lo mejora
- [ ] 2. `aria-label`/`role` en el mapa (`/carte` y mini-mapa — hoy sin affordance semántica)
- [ ] 3. Contraste de los badges de estatus IUCN: texto oscuro sobre `#e9c46a` (VU) y colores claros (NT/LC) para cumplir WCAG
- [ ] 4. Enlace "Skip to content" + `:focus-visible` global en `global.css`

### 5.3 Rendimiento — prioridad 3 (quick wins)
- [ ] 1. `preconnect` a `upload.wikimedia.org` (hotlinking) y `tile.openstreetmap.org` (mapa)
- [ ] 2. `fetchpriority="high"` en la primera imagen visible de cada página

### 5.4 Diseño/contenido — prioridad 4
- [ ] 1. Hero con foto de sección en home (el plan pedía "fotos protagonistas"; hoy solo gradiente)
- [ ] 2. OG tags en home (hoy carecen de ellos)
- [ ] 3. Fechas en `news.ts`: cambiar `timeZone: 'UTC'` → `Europe/Paris` (las noticias de la noche se muestran con 1 día de desplazamiento en Francia)

### 5.5 Operación — prioridad 5
- [ ] 1. Cron diario: añadir `schedule` al workflow `deploy.yml`
- [ ] 2. Página 404 personalizada en francés

---

## Definición de listo (DoD) por sesión

- Todos los cambios compilados: `npm run build` sin errores
- Sin problemas de TypeScript
- El contenido en francés correcto
- Se actualiza este documento (marcar tareas, bitácora)
- Commit con mensaje descriptivo (convención: `feat:` / `fix:` / `chore:`)

## Comandos útiles

```bash
npm run dev          # servidor de desarrollo
npm run build        # build estático
npm run preview      # vista previa del build
npm run fetch-news   # fetch manual de RSS (cuando exista)
git status           # revisar antes de commits
```

## Bitácora de decisiones

| Fecha | Decisión |
|---|---|
| 2026-08-05 | Aprobado plan de producto completo (ver `docs/plan.md`) |
| 2026-08-05 | Repo `elijahizar/animal-rescue` clonado, primer commit |
| 2026-08-05 | Este plan de ejecución creado |
| 2026-08-05 | Islas interactivas: React · Rhinocéros noir (Diceros bicornis) · Dauphin commun (Delphinus delphis) |
| 2026-08-05 | FASE 0 completada: scaffold Astro v7 (minimal, TS strict) + shell visual (tokens, BaseLayout, header/footer) |
| 2026-08-05 | i18n: `src/i18n/index.ts`, rutas con prefijo `/fr/` (prefixDefaultLocale) + redirect `/` → `/fr/`, colecciones `src/content/{animals,news}/fr/` |
| 2026-08-05 | Licencias MIT + CC BY-SA 4.0 **omitidas** por decisión del usuario (marcadas como pendiente, no bloquean) |
| 2026-08-05 | FASE 1 (tracer bullet guépard) ejecutada. `content.config.ts` con loaders de `astro/loaders` (glob por locale) |
| 2026-08-05 | Decisiones de implementación: colección `regions` con campo `continent` (filtro de lista); galería con `src/author/page/licence`; `aider` markdown renderizado con `marked` |
| 2026-08-05 | Guépard: VU, ~6 500 individus matures, tendance en diminution (IUCN 2022); 6 fotos Commons verificadas (CC BY-SA / CC0) |
| 2026-08-05 | Leaflet 1.9 + react-leaflet 5 (React 19); mapas con `client:only="react"` (Leaflet no se ejecuta en SSR) |
| 2026-08-05 | `fetch-rss.mjs`: feeds operativos = UICN France, WWF France, Le Monde Planète (LPO: URL 404, pendiente verificar); 12 noticias iniciales filtradas por keywords |
| 2026-08-05 | Revisión Fase 1 aprobada por el usuario; sin ajustes (1.7 cerrado) |
| 2026-08-05 | FASE 2.1 completada: 10 fichas de especies (9 nuevas en este commit) + 36 regiones JSON. Estados IUCN verificados: tigre EN (2022), lion blanc VU, rhinocéros noir CR (~5 495), corail EN (Scleractinia, 2024), thon rouge LC (T. thynnus 2021), dauphin commun LC (subpoblación mediterránea EN), baleine bleue EN (Cooke 2018, 10-25k ind.), requin blanc VU (Rigby 2022), pingouin Humboldt VU (BirdLife 2020, ~32k ind.) |
| 2026-08-05 | Fotos de las 3 últimas fichas seleccionadas y verificadas (HTTP 200) vía API de Wikimedia Commons (15 thumbs a 1280px, licencias CC BY-SA/CC BY/PD) |
| 2026-08-05 | FASE 2.2-2.4: página `aider/` (acciones diarias + 6 ONGs), `apropos/`, `mentions-legales/`, `politique-de-confidentialite/`; blog INFOS completo (índice info + paginación 10/página + tags + artículo `/infos/[slug]`); home con especies à la une + últimas actualidades |
| 2026-08-05 | RSS: 6 feeds verificados operativos (UICN, WWF—vacío hoy, Le Monde, Reporterre, Sciences & Avenir, Tara Océan); FNE/LPO/Geo/Le Point = URL rotas/403. 17 noticias tras limpiar falsos positivos (word-boundary matching `\b`) |
| 2026-08-05 | FASE 2.5: sitemap + robots.txt (site placeholder `animal-rescue.pages.dev`); OG en fichas y noticias; lazy-load. `astro:assets` descartado: al optimizar 50 imágenes remotas en build, Wikimedia responde HTTP 429 (rate-limit por concurrencia) → builds lentos/frágiles para cron diario. Decisión: hotlinking de thumbs (1280px) de Commons + lazy-load |
| 2026-08-05 | FASE 2.6 preparada pero bloqueada en auth: wrangler 4.119.0 instalado, `npx wrangler whoami` → sin autenticar. Pendiente `npx wrangler login` del usuario para crear Pages project y conectar |
| 2026-08-05 | **CAMBIO DE PLAN (usuario)**: deploy v1 en GitHub Pages en vez de Cloudflare Pages. URL: `https://elijahizar.github.io/animal-rescue/` (subpath, sin dominio propio). `base: '/animal-rescue/'` + `site: https://elijahizar.github.io` en astro.config; redirect `/animal-rescue/` → `/animal-rescue/fr/` verificado en build |
| 2026-08-05 | Workflow `.github/workflows/deploy.yml` con triggers `push (main)` + `workflow_dispatch`. **Sin cron diario por ahora** (decisión del usuario: solo deploy en push; el `schedule` se añadirá en el futuro). build = npm ci + fetch-news + astro build + deploy-pages |
| 2026-08-05 | Pendiente del usuario para terminar 2.6: activar GitHub Pages en Settings → Pages → Source "GitHub Actions" (1 vez) |
| 2026-08-05 | **FASE 2 COMPLETADA**: deploy v1 verificado en producción — workflow `deploy-pages` verde (10s), URL `https://elijahizar.github.io/animal-rescue/fr/` con 200 en home/ficha/infos/sitemap; redirect `/animal-rescue/`→`/fr/` y hotlinking Commons OK. Pages ya estaba activado (`build_type: workflow`). Cron diario queda como mejora futura (decisión: solo push por ahora) |
| 2026-08-05 | **FASE 3 planificada** (usuario: "incluye todo"): documentación técnica y calidad — system-design.md, content-guidelines.md, ADRs (6), actualizar session-kickoff/README/plan.md, AGENTS.md con enlaces. Pendiente de ejecución |
| 2026-08-05 | **FASE 3 COMPLETADA**: creados `docs/system-design.md` (arquitectura, datos, flujo RSS, deploy, rendimiento) y `docs/content-guidelines.md` (esquema de ficha, fotos Commons, regiones, feeds, checklists); 6 ADRs en `docs/adr/README.md`; `session-kickoff.md` al día; README reescrito (proyecto real); `plan.md` coherente (cron pendiente, hotlinking, feeds verificados); AGENTS.md con lecturas obligatorias. Build + check limpios |
| 2026-08-05 | Verificación de diseño (`system-design.md` vs código): doc fiel a la implementación. Hallazgos documentados: retención de noticias (30/ejecución, acumulación sin poda — decisión: URLs estables), `og:url` absoluto pendiente, `srcset` pendiente en tarjetas, riesgos OSM/a11y/fechas UTC. |
| 2026-08-05 | Diseño de filtros `/aide` definido e **implementado**: chips color-coded por categoría (causa/estatus usan su token de color como borde vía `--chip-accent`, continentes neutral forest), activo = verde bosque sólido + `✓`, hover tinte suave (`color-mix`), `:focus-visible` naranja, `:active` prensado. Build + check limpios. |
| 2026-08-05 | **FIX scoping CSS**: los estilos de `AnimalList` estaban en `aide.astro` con `.animal-list :global(...)` → Astro los compilaba como `.animal-list[data-astro-cid-*]`, pero la isla React renderiza ese div en cliente sin el atributo → **nunca se aplicaban** (chips, buscador y tarjetas se veían como HTML por defecto; bug preexistente). Solución: mover los estilos a `src/components/AnimalList.css` importado dentro del componente (mismo patrón que `AnimalMap.tsx` + leaflet.css) y eliminar el bloque `<style>` de `aide.astro`. Verificado: 0 selectores con `data-astro-cid`, 21 reglas globales aplicándose. |
| 2026-08-05 | **FIX URLs**: los enlaces de las tarjetas de `/aide` se generaban como `/fr/aide//{slug}/` (doble slash): `baseUrl` de `getRelativeLocaleUrl(locale, 'aide')` termina en `/` y el template añadía `${slug}/`. Corregido con `baseUrl.replace(/\/+$/, '')` en `AnimalList.tsx`. Página de especie responde 200. |
