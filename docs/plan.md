# Animal Rescue — Plan v1

Aplicación web para ayudar a salvar animales en peligro de extinción. Contenido en francés, multilingüe en el futuro.

## Decisiones acordadas

**Stack**
- Astro (SSG) + islas interactivas React (Leaflet, filtros/búsqueda)
- GitHub Pages (proyecto en subpath `https://elijahizar.github.io/animal-rescue/`) — **deploy v1, decisión 2026-08-05**; Cloudflare Pages quedó descartado
- Cron diario = redeploy del sitio — **pendiente** (por ahora solo deploy en push; añadir schedule + deploy webhook en el futuro)
- Fetch de RSS en build time (script `fetch-rss.mjs` antes del build)
- Sin backend, sin analítica, sin cookies

**Contenido** (100% curado en francés, híbrido con IUCN Red List como referencia)
- 30 especies en francés: las 10 iniciales (corail, tigre, rhinocéros noir, lion blanc, pingüino de Humboldt, thon rouge, dauphin commun, baleine bleue, guépard, requin blanc) + 20 especies en peligro del Perú (Fase 6, 2026-08-06): ours à lunettes, condor des Andes, chat des Andes, loutre marine, loutre géante, dauphin rose de l'Amazone, lamantin de l'Amazone, singe choro à queue jaune, singe tocón de San Martín, singe-araignée noir, tapir terrestre, tapir des Andes, harpie féroce, grand fourmilier, grèbe du Titicaca, pava à ailes blanches, perruche de Tumbes, grenouille du Titicaca, crocodile de Tumbes, tortue imbriquée
- Nota: corail y thon rouge son grupos (no especies únicas) — se modelan como entrada con subespecies en el texto
- Fichas en Content Collections por locale: nombre, nombre científico, estatus IUCN (badge), galería (3-6 fotos con crédito, descargadas de Wikimedia Commons y alojadas localmente — ADR-0007), descripción, causas (taxonomía reutilizable), cómo ayudar, regiones `lat/lng` compartidas con el mapa
- Taxonomía de causas: déforestation, braconnage, pollution, changement climatique…
- Noticias: feeds RSS francófonos, filtrado por keywords, últimas 30, blog con paginación y tags

**News (INFOS)**
- Importación en build time: `fetch-rss.mjs` antes de cada build (cron diario = redeploy, **pendiente** — hoy solo push a `main`)
- Keyword matching automático con límites de palabra para filtrar ruido
- Retención: últimas 30 noticias (archivos estables, no se sobrescriben)
- Blog con paginación (10/página) y tags por especie

**i18n**
- Astro `src/i18n`, `fr` por defecto, estructura de Content Collections por locale
- Marca "Animal Rescue" universal en todos los idiomas + subtítulo localizado
- Implementar arquitectura i18n desde el día 1 aunque solo exista contenido `fr`

**Diseño** (nada definido aún, se propone)
- Moderno/vibrante, verde bosque como primario, crema, acento naranja para CTAs

**Extras**
- OG tags + social sharing en las fichas y noticias
- Lazy-load con imágenes self-hosted en `src/assets/species/` + `astro:assets` (webp responsivo, ver ADR-0007, que reemplaza el hotlinking de Wikimedia del ADR-0004)
- Páginas legales: mentions légales + politique de confidentialité (sin cookies → sin banner)
- Página `aider/` global: acciones diarias + ONGs con enlaces externos (sin donaciones)

## Páginas

- `/` → Inicio: hero, especies destacadas, últimas noticias
- `/aide/` → Lista de animales con filtros por chips (causa, estatus IUCN, continente) + búsqueda de texto
- `/aide/[slug]/` → Ficha del animal: fotos, descripción, causas, cómo ayudar, mini-mapa de su zona
- `/infos/` → Noticias (blog): feed RSS filtrado, paginación, tags
- `/carte/` → Mapa mundial Leaflet + OpenStreetMap, markers agrupados por región, popup → ficha
- `/aider/` → Cómo ayudar a nivel global (acciones ciudades, ONGs)
- `/apropos/` → Misión del proyecto
- `/mentions-legales/`, `/politique-de-confidentialite/` → Legal

## Feeds RSS francófonos (verificados en implementación)

Operativos: Comité français de l'UICN, WWF France, Le Monde — Planète,
Reporterre, Sciences & Avenir, Fondation Tara Océan.
Descartadas por URL rota/403: FNE, Geo, LPO, Le Point.

Pool amplio porque el build filtra por keywords (tigre, corail, guépard, baleine…).
Ajustar tras ver el volumen de noticias filtradas por build.

## Orden de implementación

1. Scaffold de Astro
2. i18n (fr default, estructura por locale)
3. Modelo de datos + 10 fichas (Content Collections)
4. AIDE — lista (filtros + búsqueda) y ficha (con mini-mapa)
5. CARTE — Leaflet + OSM mundial
6. INFOS — `fetch-rss.mjs` + blog con paginación/tags
7. `aider/`, `apropos/`, legal
8. OG tags + optimización de imágenes
9. Despliegue en GitHub Pages (subpath, workflow GH Actions, base `/animal-rescue/`)