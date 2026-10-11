import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./spec/openapi.json",
  output: {
    path: "src/shared/api/generated",
  },
  plugins: ["@hey-api/typescript", "@hey-api/sdk", "zod"],
});
