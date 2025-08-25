# Copilot Instructions for AI Agents

## Project Overview
- This is a Strapi-based CMS template, organized for cloud deployment and extensibility.
- Main code lives in `src/` (APIs, components, bootstrap), with configuration in `config/` and data in `data/`.
- Custom plugins/extensions are under `src/plugins/` and `src/components/`.
- Database migrations are in `database/migrations/`.

## Architecture & Patterns
- Each API (e.g., `article`, `author`, `category`) follows a clear structure: `content-types/`, `controllers/`, `routes/`, `services/`.
- Shared components (e.g., `media`, `seo`, `slider`) are JSON schemas in `src/components/shared/`.
- Custom plugin example: `src/plugins/appfolio-sync/` (with its own controllers, routes, services).
- Data flows: API requests → routes → controllers → services → database/content-types.
- Configuration split: `config/` for environment, middleware, plugins, database, server.

## Developer Workflows
- **Start (dev):** `npm run develop` (autoReload enabled)
- **Start (prod):** `npm run start` (autoReload disabled)
- **Build admin panel:** `npm run build`
- **Seed data:** See `scripts/seed.js` for custom seeding logic.
- **Deploy:** Use `yarn strapi deploy` or follow Strapi Cloud docs.
- **Debug:** Inspect logs, check config files, and review controller/service logic for each API.

## Conventions & Integration
- API endpoints are auto-generated from `routes/` and `controllers/` in each API module.
- Use Strapi's CLI for scaffolding and management ([docs](https://docs.strapi.io/dev-docs/cli)).
- External assets are stored in `public/uploads/` and referenced in content-types/components.
- Type definitions for components/content-types are in `types/generated/`.
- Custom logic and integrations should be placed in `src/plugins/` or as new API modules under `src/api/`.

## Key Files & Directories
- `src/api/` — Main API modules (article, author, etc.)
- `src/components/shared/` — Reusable content schemas
- `src/plugins/appfolio-sync/` — Example custom plugin
- `config/` — All runtime and build configuration
- `scripts/seed.js` — Data seeding script
- `types/generated/` — TypeScript type definitions

## Examples
- To add a new API: create a folder in `src/api/` with `content-types/`, `controllers/`, `routes/`, `services/`.
- To extend with a plugin: use the structure in `src/plugins/appfolio-sync/`.
- To add a shared component: define a JSON schema in `src/components/shared/` and reference it in content-types.

---
For more, see [Strapi documentation](https://docs.strapi.io) and project README.

---
**Feedback:** If any section is unclear or missing, please specify so it can be improved for future AI agents.
