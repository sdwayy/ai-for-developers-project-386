# AGENTS.md

Учебный проект Хекслета (программа «ai-for-developers»): совместно с ИИ нужно сделать сервис для бронирования календаря звонков. Сейчас это минимальный каркас на Next.js + Mantine.

## Команды

- Пакетный менеджер — Yarn 4 (поле `packageManager` в `package.json`, `nodeLinker: node-modules` в `.yarnrc.yml`). Используйте `yarn`, никогда npm/pnpm.
- `yarn dev` — dev-сервер. `yarn build` — production-сборка; она же де-факто проверка типов (отдельного скрипта `typecheck` нет, а `tsc` в одиночку полагается на типы, сгенерированные в `.next/`).
- `yarn lint` запускает **oxlint**, а не ESLint. Конфиг: `oxlint.config.mjs` (пресет `oxc-config-mantine`). Он игнорирует все файлы `.js/.mjs/.cjs/.d.ts` — линтятся только `.ts/.tsx`.
- `yarn test` однократно запускает **Vitest** (режим CI); `yarn test:watch` — watch-режим. Конфиг: `vitest.config.mts` (jsdom + React-плагин, setup в `vitest.setup.ts`). Тесты размещайте рядом с кодом как `*.test.tsx`. Матчеры `@testing-library/jest-dom` доступны в тестах глобально.
- Перед коммитом запускайте `yarn lint && yarn test && yarn build`.

## Жёсткие ограничения

- Не редактируйте, не переименовывайте и не удаляйте `.github/workflows/hexlet-check.yml` (равно как и сам репозиторий) — от этого зависят проверки Хекслета. Написано и в заголовке workflow, и в README.
- `release-please.yml` запускается на каждый push в `main` → пишите сообщения коммитов в формате Conventional Commits (`feat:`, `fix:`, …).
- `.github/workflows/ci.yml` запускает `lint` + `test` + `build` на каждый push. Держите его синхронным со скриптами выше (например, обновите при смене версии Node или команд).

## Интеграция Mantine + Next.js

- App Router живёт в `app/` (`layout.tsx`, `page.tsx`); директорий `src/` или `pages/` нет.
- В `app/layout.tsx` должны остаться: импорт `@mantine/core/styles.css`, `ColorSchemeScript`, `{...mantineHtmlProps}` на `<html>` и `MantineProvider theme={theme}`.
- `theme.ts` экспортирует `createTheme` и должен оставаться модулем с `"use client"`.
- `postcss.config.cjs` обязателен: в нём заданы переменные брейкпоинтов Mantine (`mantine-breakpoint-xs` … `-xl`), используемые адаптивными миксинами Mantine в CSS. Не удаляйте его и не добавляйте стили в расчёте на обычное поведение Tailwind/медиазапросов.
- `mantine-styles.d.ts` глушит ошибку TS на импорте styles.css; `next.config.mjs` включает `optimizePackageImports` для `@mantine/core`/`@mantine/hooks`. Сохраните оба.
