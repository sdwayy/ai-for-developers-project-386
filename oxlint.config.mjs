import { defineConfig } from 'oxlint';
import { oxlint } from 'oxc-config-mantine';

export default defineConfig({
  ...oxlint,
  ignorePatterns: [
    '**/*.{mjs,cjs,js,d.ts,d.mts}',
    '.next',
    'src/shared/api/generated',
  ],
  overrides: [
    ...(oxlint.overrides ?? []),
    {
      // Записи идут только через сгенерированный клиент за фасадом слайса
      // `shared/api`; прямой fetch запрещён везде, включая серверные модули.
      files: ['**/*.ts', '**/*.tsx'],
      excludeFiles: ['src/shared/api/generated/**'],
      rules: {
        'no-restricted-globals': [
          'error',
          {
            name: 'fetch',
            message:
              'Ходите в API через публичный фасад @/shared/api: прямой fetch разрешён только в сгенерированном клиенте.',
          },
        ],
      },
    },
    {
      // Форма машинного вывода генератора не должна протекать в фичи и страницы.
      files: ['**/*.ts', '**/*.tsx'],
      excludeFiles: ['src/shared/api/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/shared/api/generated/*'],
                message:
                  'Импортируйте из публичного API @/shared/api, а не из сгенерированных модулей.',
              },
            ],
          },
        ],
      },
    },
  ],
});
