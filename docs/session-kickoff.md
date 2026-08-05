# Session Kickoff — Prompt de Ejecución

> Pegar al inicio de cada nueva sesión de trabajo del proyecto.
> Mantiene el contexto completo y apunta a los documentos fuente.

---

PROYECTO: Animal Rescue — aplicación web para ayudar a salvar animales en peligro de
extinción. Contenido 100% en francés, multilingüe en el futuro.

EMPIEZA SIEMPRE ASÍ:
1. Lee los dos documentos de contexto obligatorios:
   - `docs/plan.md`           → decisiones de producto acordadas (árbol completo)
   - `docs/execution-plan.md` → plan de ejecución con checkboxes de estado y bitácora
2. Revisa `git status` y `git log --oneline -10` para ver dónde quedó el trabajo.
3. No inventes ni cambies decisiones: consulta los docs antes de actuar.

ESTADO DE REFERENCIA:
- Repo: github.com/elijahizar/animal-rescue (SSH: git@github.com:elijahizar/animal-rescue.git)
- Ruta: /home/elijah/Documents/Projects/daniel/animal-rescue
- Entorno: Node v24.14.1, npm 11.11.0, git 2.43.0
- Sin código del proyecto aún: solo existe `docs/` y `.git` (commit inicial `8641f53`)
- Pendiente: ejecutar FASE 0 — FUNDACIÓN (ver `docs/execution-plan.md`)

DECISIONES CLAVE (resumen):
- Stack: Astro SSG + islas interactivas React · Cloudflare Pages (subdominio gratuito)
- Cron diario = redeploy · fetch RSS en build time · sin backend, sin analítica, sin cookies
- 10 especies: corail (grupo), tigre (Panthera tigris), rhinocéros noir (Diceros bicornis),
  lion blanc (Panthera leo — morfo de color, no especie), pingüino de Humboldt
  (Spheniscus humboldti), thon rouge (grupo), dauphin commun (Delphinus delphis),
  baleine bleue (Balaenoptera musculus), guépard (Acinonyx jubatus — tracer bullet),
  requin blanc (Carcharodon carcharias)
- Contenido curado híbrido con IUCN Red List como referencia; fotos Wikimedia Commons con crédito
- Causas: taxonomía reutilizable (déforestation, braconnage, pollution, changement climatique…)
- i18n desde el día 1 (Astro `src/i18n`, fr default, colecciones por locale); marca
  "Animal Rescue" universal + subtítulo localizado
- Páginas: `/` · `/aide/` (filtros + búsqueda) · `/aide/[slug]/` · `/infos/` · `/carte/` ·
  `/aider/` · `/apropos/` · legal (`/mentions-legales/`, `/politique-de-confidentialite/`)
- Mapa: Leaflet + OpenStreetMap mundial, markers agrupados con popup → ficha
- Noticias: RSS feeds francófonos, filtro keywords, últimas 30, blog con paginación y tags
- Diseño: moderno/vibrante, verde bosque `#2D6A4F`, crema `#FEFAE0`, naranja `#E76F51`
- ONGs: solo enlaces (WWF France, Greenpeace France, LPO, Sea Shepherd France,
  Fondation Nicolas Hulot) — sin donaciones
- SEO: OG tags + social sharing · lazy-load + `astro:assets` · páginas legales

FLUJO DE TRABAJO SUGERIDO:
- Completar la FASE 0 marcando cada checkbox de `docs/execution-plan.md`
- Luego Fase 1 (guépard), validar con el usuario antes de las demás especies
- No proceder una fase hasta llegar a la revisión acordada

DEFINICIÓN DE LISTO (DoD):
- `npm run build` sin errores · TypeScript en orden
- Contenido en francés correcto
- Actualizar `docs/execution-plan.md` (checkboxes + bitácora) al terminar
- Commits con convención `feat:` / `fix:` / `chore:` solo cuando el usuario lo pida
- NO añadir comentarios al código sin pedirlo

REGLA DE ORO:
- Si una decisión no está en `docs/plan.md` o hay ramas pendientes, preguntar al
  usuario antes de actuar. No improvisar.
