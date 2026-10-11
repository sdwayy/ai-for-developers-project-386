import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const alias = {
  "@/_app": fileURLToPath(new URL("./src/_app", import.meta.url)),
  "@/_pages": fileURLToPath(new URL("./src/_pages", import.meta.url)),
  "@/shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
};

export default defineConfig({
  test: {
    // Два проекта: компонентные тесты в jsdom и серверные — в node с условием
    // `react-server`, иначе `server-only` бросает при импорте.
    projects: [
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: "ui",
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
          include: ["**/*.test.tsx"],
        },
      },
      {
        resolve: { alias, conditions: ["react-server", "node"] },
        ssr: { resolve: { conditions: ["react-server", "node"] } },
        test: {
          name: "server",
          environment: "node",
          include: ["**/*.test.ts"],
        },
      },
    ],
  },
});
