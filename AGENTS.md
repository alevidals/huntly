<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Environment Setup

- Framework: Next.js 16.2.1 with App Router, React 19.2.4, TypeScript 5, Tailwind CSS v4, Biome, and React Compiler enabled in `next.config.ts`.
- Package manager: `pnpm`.
- Current state: the repository still looks close to the default Create Next App scaffold, but the application root now lives under `src/`.
- Keep Next.js route files in `src/app`, place `proxy.ts` at `src/proxy.ts`, and keep the `@/*` alias in `tsconfig.json` mapped to `./src/*`.
- Read the relevant Next.js 16 docs in `node_modules/next/dist/docs/` before changing framework-specific behavior, especially around `proxy.ts`, route handlers, Server Actions, caching, and auth.

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local Next.js dev server |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run Biome checks |
| `pnpm format` | Format the codebase with Biome |

Testing is planned but not configured yet. Do not invent a different test stack without an explicit decision.

## Architecture Goals

- Build a maintainable baseline from the start, but keep it pragmatic.
- Apply SOLID, KISS, and DRY together. Use them to clarify responsibilities and remove duplication, not to justify premature abstraction.
- Avoid over-architecture. Start with the smallest structure that keeps code understandable, then refine only when a real feature becomes complex enough to require it.
- Keep a clear anti-corruption layer around every external dependency such as the ORM, auth provider, payments, email, storage, or third-party APIs.
- The rest of the application should depend on app-owned contracts, not vendor APIs. If `getUser()` exists today, callers must not care whether the implementation uses Drizzle, Prisma, or something else tomorrow.

## Repository Structure

This is the target structure for the project:

```txt
src/
  app/
    ... Next.js route files only
  features/
    auth/
      services/
        sign-in.ts
        sign-up.ts
        sign-out.ts
      actions/
        sign-in.ts
        sign-up.ts
        sign-out.ts
      components/
        ... auth feature components
      types.ts
    dashboard/
      services/
        ... dashboard services
      actions/
        ... dashboard actions
      components/
        ... dashboard feature components
      types.ts
    users/
      services/
        get-user.ts
        create-user.ts
        update-user.ts
        delete-user.ts
      actions/
        create-user.ts
      components/
        ... user feature components
      types.ts
  shared/
    lib/
      db/
        client.ts
        schema.ts
        migrations/
          ... database migrations
      env/
        index.ts
      utils.ts
    components/
      ui/
        ... shadcn components
      ... shared components
  proxy.ts
```

- `src/` is the application root.
- Database client code, schema definitions, and migrations live in `src/shared/lib/db/`, even if the underlying tool changes later.
- Never use barrel files. Import from the real file that owns the code.

## App Layer

- Keep `src/app/` as the Next.js entry layer only.
- `src/app/` may contain route segments and file-convention files such as `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`, `route.ts`, metadata files, and route-local composition.
- Do not place long-lived business logic, ORM access, auth provider calls, or third-party integration code in `src/app/`.
- Pages and layouts should compose feature components and delegate real work to feature actions and services.
- Mutations must happen in Server Actions or Route Handlers, never as side effects during rendering.

## Feature Layer

- Organize domain code by feature under `src/features/<feature>/`.
- Start every feature with `services/`, `actions/`, `components/`, and `types.ts`.
- Do not add more internal layers by default. If a feature later becomes complex enough to justify more separation, refine that feature locally instead of complicating the whole codebase.

### Actions

- Feature actions are thin Server Actions.
- Actions receive input, validate it, enforce authentication and authorization, orchestrate the use case, and delegate the actual business or integration work to `services/`.
- Keep action return values minimal and serializable.
- Use Zod for validation at the action boundary. Parse and validate every external input before orchestrating the use case.

### Services

- `services/` contain persistence, queries, and integration logic.
- Services expose stable, technology-agnostic functions owned by the app.
- Hide ORM, SDK, provider, and transport details behind the service boundary.
- Map external responses into app-owned types or DTOs before returning them.
- Do not leak raw Drizzle models, Prisma payloads, auth provider objects, or third-party SDK responses unless that shape is intentionally the public contract.

### Components

- `components/` contain feature-specific UI.
- Keep code inside the feature unless it is truly reused across multiple features.
- Promote app-specific cross-feature components to `src/shared/components/` only when the reuse is real.

### Types

- `types.ts` holds feature-local contracts, DTOs, form shapes, action state types, and other shared feature types.
- Keep types close to the feature that owns them.

## Shared Layer

- `src/shared/` is for truly cross-cutting code only.
- `src/shared/lib/db/` holds low-level database implementation details such as the client, schema, and migrations.
- `src/shared/lib/env/` is the single place for reading and validating environment variables.
- `src/shared/components/ui/` is the home for shadcn primitives.
- `src/shared/components/` holds shared application components that are not tied to a single feature.
- Modules that must never run on the client should use `import 'server-only'` where appropriate.
- Do not let `shared/` become a dumping ground. If something is only used by one feature, keep it in that feature.

## Next.js 16 Rules

- Use `proxy.ts`, never `middleware.ts`.
- The proxy entry file must be `src/proxy.ts`.
- Only one `proxy.ts` file is supported per project. If proxy logic grows, extract helper modules and import them into the single proxy entry file.
- `proxy.ts` and `route.ts` have elevated power and must be reviewed carefully.
- Re-authorize inside every Server Action. Do not rely only on page-level guards or proxy checks.

## Coding Standards

- Component props types are always called `Props`.
- Prefer `type` over `interface`. Use `interface` only when it is the better fit.
- Function parameters are typed objects. Name the parameter type `XxxParams` and destructure in the function signature.
- Keep contracts stable and explicit.
- Use the tsconfig path alias for application imports and avoid deep relative import chains across the codebase. `@/*` resolves to `./src/*`.
- Keep modules simple. Do not add indirection, helper layers, or abstractions until the code actually benefits from them.

## Testing

- Planned tools: Vitest for unit and integration tests, Playwright for end-to-end tests.
- The exact test setup, directories, and scripts are still TBD.
- Until the tooling exists, do not introduce a different testing stack by default.

## Boundaries

### Ask First

- Introducing a new architectural layer beyond the baseline feature structure.
- Exposing ORM, auth provider, or third-party specific types outside the service boundary.
- Adding new shared abstractions without clear evidence of reuse.
- Changing the target `src/` layout, import strategy, or planned testing stack.

### Never

1. Put long-lived business logic in `src/app/`.
2. Use `middleware.ts` in this project.
3. Call the ORM, auth provider, or third-party SDK directly from route entry files or UI when a feature service should own that integration.
4. Couple callers to Drizzle, Prisma, auth provider, or third-party specific APIs.
5. Read `process.env` from random modules or from client code.
6. Use barrel files.
