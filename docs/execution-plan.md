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
- Next: etapas siguientes (ver propuesta al final de la sesión) — cron diario de redeploy, mejoras de contenido/SEO o i18n

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
- [x] Cron diario (futuro, no incluido por decisión del usuario: solo deploy en push): añadir `schedule` al workflow → redeploy = re-ejecuta `fetch-rss`

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
