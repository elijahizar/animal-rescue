# Session Kickoff — Prompt de Ejecución

> Pegar al inicio de cada nueva sesión de trabajo del proyecto.
> Mantiene el contexto completo y apunta a los documentos fuente.

---

PROYECTO: Animal Rescue — aplicación web para ayudar a salvar animales en peligro de
extinción. Contenido 100% en francés, multilingüe en el futuro.

EMPIEZA SIEMPRE ASÍ:
1. Lee los documentos de contexto obligatorios:
   - `docs/plan.md`           → decisiones de producto acordadas (árbol completo)
   - `docs/execution-plan.md` → plan de ejecución con checkboxes de estado y bitácora
   - `docs/system-design.md`  → arquitectura y modelo de datos (referencia técnica)
   - `docs/content-guidelines.md` → estándar de contenido y checklists
2. Revisa `git status` y `git log --oneline -10` para ver dónde quedó el trabajo.
3. No inventes ni cambies decisiones: consulta los docs antes de actuar.

ESTADO DE REFERENCIA:
- Repo: github.com/elijahizar/animal-rescue (SSH: git@github.com:elijahizar/animal-rescue.git)
- Ruta: /home/elijah/Documents/Projects/daniel/animal-rescue
- Entorno: Node v24.14.1, npm 11.11.0, git 2.43.0, Astro v7.1.6
- **Fases 0–4 COMPLETADAS** (2026-08-05): scaffold + shell + i18n fr, tracer bullet
  guépard, 10 fichas + 36 regiones, `aider/`/`apropos/`/legal, blog INFOS (paginación
  + tags), SEO (sitemap/robots/OG) y **deploy v1 en GitHub Pages**:
  https://elijahizar.github.io/animal-rescue/fr/
- **FASE 5.1 SEO COMPLETADA** (2026-08-05): `og:url` absoluto, `rel=canonical` en todas
  las páginas, `og:image` genérica (`public/og-news.svg`) en noticias, `srcset` en
  home/`/aide`/galerías (`src/lib/urls.ts`). Siguiente: Fase 5.2 a11y.
- Cron diario pendiente.

DECISIONES CLAVE (resumen):
- Stack: Astro SSG + islas React (mapa Leaflet + lista con filtros) · **GitHub Pages**
  (subpath `/animal-rescue/`, NO Cloudflare)
- Cron diario = redeploy **pendiente** (hoy solo push a `main` + `workflow_dispatch`)
- Fetch RSS en build time (`npm run fetch-news`) · sin backend, sin analítica, sin cookies
- 10 especies: corail (grupo), tigre, rhinocéros noir, lion blanc (morfo, no especie),
  pingüino de Humboldt, thon rouge (grupo), dauphin commun, baleine bleue, guépard,
  requin blanc
- Contenido curado híbrido con IUCN Red List como referencia; fotos localizadas en
  `src/assets/species/` (descarga 1 vez con `npm run fetch-images`; render `astro:assets`
  — ver ADR-0007)
- Causas: taxonomía reutilizable en `src/lib/causes.ts` (8 causas)
- i18n: fr default con prefijo + redirect (`src/i18n`), colecciones por locale
- Páginas: `/` · `/aide/` (filtros + búsqueda) · `/aide/[slug]/` · `/infos/` (blog)
  · `/carte/` (Leaflet) · `/aider/` · `/apropos/` · legal
- ONGs: solo enlaces (WWF France, Greenpeace France, LPO, Sea Shepherd France,
  Fondation Nicolas Hulot, Comité français de l'UICN) — sin donaciones
- SEO: OG tags · lazy-load sobre thumbs de Commons · sitemap + robots.txt
- Diseño: moderno/vibrante, verde bosque `#2D6A4F`, crema `#FEFAE0`, naranja `#E76F51`

FLUJO DE TRABAJO SUGERIDO:
- Revisar el estado de `docs/execution-plan.md` y continuar el siguiente checkbox.
- No proceder una fase completa sin llegar a las revisiones acordadas con el usuario.

DEFINICIÓN DE LISTO (DoD):
- `npm run build` sin errores · `npx astro check` 0 errores
- Contenido en francés correcto
- Actualizar `docs/execution-plan.md` (checkboxes + bitácora) al terminar
- Commits con convención `feat:` / `fix:` / `chore:` / `docs:` solo cuando el usuario
  lo pida (preguntar explícitamente antes de commit/push)
- NO añadir comentarios al código sin pedirlo

REGLA DE ORO:
- Si una decisión no está en `docs/plan.md` o hay ramas pendientes, preguntar al
  usuario antes de actuar. No improvisar.
- ADRs en `docs/adr/README.md` son la memoria de decisiones técnicas.