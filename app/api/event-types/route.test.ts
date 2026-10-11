import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/event-types", () => {
  it("returns the seeded event types in creation order", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([
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
