# Animal Rescue

Aplicación web para ayudar a salvar animales en peligro de extinción. Contenido
100% en francés (multilingüe en el futuro). Sitio estático con Astro, sin backend,
sin analítica, sin cookies.

**En producción**: https://elijahizar.github.io/animal-rescue/fr/

## Qué incluye

- **Fichas de 10 especies** amenazadas (estatus IUCN, causas, cómo ayudar,
  galería con créditos, mini-mapa de distribución)
- **Mapa mundial interactivo** (Leaflet + OpenStreetMap)
- **Blog de noticias** alimentado por 6 feeds RSS francófonos (UICN France, WWF,
  Le Monde Planète, Reporterre, Sciences & Avenir, Tara Océan) actualizado en
  cada build
- **Páginas** Aider / À propos / legal (mentions légales, politique de
  confidentialité)

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor local (localhost:4321/animal-rescue/)
npm run build      # build estático en dist/
npm run preview    # previsualizar el build
npm run fetch-news # importar noticias RSS (se ejecuta en el CI antes del build)
npm run deploy     # fetch-news + build (el push a main despliega vía GitHub Actions)
npx astro check    # chequeo de tipos/TS
```

## Estructura

```
.github/workflows/deploy.yml   pipeline (push a main → GitHub Pages)
docs/                          plan, execution-plan, system-design, content-guidelines, adr/
public/                        favicon, robots.txt
scripts/fetch-rss.mjs          importación de noticias desde RSS
src/
  components/                  Header, Footer, Causes, AnimalMap (React), AnimalList (React)
  content/                     animales, regiones y noticias por locale (fr)
  content.config.ts            schemas Zod + loaders
  i18n/                        configuración de locale
  layouts/BaseLayout.astro     layout raíz
  lib/                         causas, estatus IUCN, helpers de noticias
  pages/fr/                    rutas públicas (home, aide, infos, carte, aider, apropos, legal)
  styles/global.css            tokens de diseño
```

## Documentación

- `docs/plan.md` — decisiones de producto
- `docs/execution-plan.md` — plan de ejecución con estado y bitácora
- `docs/system-design.md` — arquitectura y modelo de datos
- `docs/content-guidelines.md` — estándar de contenido (cómo añadir especies)
- `docs/adr/README.md` — decisiones técnicas (ADR)

## Despliegue

GitHub Pages (subpath `/animal-rescue/`). El workflow `.github/workflows/deploy.yml`
compila y publica en cada push a `main` (y con `workflow_dispatch`). Noticias RSS
se importan en build time (`npm run fetch-news`). Cron diario de redeploy:
pendiente (añadir `schedule` al workflow).

## Licencia de contenido

Textos del sitio CC BY-SA 4.0 (por añadir). Fotografías de Wikimedia Commons con
créditos visibles en cada ficha.
