import { describe, expect, it } from "vitest";
import { createStore } from "./index";

describe("shared/api server store", () => {
  it("seeds the host profile and event types in creation order", () => {
    const store = createStore();

    expect(store.host).toEqual({ name: "Host" });
    expect(store.eventTypes).toEqual([
      {
        id: "15min",
        title: "Встреча 15 минут",
        description: "Короткий тип события для быстрого слота.",
        durationMinutes: 15,
      },
      {
        id: "30min",
        title: "Встреча 30 минут",
        description: "Базовый тип события для бронирования.",
        durationMinutes: 30,
      },
    ]);
  });
});
