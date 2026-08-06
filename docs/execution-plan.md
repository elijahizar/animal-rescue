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
- Next: **Fase 5 (backlog priorizado)**: SEO **5.1 COMPLETADA** (og:url absoluto, canonical, og:image noticias, srcset) → a11y (fallback sin-JS, mapa, contraste badges, skip-link) → rendimiento (preconnect, fetchpriority) → diseño/contenido (hero foto, OG home, fechas Europe/Paris) → operación (cron diario, 404)
- **SESIONES PLANIFICADAS (2026-08-06)**: **Fase 6** = añadir 20 animales en peligro de extinción del Perú (lista aprobada por el usuario) + **Fase 7** = migrar todas las imágenes a self-hosted con `astro:assets` (decisión Opción A: descarga local + schema `image()`, migrar también las 10 fichas actuales). Plan tareas en las fases 6 y 7.

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
- [x] 1. `og:url` absoluto (`site` + `base` + path) en `aide/[slug].astro` y `infos/[slug].astro` (helper `src/lib/urls.ts` → `siteUrl()`)
- [x] 2. `rel=canonical` absoluto en todas las páginas (en `BaseLayout` vía `Astro.url.pathname`; el helper normaliza si el pathname ya incluye la base)
- [x] 3. `og:image` en artículos de noticias (decisión del usuario: imagen genérica de marca `public/og-news.svg` — opción A; sin extraer imágenes de feeds)
- [x] 4. `srcset` (500/960px — tamaños estándar de Wikimedia T414805) en tarjetas del home, `/aide` y galerías (helper `commonsSrcset()` en `src/lib/urls.ts`, reescribe el sufijo `1280px-` de las thumbs de Commons; valida contra `WIKIMEDIA_THUMB_STEPS`)

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

## Fase 6 — 20 animales en peligro de extinción del Perú

> **Objetivo**: ampliar el catálogo con 20 especies peruanas (de CR a VU).
> **Lista aprobada por el usuario (2026-08-06)**. Contenido 100% en francés
> siguiendo `docs/content-guidelines.md` (secciones 2 y 3). Independiente de la
> Fase 7 (imágenes): las fichas se crean con URLs de Commons (hotlink) y la Fase 7
> las migra a self-hosted con `astro:assets`.

### 6.1 Las 20 especies (lista aprobada)

| # | Slug (fr) | Nom (fr) | Scientifique | IUCN vér. | Éval. | Hábitat |
|---|---|---|---|---|---|---|
| 1 | `ours-a-lunettes` | Ours à lunettes | *Tremarctos ornatus* | VU | 2017 | Andes |
| 2 | `condor-des-andes` | Condor des Andes | *Vultur gryphus* | VU | 2020 | Andes |
| 3 | `chat-des-andes` | Chat des Andes | *Leopardus jacobita* | EN | 2024 | Puna |
| 4 | `loutre-marine` | Loutre marine | *Lontra felina* | EN | 2015 | Côte |
| 5 | `loutre-geante` | Loutre géante | *Pteronura brasiliensis* | EN | 2015 | Amazonie |
| 6 | `dauphin-rose-amazonie` | Dauphin rose de l'Amazone | *Inia geoffrensis* | EN | 2018 | Amazonie |
| 7 | `lamantin-amazonie` | Lamantin de l'Amazone | *Trichechus inunguis* | VU | 2016 | Amazonie |
| 8 | `singe-choro-queue-jaune` | Singe choro à queue jaune | *Lagothrix flavicauda* | CR | 2021 | Endémique (Andes nord) |
| 9 | `singe-tocon-san-martin` | Singe tocón de San Martín | *Plecturocebus oenanthe* | CR | 2020 | Endémique |
| 10 | `singe-araignee-noir` | Singe araignée noir | *Ateles chamek* | EN | 2016 | Amazonie |
| 11 | `tapir-terrestre` | Tapir terrestre | *Tapirus terrestris* | VU | 2018 | Amazonie |
| 12 | `tapir-des-andes` | Tapir des Andes | *Tapirus pinchaque* | EN | 2016 | Andes du Nord |
| 13 | `harpie-feroce` | Harpie féroce | *Harpia harpyja* | VU | 2021 | Amazonie |
| 14 | `grand-fourmilier` | Grand fourmilier | *Myrmecophaga tridactyla* | VU | 2024 | Amazonie |
| 15 | `grebe-titicaca` | Grèbe du Titicaca | *Rollandia microptera* | EN | 2020 | Lac Titicaca |
| 16 | `pava-aliblanca` | Pava à ailes blanches | *Penelope albipennis* | EN | 2018 | Endémique (Nord-Ouest) |
| 17 | `perruche-tumbes` | Perruche de Tumbes | *Brotogeris pyrrhoptera* | VU | 2021 | Tumbes |
| 18 | `grenouille-titicaca` | Grenouille géante du lac Titicaca | *Telmatobius culeus* | EN | 2020 | Lac Titicaca |
| 19 | `crocodile-tumbes` | Crocodile de Tumbes | *Crocodylus acutus* | VU | 2022 | Mangroves de Tumbes |
| 20 | `tortue-imbriquee` | Tortue imbriquée | *Eretmochelys imbricata* | CR | 2008 | Côtes du Nord (nidification) |


> **Estatus IUCN verificados en línea** el 2026-08-06. Cambios vs. la lista
> prelver: la pava es **EN** (no CR, bajada en 2018); la perruche de Tumbes es
> **VU** (bajada del EN en 2021); la grenouille du Titicaca es **EN** (no CR,
> actualización 2020); el pudú fue sustituido por el **grèbe du Titicaca** (EN).
> Tapirus pinchaque = EN. Tapir terrestris = VU.

### 6.2 Pasos por especie (checklist sección 5 de `content-guidelines.md`)
- [x] Crear `src/content/animals/fr/{slug}.md`: frontmatter (slug, name, scientificName, iucnStatus, gallery con `src/author/page/licence/alt`, `causes` de `src/lib/causes.ts`, `aider` markdown, `regions`, `tags` en francés)
- [x] Body en 2 párrafos: párrafo 1 = presentación naturalista (tamaño, hábitat, alimentación, curiosidad); párrafo 2 = estado de conservación citando **IUCN + evaluación/año**, población estimada, tendencia y amenazas; estatus en **negrita** la primera vez
- [x] Seleccionar 3-6 fotos de Wikimedia Commons con licencia libre (CC BY/CC BY-SA/CC0/PD), thumbs `1280px-...`, verificar URL con `curl -I` (HTTP 200) y crédito completo — **excepción**: permitir 2 fotos (no < 2) para taxa oscuros si la cobertura libre de Commons es insuficiente (chat des Andes, tocón, pava aliblanca, grenouille du Titicaca)
- [x] Crear 2-5 regiones `src/content/regions/fr/{slug}-{zona}.json` (lat/lng del centro de la zona, `continent: "Amérique du Sud"` o "Océans" para spp marinas). Para spp de rango amplio (cocodrilo de Tumbes, tortue imbriquée) acotar las regiones a la franja costera peruana y explicárlo en el body (población peruana, no especie entera)
- [x] Usar SOLO las causas de la taxonomía (`src/lib/causes.ts`)
- [x] `tags` sugeridos: ej. `perou`, `amazonie`, `andes`, `mammifere`, `oiseau`, `reptile`, `cote`
- [x] Añadir la especie a `KEYWORDS` de `scripts/fetch-rss.mjs` (nombre común fr + científico) para que el blog INFOS pesque noticias sobre ella — sin esto no recibe artículos

### 6.3 Sugerencia de `causes` por especie (revisar en creación)
- Andes (ours, condor, chat des Andes, pudú, tapir des Andes): `perte-habitat`, `braconnage` (si aplica)
- Amazonie (loutre géante, dauphin rose, lamantin, singes, tapir terrestre, harpie, grand fourmilier): `deforestation`, `trafic-especes` (primates), `pollution` (dauphin)
- Côte/mer (loutre marine, crocodile de Tumbes, tortue imbriquée): `pollution`, `surpeche` (tortue), `changement-climatique`
- Endémicas críticas (mono choro, tocón, pava, grenouille du Titicaya): `perte-habitat` + situación local
- Titicaca: `pollution`, `especes-invasives` (truite arc-en-ciel)
- Recordar: markers del CARTE y mini-mapas salen solos de `regions`; verificar cobertura final

### 6.4 Verificación final Fase 6
- [x] `npm run build` (0 errores) + `npx astro check` (0 errores)
- [x] Revisión de varias fichas nuevas en `npm run dev` (galería, badge, mini-mapa, causas, créditos)
- [ ] Actualizar `docs/plan.md` (evolucionar el conteo de especies/detoices si procede) — **preguntar al usuario antes de cambiar `plan.md`** (no se cambia sin su aprobación)
- [x] Actualizar este plan de ejecución (checkboxes + bitácora)

---

## Fase 7 — Imágenes self-hosted con `astro:assets` (migración completa)

> **Contexto / decisión (2026-08-06, Opción A aprobada):** acabar con el hotlinking
> de Wikimedia (ADR-0004 quedó superado). Descargar TODAS las imágenes una vez
> (las 20 nuevas de la Fase 6 + las 10 fichas actuales) a `src/assets/species/`,
> cambiar el schema de la colección a `image()` y renderizarlas con el componente
> `<Image>` de `astro:assets` (webp + responsive automático, optimización LOCAL en
> build → sin HTTP 429 de Wikimedia).
>
> ⚠️ Implicación del schema único: `gallery` se comparte para todas las spp; si
> se cambia a `image()`, todas las fichas (incluidas las 10 actuales) deben usar
> local. **Migrar también las 10 existentes** (mismo script, sus thumbs ya están
> seleccionadas). **~40 imágenes extra, bajo riesgo.**

### 7.1 Script de descarga `scripts/fetch-species-images.mjs` (nuevo)
- [ ] Leer todos los `src/content/animals/fr/*.md` y extraer `gallery[].src`
- [ ] Descargar cada thumb **1280px** a `src/assets/species/{slug}/{i}.jpg` **secuencial con pausa ~300 ms** (límite de rate de Wikimedia), verificar `HTTP 200`, saltar errores, idempotente (no redescarga si existe)
- [ ] Reescribir el frontmatter: `src: <url>` → `image: ../../assets/species/{slug}/{i}.jpg` (ruta relativa desde `src/content/animals/fr/`), conservando `author/page/licence/alt`
- [ ] Añadir script npm `"fetch-images": "node scripts/fetch-species-images.mjs"` en `package.json`

### 7.2 Schema (`src/content.config.ts`)
- [ ] Cambiar `gallery[].src: z.string()` → `gallery[].image: image()` (helper de `astro:content`, resuelve rutas relativas que apunten dentro de la carpeta de contenido)
- [ ] Regenerar tipos: `npx astro sync`

### 7.3 Consumo en componentes (usar el componente `<Image>` de `astro:assets`)
- [ ] `src/pages/fr/aide/[slug].astro`: `<img src={photo.src} srcset={commonsSrcset(photo.src)}>` → `<Image src={photo.image} ...>`; `heroImage` para og:image → `siteUrl(photo.image.src)` absoluto
- [ ] `src/pages/fr/index.astro`: hero (mantener `fetchpriority`) y tarjetas destacadas con `<Image>`
- [ ] `src/pages/fr/aide.astro` + `AnimalList.tsx`: pasar `image: gallery[0].image.src` (string ya procesado) a la isla React; en la tarjeta `<img src>` simple (sin srcset)
- [ ] Revisar el footer/CARTE por si referencia `gallery[].src` (verificar con `grep`)

### 7.4 Limpieza del hotlinking
- [ ] En `src/lib/urls.ts`: eliminar `commonsSrcset` y `WIKIMEDIA_THUMB_STEPS`; conservar `siteUrl`
- [ ] Quitar todos los usos de `commonsSrcset` (home, ficha, AnimalList) y sus importaciones

### 7.5 Docs (tras validación)
- [ ] Actualizar `docs/content-guidelines.md` sección 2.3: imágenes LOCALES en `src/assets/species/`, flujo → `npm run fetch-images`, render con `astro:assets`; actualizar checklist sección 5 (foto: archivo local + crédito autor/page/licence en la ficha)
- [ ] ADR-0004: marcar como "Superseded" y crear ADR-0007 `self-hosted + astro:assets` (justificación: se evita el 429 porque la descarga es 1 vez y no en cada build; repo +~40 MB aceptable para cron frecuente)
- [ ] Actualizar `docs/system-design.md` (flujo de imágenes) y revisar `docs/plan.md` — pedir aprobación si cambia decisiones de `plan.md`
- [x] Actualizar este plan de ejecución (checkboxes + bitácora)

### 7.6 Validación Fase 7
- [x] `npm run build` (0 errores) + `npx astro check` (0 errores)
- [ ] `npm run preview` o deploy local: verificar og:image absolutos, hero, tarjetas y galería con las nuevas URLs locales
- [ ] Confirmar que NO hay ninguna referencia `upload.wikimedia.org` en el build final (`grep -r upload.wikimedia dist/` → vacío)
- [ ] Revisar en `npm run dev` una ficha antigua y una nueva (galería, crédito, mapa)

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
| 2026-08-05 | Commit Fase 4 (58466e7) + push a main: rediseño de chips, fix scoping CSS, fix doble slash. |
| 2026-08-05 | **FASE 5.1 SEO COMPLETADA**: helper `src/lib/urls.ts` (`siteUrl()` = site + base + path con normalización de base duplicada; `commonsSrcset()` = reescribe sufijo `1280px-` de thumbs Commons a 320/640/800px). `og:url` absoluto en fichas y noticias; `rel=canonical` en `BaseLayout` (todas las páginas); `og:image` genérica `public/og-news.svg` en noticias (opción A, decisión del usuario); `srcset` en home, tarjetas `/aide` (isla React con `srcSet` camelCase) y galerías. Verificado: canonical `https://elijahizar.github.io/animal-rescue/fr/...`, build 41 páginas, `astro check` 0 errores. |
| 2026-08-05 | **REGRESIÓN 5.1 en producción y fix**: Wikimedia cambió su política de thumbs (T414805, 2025-2026): solo genera tamaños estándar (20/40/60/120/250/330/500/960/1280/1920/3840px) y rechaza los demás con HTTP 400. Los `srcset` con 320/640/800px rompieron TODAS las imágenes (el navegador elige del `srcset`, no del `src`). Fix: `commonsSrcset` ahora usa [500, 960] (estándar, < 1280) y valida contra `WIKIMEDIA_THUMB_STEPS` para nunca emitir anchos no permitidos. Verificado: 500/960 → HTTP 200 en producción. |
| 2026-08-06 | **Sesiones planificadas (usuario)**: añadir 20 animales en peligro de extinción del **Perú** (lista aprobada, ver Fase 6) + migrar **todas** las imágenes a self-hosted con `astro:assets` (decisión Opción A, ver Fase 7). Se escriben en este plan de ejecución para ejecutarse en una nueva sesión. |
| 2026-08-06 | **Fase 6 (plan)**: 20 fichas nuevas en francés (5 CR, 7 EN, 8 VU) + ~50-70 regiones de Perú. Estatus IUCN provisorios a re-verificar en la UICN. |
| 2026-08-06 | **Fase 7 (plan)**: fin del hotlinking de Wikimedia (ADR-0004 quedaría "Superseded", nuevo ADR-0007). Script `fetch-species-images.mjs` descarga 1 sola vez a `src/assets/species/`, schema `gallery[].image: image()`, render `<Image>`. Se migran también las 10 fichas actuales (schema único). |
| 2026-08-06 | **Fase 6 — Batch 1 (commit `5d7b9ad`)**: 5 fichas Andes/Titicaca (ours, condor, chat, tapir des Andes, grèbe) + 10 regiones + docs (execution-plan, content-guidelines renumerado, secciones 5→6,6→7). Build 51 páginas, check 0 errores. |
| 2026-08-06 | **Fase 6 — Batch 2 (commit `2f49e6b`)**: 5 fichas Amazonie (loutre marine, loutre géante, dauphin rose, lamantin, tapir terrestre) + 11 regiones. Fotos verificadas HTTP 200, autores resueltos (d:Q54800218 = Charles J. Sharp). Build 56 páginas. |
| 2026-08-06 | **Fase 6 — Batch 3 (commit `1d59591`)**: 5 fichas (singe choro, tocón, singe-araignée, harpie, grand fourmilier) + 11 regiones. Fix YAML `aider: >-`. Build 56 páginas, check 0 errores. |
| 2026-08-06 | **Fase 6 — Batch 4 (commit `2c548cb`)**: 5 fichas (pava aliblanca, perruche de Tumbes, grenouille du Titicaca, crocodile de Tumbes, tortue imbriquée) + 10 regiones. 15 URLs verificadas HTTP 200. Build 61 páginas, check 0 errores. |
| 2026-08-06 | **Fase 6 — cierre**: ampliados `KEYWORDS` (fetch-rss.mjs) con las 20 especies nuevas + `NEWS_TAG_LABELS` (src/lib/news.ts). Checkboxes 6.2/6.4 marcados. Revisión ficha a ficha de corrupciones (pava, grenouille, etc.). |
