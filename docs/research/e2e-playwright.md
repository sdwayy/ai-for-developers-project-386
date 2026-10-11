# E2E-тесты на `@playwright/test` для этого репозитория

> Исследование по первоисточникам: официальная документация Playwright, npm-реестр,
> документация Vitest и Yarn, а также **бандл-доки установленного Next.js 16**
> (`node_modules/next/dist/docs/`), на которые ссылается `AGENTS.md`.
> Дата: 2026-10-11.

## Где лежит этот файл и почему

Конвенции для исследовательских заметок в репозитории нет:

- `docs/` содержит только `docs/adr/` (ADR) и `docs/agents/` (инструкции агентам) —
  это не заметки-исследования. Структура: `git ls-files '*.md'`.
- `spec/` — это исходники TypeSpec (`spec/main.tsp`, `spec/openapi.json`, `spec/tspconfig.yaml`),
  не место для заметок.
- `refs/` **игнорируется git** (`.gitignore:136` → `refs/`), поэтому туда класть нельзя.

Поэтому создан `docs/research/` — рядом с остальной документацией репозитория. Это
соответствует указанию скилла `.agents/skills/research/SKILL.md` (строки 11–12): «Save it
where the repo already keeps such notes; match the existing convention, and if there is
none, put it somewhere sensible and say where».

**Ничего, кроме этого файла, не менялось.** Пакеты не устанавливались, конфиги, CI и код
не трогались.

---

## 1. Краткое резюме

- E2E на `@playwright/test` **уживается** с текущим Vitest без конфликтов, если:
  1. положить тесты в отдельный каталог `e2e/` и задать `testDir: './e2e'`;
  2. называть e2e-файлы `*.spec.ts` (дефолтный `testMatch` Playwright), тогда они не
     попадут под `include` Vitest (`**/*.test.ts` / `**/*.test.tsx`).
- `playwright.config.ts` в корне с `webServer` и `baseURL` — рекомендованный путь
  (официальный гайд Next.js).
- В CI Playwright запускается **отдельным job** в `.github/workflows/ci.yml`
  (не в `hexlet-check.yml`), с `yarn playwright install --with-deps`, `yarn build` и
  `yarn test:e2e`, плюс загрузка `playwright-report/` как артефакта.
- Скрипты: добавить `test:e2e`, `test:e2e:ui`, `test:e2e:report`; **не менять** `test`
  (это `vitest run`).
- В `.gitignore` добавить `/playwright-report/`, `/test-results/`, `/blob-report/`,
  `/playwright/.cache/`.
- Кешировать браузеры в CI **не рекомендуется** (официальный гайд).
- Next.js 16 ставит Turbopack бандлером по умолчанию и для `dev`, и для `build`;
  известного конфликта с Playwright нет. Важные нюансы: `next dev` пишет в `.next/dev`,
  `next build` — в `.next`; есть lockfile против нескольких `next dev`/`next build`; Yarn
  PnP Turbopack не поддерживает, но репозиторий использует `nodeLinker: node-modules`.

---

## 2. Что уже есть в репозитории (факты)

Стек (проверено по файлам, а не со слов):

- `package.json:19-23` — `next@16.3.8`, `react@19.2.4`, `react-dom@19.2.4`,
  `@mantine/core@9.6.1`, `@mantine/hooks@9.6.1`, `zod@4.6.6`.
- `package.json:45-47` — `typescript@6.0.3`, `vite@^8.3.2`, `vitest@^5.0.3`.
- `package.json:49` — `"packageManager": "yarn@4.18.1"`.
- `.yarnrc.yml:6` — `nodeLinker: node-modules`; `.yarnrc.yml:4` — `enableScripts: true`.
- `package.json:5-14` — скрипты: `dev`, `build`, `start`, `lint` (oxlint), `test`
  (`vitest run`), `test:watch` (`vitest`), `api:generate`, `api:check`.

Структура:

- `app/` — только тонкие реэкспорты (`app/page.tsx:1` → `@/_pages/home`), `app/layout.tsx`.
- `src/_app/`, `src/_pages/`, `src/shared/` — слои FSD; `src/shared/api/generated/` и
  `src/shared/api/server/` (см. `docs/adr/0004-*.md`, `docs/adr/0005-*.md`).
- `docs/adr/` — 5 ADR; `docs/agents/` — 3 файла; `spec/` — TypeSpec; `refs/` — gitignored.

Тесты и TS:

- `vitest.config.mts:15-35` — два проекта: `ui` (`environment: jsdom`,
  `include: ["**/*.test.tsx"]`, строка 23) и `server` (`environment: node`,
  `include: ["**/*.test.ts"]`, строка 32). `setupFiles` — `vitest.setup.ts`.
- `tsconfig.json:32-38` — `include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"]`.
  То есть любые `e2e/*.spec.ts` и `playwright.config.ts` **попадут в проверку типов**.
- `tsconfig.json:21-25` — алиасы `@/_app/*`, `@/_pages/*`, `@/shared/*`.

CI и релизы:

- `.github/workflows/ci.yml` — на `push`, job `check`: `actions/checkout@v5`,
  `actions/setup-node@v5` с `node-version: 24` и `package-manager-cache: false`
  (комментарий в файле: не давать setup-node авто-кешировать Yarn 1), затем
  `corepack enable`, `yarn install --immutable`, `make api-check`, `yarn lint`,
  `yarn test`, `yarn build` (строки 9–28).
- `.github/workflows/hexlet-check.yml` — **не трогать** (заголовок файла и `AGENTS.md:15`).
- `.github/workflows/release-please.yml` — на push в `main`, Conventional Commits
  (`AGENTS.md:16`).
- `.gitignore` — `refs/` (строка 136), `coverage` (24), `.next` (88). Записей для
  `playwright-report/`, `test-results/` **нет**.

Локальное окружение:

- Локально `node v25.8.1`, `yarn 4.18.1`. В CI — Node 24.

---

## 3. Что я прочитал в бандл-доках Next.js 16 (обязательный шаг)

`AGENTS.md:54-62` прямо требует читать `node_modules/next/dist/docs/` перед любыми
Next-специфичными решениями. Релевантные находки:

1. **Официальный гайд Next.js по Playwright** —
   `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`.
   - Рекомендует запускать тесты против **production-кода**: «We recommend running your
     tests against your production code to more closely resemble how your application will
     behave. Run `npm run build` and `npm run start`, then run `npx playwright test`»
     (строки 136–138).
   - Альтернатива — `webServer`, чтобы Playwright сам поднимал dev-сервер и ждал
     готовности (строка 140).
   - `baseURL` позволяет писать `page.goto("/")` вместо полного URL (строки 121, 132).
   - CI: «To install all the Playwright dependencies, run `npx playwright install-deps`»
     (строка 144). Ручная установка — `yarn create playwright` (строки 41–43) или
     `create-next-app --example with-playwright` (строки 21–23).
2. **`next build` в Next 16 запускает проектный `tsc`** —
   `.../05-config/01-next-config-js/useTypeScriptCli.md:5-7,56-58`:
   «By default, `next build` runs the project-local `tsc` command instead of loading the
   TypeScript JavaScript compiler API»; «The complete project selected by the configured
   `tsconfig` file is checked, **including test files** and `.next/dev/types` when included».
   Практический вывод: `yarn build` будет проверять типы и в `e2e/**`, и в
   `playwright.config.ts`.
3. **Turbopack — дефолт для `dev` и `build`** —
   `.../02-guides/upgrading/version-16.md:126-152`, `.../03-api-reference/08-turbopack.md:37-63`.
   - `next dev`/`next build` без флагов используют Turbopack; `--webpack` — опт-аут.
   - `next build` **падает**, если найден кастомный `webpack`-конфиг
     (`version-16.md:154-162`). В этом репозитории `next.config.mjs:1-9` содержит только
     `reactStrictMode` и `experimental.optimizePackageImports` — `webpack`-конфига нет,
     значит Turbopack-сборка безопасна.
   - Turbopack **не делает type-checking** (`08-turbopack.md:73`).
   - **Yarn PnP не поддерживается** Turbopack и не планируется (`08-turbopack.md:366-367`),
     но у репозитория `nodeLinker: node-modules` — не проблема.
   - Path aliases из `tsconfig.json` (`paths`/`baseUrl`) поддерживаются
     (`08-turbopack.md:115`).
4. **Раздельные output-каталоги и lockfile** —
   `version-16.md:907-911`: «`next dev` and `next build` now use separate output
   directories… `next dev` outputs to `.next/dev`»; «a lockfile mechanism prevents multiple
   `next dev` or `next build` instances on the same project».
5. **Порты и CLI** — `.../06-cli/next.md:56-70,111-124`: `-p/--port`, дефолт 3000,
   переменная `PORT`; `next start` тоже дефолт 3000.
6. **Тестирование async Server Components** — `.../testing/index.md:16-22` и
   `.../testing/vitest.md:9`: для `async` Server Components Next рекомендует **E2E**, а не
   юнит-тесты (Vitest их не поддерживает). Для проекта бронирования это аргумент в пользу
   e2e-покрытия.

---

## 4. Рекомендуемый план внедрения

### Шаг 1. Установить `@playwright/test`

Актуальная версия — **1.64.0** (`engines: node >=20`), проверено в npm-реестре:
`https://registry.npmjs.org/@playwright/test/latest` (`"version":"1.64.0"`,
`"engines":{"node":">=20"}`, зависимость `playwright@1.64.0`).

```bash
yarn add -D @playwright/test
yarn playwright install --with-deps      # скачать браузеры (+системные зависимости на Linux)
```

- Yarn 4 запускает локальный бинарь по имени: `yarn <bin> ...` эквивалентно
  `yarn run <bin> ...`, если нет одноимённого скрипта
  (https://yarnpkg.com/cli/run, раздел «Details»). Поэтому `yarn playwright …` работает.
- `--with-deps` ставит и ОС-зависимости (https://playwright.dev/docs/browsers#install-system-dependencies).
- **Не подтверждено:** синтаксис `yarn create playwright` из гайда Next — в Yarn 4
  команды `yarn create` в CLI-справочнике нет (`https://yarnpkg.com/cli/create` → 404).
  Канонический установщик — `npm init playwright@latest`
  (https://playwright.dev/docs/intro#installing-playwright). Рекомендуется ручная
  установка `yarn add -D @playwright/test`, а не скаффолдер: скаффолдер создаёт
  `tests/` и GitHub Actions workflow и может конфликтовать с раскладкой репозитория.

### Шаг 2. Каталог тестов

Создать каталог `e2e/` в корне (см. шаг 5 про FSD). Первый тест —
`e2e/home.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("home page renders the booking CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
```

### Шаг 3. `playwright.config.ts` в корне

```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  // Только e2e/ — иначе дефолтный testMatch зацепит src/**/*.test.tsx (Vitest).
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  globalTimeout: 10 * 60 * 1000,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Локально — dev-сервер; в CI — production-сервер (сначала `yarn build`).
    command: process.env.CI ? "yarn start" : "yarn dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

Обоснования (первоисточники):

- `testDir` по умолчанию — «the directory of the configuration file»
  (https://playwright.dev/docs/api/class-testconfig#test-config-test-dir). Без явного
  `testDir` Playwright сканировал бы весь корень.
- `testMatch` по умолчанию — `**/*.@(spec|test).?(c|m)[jt]s?(x)`, то есть он зацепил бы
  и `src/**/*.test.tsx` (https://playwright.dev/docs/test-configuration, «Filtering Tests»;
  https://playwright.dev/docs/api/class-testconfig#test-config-test-match).
- `webServer`: `command`, `url`, `reuseExistingServer: !process.env.CI`, `timeout`
  (https://playwright.dev/docs/test-webserver; https://playwright.dev/docs/api/class-testconfig#test-config-web-server).
- `reuseExistingServer: !process.env.CI` — «This should be commonly set to `!process.env.CI`»
  (https://playwright.dev/docs/test-webserver).
- `baseURL` (https://playwright.dev/docs/test-webserver#adding-a-baseurl).
- `forbidOnly`/`retries`/`workers: process.env.CI ? 1 : undefined`
  (https://playwright.dev/docs/test-configuration#basic-configuration,
  https://playwright.dev/docs/ci#workers).
- `globalTimeout` в CI обязателен, иначе зависший прогон убивается раннером без отчёта
  (https://playwright.dev/docs/ci#global-timeout).
- `trace: 'on-first-retry'`, `screenshot`, `video` и их режимы
  (https://playwright.dev/docs/test-use-options#recording-options).
- HTML-репортер с `open: 'never'` — по умолчанию `on-failure` открывает сервер и может
  «подвесить» CI (https://playwright.dev/docs/test-reporters#html-reporter).
- `projects` (https://playwright.dev/docs/test-projects#configure-projects-for-multiple-browsers).
  Начать с одного `chromium`; при необходимости добавить `firefox`/`webkit`.

**Важно про CI и production-сборку:** официальный гайд Next советует тестировать
production-код (`.../testing/playwright.md:136-138`). Поэтому в CI job сначала идёт
`yarn build`, а `webServer.command` в CI — `yarn start`. Локально используется `yarn dev`
(быстрее) — либо можно и локально гонять по production-сборке.

### Шаг 4. Сосуществование с Vitest

- **Playwright не подхватит Vitest-тесты** благодаря `testDir: './e2e'` (шаг 3).
- **Vitest не подхватит e2e**, потому что его `include` переопределён на
  `**/*.test.tsx` (ui) и `**/*.test.ts` (server) — `vitest.config.mts:23,32`, а e2e-файлы
  называются `*.spec.ts`. Это уже работает без правок.
- Belt-and-suspenders (опционально): добавить в `vitest.config.mts` в каждый проект
  `exclude` с `configDefaults.exclude` + `'**/e2e/**'`. Дефолт `exclude` Vitest —
  `['**/node_modules/**', '**/.git/**']`; ручная установка `exclude` **заменяет** дефолт,
  поэтому нужно `...configDefaults.exclude`
  (https://vitest.dev/config/exclude; https://vitest.dev/config/include).
  **Не подтверждено:** наследуется ли корневой `test.exclude` во вложенные `projects`
  в Vitest 5 — надёжнее задать `exclude` в каждом проекте.

### Шаг 5. Где размещать E2E в FSD-структуре

Варианты и вывод:

| Вариант | Плюсы | Минусы |
| --- | --- | --- |
| `e2e/` в корне (рекомендуется) | Совпадает с конвенцией Playwright; e2e — сквозные, а не слой FSD; не мешает `tsconfig`/`src` | Ещё один корневой каталог |
| `src/e2e/` | Рядом с кодом | `src/` — территория слоёв FSD; e2e не слой, размывает границу |
| `tests/` в корне | Дефолт скаффолдера | Общее имя; не отличает e2e от будущих других тестов |
| Колокация `src/**/*.e2e.ts` | Близко к коду | Засоряет слайсы; сложнее `testDir`; ломает «плоскую» идею FSD |

В репозитории e2e-каталога нет; FSD-скилл не предписывает место для тестов
(`.agents/skills/feature-sliced-design/references/*` упоминает тесты только в контексте
изоляции слайсов). Рекомендация — **корневой `e2e/`**: сквозной тест пересекает слои и не
принадлежит ни одному слайсу, а Playwright-конвенция это подтверждает
(https://playwright.dev/docs/intro#whats-installed).

### Шаг 6. Скрипты в `package.json`

Добавить, **не трогая** `test`:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:report": "playwright show-report"
```

- `playwright test` / `--ui` (https://playwright.dev/docs/test-cli#run-tests,
  https://playwright.dev/docs/intro#running-the-example-test-in-ui-mode).
- `playwright show-report` (https://playwright.dev/docs/test-cli#show-report).
- Существующий `test` остаётся `vitest run`, `yarn test` не меняется (`AGENTS.md:10`).

### Шаг 7. `.gitignore`

Добавить (в `.gitignore` таких записей сейчас нет):

```gitignore
# Playwright
/playwright-report/
/test-results/
/blob-report/
/playwright/.cache/
```

- Дефолт HTML-отчёта — `playwright-report/`
  (https://playwright.dev/docs/test-reporters#html-reporter).
- Дефолт артефактов — `test-results/`
  (https://playwright.dev/docs/api/class-testconfig#test-config-output-dir).
- Blob-отчёт — `blob-report/` (https://playwright.dev/docs/test-reporters#blob-reporter).

### Шаг 8. CI: отдельный job в `.github/workflows/ci.yml`

Добавить job рядом с существующим `check` (не меняя `check` и **не трогая**
`hexlet-check.yml`):

```yaml
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - uses: actions/setup-node@v5
        with:
          node-version: 24
          package-manager-cache: false

      - run: corepack enable

      - run: yarn install --immutable

      - run: yarn playwright install --with-deps

      - run: yarn build

      - run: yarn test:e2e

      - uses: actions/upload-artifact@v5
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

Обоснования:

- `npx playwright install --with-deps` — стандартный шаг CI
  (https://playwright.dev/docs/ci#introduction); здесь через Yarn 4 → `yarn playwright …`
  (https://yarnpkg.com/cli/run).
- Загрузка артефакта `playwright-report/` с `if: ${{ !cancelled() }}` — из официального
  GitHub Actions-примера (https://playwright.dev/docs/ci#github-actions).
- `node-version: 24`, `corepack enable`, `package-manager-cache: false`,
  `yarn install --immutable` — синхронно с текущим job `check` (`.github/workflows/ci.yml:11-20`),
  что требует `AGENTS.md:17`.
- `actions/upload-artifact@v5` — версия из официального примера Playwright
  (https://playwright.dev/docs/ci#github-actions). Для `checkout`/`setup-node` взяты `@v5`,
  как в репозитории (в примере Playwright — `@v6`; расхождение осознанное, чтобы не
  менять версии действий в проекте).
- `yarn build` перед `yarn test:e2e` нужен, потому что `webServer` в CI запускает `yarn start`
  (шаг 3), а `next start` требует готовой сборки
  (`node_modules/next/dist/docs/01-app/03-api-reference/06-cli/next.md:111-113`).

Альтернатива: отдельный workflow-файл (например, `.github/workflows/e2e.yml`) на
`pull_request` — тогда `ci.yml` не удлиняется, но появляется второй конфиг.

---

## 5. Альтернативы и trade-off'ы

1. **`webServer` с dev-сервером vs production-сборкой.**
   - Dev (`yarn dev`): быстрее стартует, но `reactStrictMode: true`
     (`next.config.mjs:3`) в dev-режиме двойной вызов эффектов — потенциальные
     нестабильности. Плюс официальный гайд Next советует production
     (`.../testing/playwright.md:136`).
   - Production (`yarn build && yarn start`): ближе к реальности, но дольше (нужна сборка).
   - Компромисс в конфиге выше: dev локально, production в CI.
2. **Один браузер vs три.** Три (`chromium`/`firefox`/`webkit`) дают больше уверенности, но
   втрое дольше и требуют установки всех браузеров
   (https://playwright.dev/docs/test-projects). Для учебного проекта разумно начать с
   `chromium`, расширять по необходимости.
3. **Job в `ci.yml` vs отдельный workflow.** Job в `ci.yml` — один источник правды и
   автоматически входит в существующий пайплайн push. Отдельный workflow позволяет
   ограничить триггер (`pull_request`) и изолировать падения e2e от `check`. Минус job —
   удлиняет основной CI и дублирует `yarn build`.
4. **Кеширование браузеров в CI.** Официально **не рекомендуется**: восстановление кеша
   сопоставимо по времени со скачиванием, а ОС-зависимости не кешируются
   (https://playwright.dev/docs/ci#caching-browsers). Если всё же кешировать — по хешу
   версии Playwright, каталог из
   https://playwright.dev/docs/browsers#managing-browser-binaries (`~/.cache/ms-playwright`).
5. **`PLAYWRIGHT_BROWSERS_PATH`.** По умолчанию браузеры в OS-кеше
   (`~/.cache/ms-playwright` на Linux). Можно задать `PLAYWRIGHT_BROWSERS_PATH=0` для
   «герметичной» установки в `node_modules/playwright-core/.local-browsers`
   (https://playwright.dev/docs/browsers#hermetic-install). Для node-modules это
   допустимо, но обычно не нужно.
6. **Отдельный `e2e/tsconfig.json`.** Playwright рекомендует отдельный tsconfig в каталоге
   тестов и поддерживает только `allowJs, baseUrl, paths, jsx, jsxFactory,
   jsxFragmentFactory, jsxImportSource, references, extends`
   (https://playwright.dev/docs/test-typescript#tsconfigjson). В этом репозитории он не
   обязателен: корневой `tsconfig.json` уже покрывает `e2e/**`, а Next 16 всё равно
   проверяет весь проект через `tsc` (см. §3.2).
7. **`yarn create playwright` vs ручная настройка.** Скаффолдер удобен, но создаёт `tests/`
   и workflow, которые расходятся с раскладкой репозитория; плюс синтаксис `yarn create` в
   Yarn 4 не подтверждён (см. §4, шаг 1).

---

## 6. Риски и открытые вопросы

1. **Версия Node.** Локально `v25.8.1`. Playwright 1.64 требует `node >=20`
   (npm-реестр), а официальные системные требования перечисляют «latest 22.x, 24.x or 26.x»
   (https://playwright.dev/docs/intro#system-requirements) — Node 25 в списке нет.
   CI использует Node 24 (`.github/workflows/ci.yml:13`) — это поддерживаемая линия.
   **Открытый вопрос:** подтвердить, что локальный Node 25 не создаёт проблем
   (вероятнее всего, работает, но официально не заявлен).
2. **Turbopack + Playwright.** Прямых предупреждений в доках Next о несовместимости с
   Playwright **не найдено**. Известные ограничения Turbopack (Yarn PnP, кастомный
   `webpack`-конфиг) к репозиторию не относятся. **Открытый вопрос:** поведение
   dev-сервера Next 16 под нагрузкой Playwright (двойной StrictMode, HMR) на реальных
   сценариях — проверять на практике.
3. **Lockfile `next dev`/`next build`.** Next 16 не даёт запустить два `next dev`/`next build`
   в одном проекте (`version-16.md:907-911`). Если у разработчика уже идёт `yarn dev`,
   `reuseExistingServer: !process.env.CI` переиспользует его; но при отключённом reuse
   (в CI) конфликт исключён. **Открытый вопрос:** выбрать выделенный порт (например, 3100),
   чтобы e2e не мешал обычной разработке.
4. **`yarn build` проверяет типы e2e-файлов.** Согласно
   `useTypeScriptCli.md:56-58`, `next build` через `tsc` проверяет **весь** проект из
   `tsconfig`, включая тестовые файлы. Значит, ошибки типов в `e2e/**` уронят `yarn build`
   (и job `check`, и job `e2e`). Это плюс (типобезопасность), но связывает e2e с основной
   сборкой. **Открытый вопрос:** оставлять ли e2e в корневом `tsconfig` (проще, но coupling)
   или завести отдельный `tsconfig` и исключить `e2e` из основного (сложнее).
5. **oxlint линтит e2e.** `yarn lint` = `oxlint -c oxlint.config.mjs .`
   (`package.json:9`), а конфиг линтит `.ts/.tsx` и накладывает
   `no-restricted-globals: fetch` на `**/*.ts`/`**/*.tsx` (`oxlint.config.mjs:11-28`).
   Если e2e-тесты будут использовать глобальный `fetch`, линт упадёт. Использовать
   `page.request` / API-фикстуры Playwright. **Открытый вопрос:** при необходимости добавить
   `e2e/**` в `excludeFiles` — но это изменение конфига вне рамок этого исследования.
6. **Хекслет.** `hexlet-check.yml` не трогаем (`AGENTS.md:15`, `README.md:33`).
   `release-please.yml` → коммиты в Conventional Commits (`AGENTS.md:16`), т.е. будущий
   PR — `feat: add playwright e2e tests` / `ci: add e2e job`.
7. **Длительность CI.** E2e-job добавляет установку браузеров и полный `yarn build` к
   каждому push. **Открытый вопрос:** запускать e2e только на `pull_request` или и на `push`.
8. **Playwright MCP ≠ `@playwright/test`.** В `opencode.json:9-12` уже настроен
   Playwright MCP-сервер — это отдельный инструмент для агентов, не тест-раннер. Не путать.
9. **`yarn create playwright`.** Не подтверждён для Yarn 4 (см. §4, шаг 1) — использовать
   ручную установку.

---

## 7. Источники

### Первоисточники Playwright (официальная документация)

- Installation: https://playwright.dev/docs/intro (установка, `npm init playwright@latest`,
  `install --with-deps`, системные требования, обновление, HTML-отчёт, UI-режим).
- Test configuration: https://playwright.dev/docs/test-configuration
  (`testDir`, `fullyParallel`, `forbidOnly`, `retries`, `workers`, `globalTimeout`,
  `reporter`, `use.baseURL`, `trace`, `projects`, `webServer`; дефолтный `testMatch`
  `**/*.@(spec|test).?(c|m)[jt]s?(x)`).
- Configuration (use): https://playwright.dev/docs/test-use-options
  (`baseURL`, `screenshot`, `trace`, `video` и режимы записи).
- TestConfig API: https://playwright.dev/docs/api/class-testconfig
  (`testDir` по умолчанию — каталог конфига; `testMatch`; `outputDir` = `test-results`;
  `tsconfig`; `webServer`; `respectGitIgnore`).
- Web server: https://playwright.dev/docs/test-webserver
  (`command`, `url`, `reuseExistingServer: !process.env.CI`, `timeout`, `baseURL`,
  несколько серверов).
- Command line: https://playwright.dev/docs/test-cli
  (`playwright test`, `--ui`, `show-report`, `install`, `--with-deps`).
- Continuous Integration: https://playwright.dev/docs/ci
  (`npm ci` + `npx playwright install --with-deps` + `npx playwright test`;
  `workers: 1`; `globalTimeout`; GitHub Actions workflow с `upload-artifact`;
  кеширование браузеров не рекомендуется; `DEBUG=pw:browser`; headed через `xvfb-run`).
- Reporters: https://playwright.dev/docs/test-reporters
  (HTML reporter, `open: 'never'`, дефолт `playwright-report/`; blob → `blob-report/`;
  `github` reporter для аннотаций в Actions).
- Browsers: https://playwright.dev/docs/browsers
  (`install` / `install-deps` / `--with-deps`; пути кеша `~/Library/Caches/ms-playwright`
  (macOS), `~/.cache/ms-playwright` (Linux); `PLAYWRIGHT_BROWSERS_PATH`,
  hermetic install `=0`; `--only-shell`).
- TypeScript: https://playwright.dev/docs/test-typescript
  (tsconfig out of the box; поддерживаемые опции; отдельный `tests/tsconfig.json`;
  path mapping; `--tsconfig`).
- Projects: https://playwright.dev/docs/test-projects
  (несколько браузеров/окружений, `testMatch`/`testIgnore`, зависимости).
- npm-реестр `@playwright/test`: https://registry.npmjs.org/@playwright/test/latest
  (версия 1.64.0, `engines.node >=20`, зависимость `playwright@1.64.0`).

### Первоисточники Vitest

- Config: https://vitest.dev/config/
  (`defineConfig` из `vitest/config`; `configDefaults`).
- include: https://vitest.dev/config/include
  (дефолт `['**/*.{test,spec}.?(c|m)[jt]s?(x)']`).
- exclude: https://vitest.dev/config/exclude
  (дефолт `['**/node_modules/**', '**/.git/**']`; ручной `exclude` заменяет дефолт).

### Первоисточники Yarn 4

- `yarn run`: https://yarnpkg.com/cli/run
  («if one of the local workspace's dependencies exposes a binary with a matching name,
  this binary will get executed»).
- `yarn dlx`: https://yarnpkg.com/cli/dlx.
- `yarn add`: https://yarnpkg.com/cli/add (`-D/--dev`).
- `yarn create`: https://yarnpkg.com/cli/create → **404** (команды нет в Yarn 4).

### Бандл-доки установленного Next.js 16 (пути от корня репозитория)

- `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`
  (официальный гайд Next + Playwright; production vs dev; webServer; CI).
- `node_modules/next/dist/docs/01-app/02-guides/testing/index.md`
  (типы тестов; E2E для async Server Components).
- `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`
  (Vitest не поддерживает async Server Components).
- `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`
  (Turbopack по умолчанию; падение при webpack-конфиге; `.next/dev`; lockfile;
  Node 20.9+; TS 5.1+).
- `node_modules/next/dist/docs/01-app/03-api-reference/08-turbopack.md`
  (type-checking не делает; Yarn PnP не поддержан; path aliases из tsconfig).
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/useTypeScriptCli.md`
  (`next build` запускает проектный `tsc`; проверяется весь tsconfig-проект, включая тесты).
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/typescript.md`
  (`ignoreBuildErrors`, `tsconfigPath`).
- `node_modules/next/dist/docs/01-app/03-api-reference/06-cli/next.md`
  (`next dev`/`build`/`start`, `-p/--port`, дефолт 3000, `PORT`).
- `node_modules/next/dist/docs/01-app/03-api-reference/08-turbopack.md` (версии изменений).

### Файлы репозитория (проверенные факты)

- `package.json:5-14,19-23,25-49`, `.yarnrc.yml:4,6`, `tsconfig.json:21-38`,
  `vitest.config.mts:15-35`, `vitest.setup.ts:1-16`, `next.config.mjs:1-9`,
  `oxlint.config.mjs:1-49`, `.gitignore:24,88,136`, `Makefile:1-7`.
- `.github/workflows/ci.yml:1-28`, `.github/workflows/release-please.yml:1-26`,
  `.github/workflows/hexlet-check.yml:1-24`, `.github/workflows/README.md:1-5`.
- `AGENTS.md:5-24,54-62`, `README.md:33`, `GLOSSARY.md:1-27`, `opencode.json:9-12`.
- `docs/adr/0001-*.md`, `docs/adr/0004-*.md`, `docs/adr/0005-*.md`,
  `docs/agents/domain.md`, `docs/agents/issue-tracker.md`.
- `.agents/skills/research/SKILL.md:6-12`,
  `.agents/skills/feature-sliced-design/references/*`,
  `.agents/skills/tdd/tests.md`.
