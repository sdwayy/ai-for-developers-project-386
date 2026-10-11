import { describe, expect, it } from "vitest";
import { apiBaseUrl } from "@/shared/api";

describe("shared/api facade", () => {
  it("exposes the API base URL", () => {
    expect(apiBaseUrl).toBe("/api");
  });
});
