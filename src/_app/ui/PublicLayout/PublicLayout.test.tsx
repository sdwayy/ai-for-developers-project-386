import { MantineProvider } from "@mantine/core";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PublicLayout } from "./PublicLayout";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

afterEach(cleanup);

describe("PublicLayout", () => {
  it("renders the public header above the page content", () => {
    render(
      <MantineProvider>
        <PublicLayout>
          <div>Содержимое страницы</div>
        </PublicLayout>
      </MantineProvider>,
    );

    expect(screen.getByRole("link", { name: /Calendar/ })).toBeInTheDocument();
    expect(screen.getByText("Содержимое страницы")).toBeInTheDocument();
  });
});
