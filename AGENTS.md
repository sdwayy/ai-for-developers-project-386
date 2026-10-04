# AGENTS.md

Hexlet learning project ("ai-for-developers" program): build a call-booking calendar service with AI. Currently a minimal Next.js + Mantine scaffold;

## Commands

- Package manager is Yarn 4 (`packageManager` in `package.json`, `nodeLinker: node-modules` in `.yarnrc.yml`). Use `yarn`, never npm/pnpm.
- `yarn dev` — dev server. `yarn build` — production build; this is also the de-facto typecheck (there is no separate `typecheck` script, and `tsc` alone relies on types generated under `.next/`).
- `yarn lint` runs **oxlint**, not ESLint. Config: `oxlint.config.mjs` (uses the `oxc-config-mantine` preset). It ignores all `.js/.mjs/.cjs/.d.ts` files — only `.ts/.tsx` is linted.
- `yarn test` runs **Vitest** once (CI mode); `yarn test:watch` for watch mode. Config: `vitest.config.mts` (jsdom + React plugin, setup in `vitest.setup.ts`). Colocate tests as `*.test.tsx`. `@testing-library/jest-dom` matchers are available globally in tests.
- Run `yarn lint && yarn test && yarn build` before committing.

## Hard constraints

- Do not edit, rename, or delete `.github/workflows/hexlet-check.yml` (or the repository) — Hexlet checks depend on it. Stated in both the workflow header and README.
- `release-please.yml` runs on every push to `main` → write commit messages as Conventional Commits (`feat:`, `fix:`, …).
- `.github/workflows/ci.yml` runs `lint` + `test` + `build` on every push. Keep it in sync with the scripts above (e.g. update it if the Node version or commands change).

## Mantine + Next.js integration

- App Router lives in `app/` (`layout.tsx`, `page.tsx`); no `src/` or `pages/`.
- `app/layout.tsx` must keep: the `@mantine/core/styles.css` import, `ColorSchemeScript`, `{...mantineHtmlProps}` on `<html>`, and `MantineProvider theme={theme}`.
- `theme.ts` exports `createTheme` and must stay a `"use client"` module.
- `postcss.config.cjs` is required: it defines Mantine breakpoint variables (`mantine-breakpoint-xs` … `-xl`) used by Mantine's responsive mixins in CSS. Don't remove it or add styles expecting plain Tailwind/media behavior.
- `mantine-styles.d.ts` silences TS for the styles.css import; `next.config.mjs` sets `optimizePackageImports` for `@mantine/core`/`@mantine/hooks`. Keep both.
