import { MantineProvider } from "@mantine/core";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { EventType } from "@/shared/api";
import { BookView } from "./BookView";

afterEach(cleanup);

const host = { name: "Host" };

const seededEventTypes: EventType[] = [
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
];

function renderBookView(eventTypes: EventType[]) {
  return render(
    <MantineProvider>
      <BookView eventTypes={eventTypes} host={host} />
    </MantineProvider>,
  );
}

describe("BookView", () => {
  it("shows the heading, the slot hint and the host", () => {
    renderBookView(seededEventTypes);

    expect(
      screen.getByRole("heading", { level: 1, name: "Выберите тип события" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Нажмите на карточку, чтобы открыть календарь и выбрать удобный слот.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Host")).toBeInTheDocument();
  });

  it("renders each event type as a card linking to its page", () => {
    renderBookView(seededEventTypes);

    expect(
      screen.getByRole("link", { name: /Встреча 15 минут/ }),
    ).toHaveAttribute("href", "/book/15min");
    expect(
      screen.getByRole("link", { name: /Встреча 30 минут/ }),
    ).toHaveAttribute("href", "/book/30min");
    expect(screen.getByText("15 мин")).toBeInTheDocument();
    expect(
      screen.getByText("Короткий тип события для быстрого слота."),
    ).toBeInTheDocument();
  });

  it("shows a description only when the event type has one", () => {
    renderBookView([
      {
        id: "with-description",
        title: "С описанием",
        description: "Описание встречи.",
        durationMinutes: 30,
      },
      { id: "without-description", title: "Без описания", durationMinutes: 15 },
    ]);

    expect(screen.getAllByText("Описание встречи.")).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: /Без описания/ }),
    ).not.toHaveTextContent("Описание встречи.");
  });

  it("shows an empty state when there are no event types", () => {
    renderBookView([]);

    expect(screen.getByText("Типов событий пока нет.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Встреча/ })).toBeNull();
  });
});
