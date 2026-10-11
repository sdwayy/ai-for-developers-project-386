import { describe, expect, it } from "vitest";
import { createStore } from "./index";

describe("shared/api server store", () => {
  it("starts empty", () => {
    expect(createStore().eventTypes).toEqual([]);
  });
});
