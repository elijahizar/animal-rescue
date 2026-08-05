# Animal Rescue — Plan v1

Aplicación web para ayudar a salvar animales en peligro de extinción. Contenido en francés, multilingüe en el futuro.

## Decisiones acordadas

**Stack**
- Astro (SSG) + islas interactivas (Leaflet, filtros/búsqueda)
- Cloudflare Pages, subdominio gratuito
- Cron diario = redeploy del sitio
- Fetch de RSS en build time (script `fetch-rss.mjs` antes del build)
- Sin backend, sin analítica, sin cookies

**Contenido** (100% curado en francés, híbrido con IUCN Red List como referencia)
- 10 especies iniciales: corail, tigre, rhinocéros, lion blanc, pingüino de Humboldt, thon rouge, dauphin, baleine bleue, guépard, requin blanc
- Nota: corail y thon rouge son grupos (no especies únicas) — se modelan como entrada con subespecies en el texto
- Fichas en Content Collections por locale: nombre, nombre científico, estatus IUCN (badge), galería (3-6 fotos de Wikimedia Commons con crédito), descripción, causas (taxonomía reutilizable), cómo ayudar, regiones `lat/lng` compartidas con el mapa
- Taxonomía de causas: déforestation, braconnage, pollution, changement climatique…
- Noticias: feeds RSS francófonos, filtrado por keywords, últimas 30, blog con paginación y tags

**News (INFOS)**
- Automatización desde el día 1: cron diario (redeploy Cloudflare) dispara `fetch-rss.mjs`
- Keyword matching automático para filtrar ruido
- Retención: últimas 30 noticias
- Blog tipo con paginación y búsqueda por tag

**i18n**
- Astro `src/i18n`, `fr` por defecto, estructura de Content Collections por locale
- Marca "Animal Rescue" universal en todos los idiomas + subtítulo localizado
- Implementar arquitectura i18n desde el día 1 aunque solo exista contenido `fr`

**Diseño** (nada definido aún, se propone)
- Moderno/vibrante, verde bosque como primario, crema, acento naranja para CTAs

**Extras**
- OG tags + social sharing en las fichas
- Lazy-load + optimización de imágenes con `astro:assets`
- Páginas legales: mentions légales + politique de confidentialité (sin cookies → sin banner)
- Página `aider/` glogal: acciones diarias + ONGs con enlaces externos (sin donaciones)

## Páginas

- `/` → Inicio: hero, especies destacadas, últimas noticias
- `/aide/` → Lista de animales con filtros por chips (causa, estatus IUCN, continente) + búsqueda de texto
- `/aide/[slug]/` → Ficha del animal: fotos, descripción, causas, cómo ayudar, mini-mapa de su zona
- `/infos/` → Noticias (blog): feed RSS filtrado, paginación, tags
- `/carte/` → Mapa mundial Leaflet + OpenStreetMap, markers agrupados por región, popup → ficha
- `/aider/` → Cómo ayudar a nivel global (acciones ciudades, ONGs)
- `/apropos/` → Misión del proyecto
- `/mentions-legales/`, `/politique-de-confidentialite/` → Legal

## Feeds RSS francófonos candidatos (verificar URLs en implementación)

- Comité français de l'UICN
- WWF France
- Le Monde — Planète/Climat
- France Nature Environnement (FNE)
- Geo
- Sciences & Avenir / Le Point (environnement)
- Fondation Tara Océan
- LPO (Ligue pour la Protection des Oiseaux)

Pool amplio porque el cron filtra por keywords (tigre, corail, guépard, baleine…). Empezar con 5-8 fuentes y ajustar tras ver volumen diario de noticias filtradas.

## Orden de implementación

1. Scaffold de Astro
2. i18n (fr default, estructura por locale)
3. Modelo de datos + 10 fichas (Content Collections)
4. AIDE — lista (filtros + búsqueda) y ficha (con mini-mapa)
5. CARTE — Leaflet + OSM mundial
6. INFOS — `fetch-rss.mjs` + blog con paginación/tags
7. `aider/`, `apropos/`, legal
8. OG tags + optimización de imágenes
9. Despliegue en Cloudflare Pages (subdominio gratuito)