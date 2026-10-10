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

## Архитектура: Feature-Sliced Design

- Слои FSD живут в `src/`: сейчас есть `src/_app/` (инициализация, провайдеры) и `src/_pages/` (страницы). Остальные слои (`shared/`, `features/`, `entities/`) и слой `widgets/` появляются только при реальной надобности — не создавайте пустые каталоги.
- Слои FSD `app`/`pages` переименованы в `_app`/`_pages`, чтобы не конфликтовать с каталогами роутинга Next.js. Роутинг Next остаётся в `app/` в корне и содержит только тонкие реэкспорты из `@/_pages/*`.
- Импорты — только из слоёв ниже и только через публичный API слайса (`index.ts`). Алиасы `@/_app/*`, `@/_pages/*` заданы в `tsconfig.json`; новые слои/алиасы добавляйте по мере надобности.
- Контекст и обоснование решений — в `docs/adr/`, термины — в `GLOSSARY.md`.

### Компоненты

- Каждый компонент — в своей поддиректории `ui/<Component>/` с файлами `<Component>.tsx` и `index.ts` (реэкспорт); плоскую структуру в `ui/` не используем.
- Базовый вид компонента: `type Props = { ... };` и `export function Component(props: Props) { ... }`. Если пропсов нет — `type Props` не создаём и параметр не объявляем.
- Крупный компонент разбиваем на подкомпоненты, когда это разумно, — не раздуваем один файл.

## Интеграция Mantine + Next.js

- `app/layout.tsx` тонкий: импортирует `@mantine/core/styles.css`, рендерит `ColorSchemeScript` и `{...mantineHtmlProps}` на `<html>`, а детей оборачивает в `<Providers>` из `@/_app/providers`.
- Провайдер Mantine и тема живут в `src/_app/providers/`; `src/_app/providers/theme.ts` экспортирует `createTheme` и остаётся модулем с `"use client"`.
- Иконки подключаем из `lucide-react`.
- `postcss.config.cjs` обязателен: в нём заданы переменные брейкпоинтов Mantine (`mantine-breakpoint-xs` … `-xl`), используемые адаптивными миксинами Mantine в CSS. Не удаляйте его и не добавляйте стили в расчёте на обычное поведение Tailwind/медиазапросов.
- `mantine-styles.d.ts` глушит ошибку TS на импорте styles.css; `next.config.mjs` включает `optimizePackageImports` для `@mantine/core`/`@mantine/hooks`/`lucide-react`. Сохраните оба.

## Agent skills

### Issue tracker

Задачи живут в GitHub Issues этого репозитория; работа через `gh` CLI. См. `docs/agents/issue-tracker.md`.

### Triage labels

Канонические пять ролей с совпадающими именами лейблов. См. `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` в корне. См. `docs/agents/domain.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
