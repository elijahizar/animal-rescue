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
- Next: FASE 1 — tracer bullet (ficha guépard). Validar con el usuario antes de continuar.

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
- [ ] Colección `animals` — schema: slug, nombre (fr), nombre scientifique, statut IUCN (enum CR/EN/VU/NT/LC + color badge), galería `[{src, crédit, licence}]`, description (markdown), causes (array de la taxonomía), comment aider (markdown), regiones (ids → colección `regions`), tags
- [ ] Colección `regions` — schema: id, animalId, label (fr), lat, lng
- [ ] Colección `news` — schema: slug, título, fecha, url fuente, tag animal, excerpt
- [ ] Taxonomía de causas en constantes compartidas (fr): déforestation, braconnage, pollution, changement climatique, perte d'habitat, surpêche, espèces invasives, trafic d'espèces
- [ ] Rutas de contenido por locale (`src/content/animals/fr/`, `src/content/news/fr/`)

### 1.2 Contenido del guépard (Acinonyx jubatus)
- [ ] Ficha completa en francés: descripción (~2 párrafos), causas (taxonomía), cómo ayudar (acciones concretas)
- [ ] 4-6 fotos de Wikimedia Commons (verificar licencia libre y autor para crédito)
- [ ] Regiones `lat/lng` (África subsahariana, Irán — población asiática)
- [ ] Verificar estadísticas IUCN reales (población estimada, tendencia)

### 1.3 Página ficha `/aide/guépard/`
- [ ] Galería de fotos con créditos visibles
- [ ] Badge de estatus IUCN con color
- [ ] Causas con iconos
- [ ] Sección "Comment aider" (específica de la especie)
- [ ] Mini-mapa Leaflet con la zona de distribución
- [ ] OG tags + social sharing en esta página

### 1.4 Página lista `/aide/`
- [ ] Tarjetas de animal (foto, nombre, estatus, continente)
- [ ] Filtros por chips: causa, estatus IUCN, continente
- [ ] Búsqueda por texto (nombre, nombre científico)
- [ ] Isla interactiva React (según decisión: React + Leaflet)

### 1.5 CARTE mínimo
- [ ] Leaflet + OpenStreetMap (sin API key) en página `/carte/`
- [ ] Markers del guépard, popup → enlace a la ficha
- [ ] Mapa mundial

### 1.6 INFOS mínimo (validación RSS)
- [ ] Script `fetch-rss.mjs` local: descarga 1-2 feeds, parseo XML, filtro por keywords (guépard, tigre, corail, baleine, IUCN…), salida a datos
- [ ] Ejecución manual `npm run fetch-news` y verificación de salida
- [ ] NOTA: el cron diario se configura en Fase 2 (Cloudflare)

### 1.7 Validación y revisión
- [ ] Revisión con el usuario: diseño, tono, estructura de la ficha
- [ ] Ajustes
- [ ] Commit: `feat: tracer bullet — ficha guépard + lista + mapa + rss`

---

## Fase 2 — Contenido completo y pulido

### 2.1 Las 9 especies restantes
- [ ] corail (grupo — entrada con subespecies en el texto)
- [ ] tigre (Panthera tigris)
- [ ] rhinocéros noir (Diceros bicornis)
- [ ] lion blanc (Panthera leo — nota: no es especie, es morfo de color; redactar con precisión)
- [ ] pingüino de Humboldt (Spheniscus humboldti)
- [ ] thon rouge (grupo — entrada con subespecies)
- [ ] dauphin commun (Delphinus delphis)
- [ ] baleine bleue (Balaenoptera musculus)
- [ ] requin blanc (Carcharodon carcharias)
- [ ] Cada ficha: fotos Commons con crédito, regiones lat/lng, causas de taxonomía, cómo ayudar

### 2.2 Página `aider/` (global)
- [ ] Acciones diarias (consumo, alimentación, transporte…)
- [ ] Lista de ONGs: WWF France, Greenpeace France, LPO, Sea Shepherd France, Fondation Nicolas Hulot, Comité français de l'UICN (enlaces externos, nuevo tab; SIN enlaces de donación)

### 2.3 Páginas `apropos/` + legal
- [ ] `apropos/`: misión, valores, qué hacemos
- [ ] `mentions-legales/`: editor, hébergeur (Cloudflare)
- [ ] `politique-de-confidentialite/`: sin recogida de datos, sin cookies

### 2.4 INFOS completo (blog)
- [ ] `fetch-rss.mjs` final: 5-8 feeds francófonos (ver lista en `docs/plan.md`)
- [ ] Verificar URLs RSS reales de cada feed
- [ ] Blog `/infos/` con paginación (últimas 30)
- [ ] Tags por especie/animal y búsqueda por tag

### 2.5 Optimizaciones
- [ ] `astro:assets` para todas las imágenes (AVIF/WebP, lazy-load)
- [ ] OG tags + social sharing en todas las fichas y noticias
- [ ] SEO básico (meta, sitemap, robots)

### 2.6 Despliegue Cloudflare Pages
- [ ] Conectar repo a Cloudflare Pages (subdominio gratuito `animal-rescue.pages.dev` o similar)
- [ ] Configurar build: `npm run build`, salida `dist/`
- [ ] Cron diario: webhook/scheduled build que dispara redeploy → `fetch-rss.mjs` en build time
- [ ] Probar deploy y actualización de noticias
- [ ] Commit final + tags/release si aplica

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
