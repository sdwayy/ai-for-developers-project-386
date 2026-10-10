import { MantineProvider } from "@mantine/core";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

afterEach(cleanup);

function renderHomePage() {
  return render(
    <MantineProvider>
      <HomePage />
    </MantineProvider>,
  );
}

describe("HomePage", () => {
  it("renders the service title as the main heading", () => {
    renderHomePage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Calendar" }),
    ).toBeInTheDocument();
  });

  it("links to the booking page", () => {
    renderHomePage();

    expect(screen.getByRole("link", { name: /Записаться/ })).toHaveAttribute(
      "href",
      "/book",
    );
  });

  it("describes the service capabilities", () => {
    renderHomePage();

    expect(
      screen.getByRole("heading", { name: "Возможности" }),
    ).toBeInTheDocument();

    const featuresList = screen.getByRole("list");
    expect(within(featuresList).getAllByRole("listitem")).toHaveLength(3);

    expect(
      screen.getByText("Выбор типа события и удобного времени для встречи."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Быстрое бронирование с подтверждением и дополнительными заметками.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Управление типами встреч и просмотр предстоящих записей в админке.",
      ),
    ).toBeInTheDocument();
  });
});
