import { MantineProvider } from "@mantine/core";
import { cleanup, render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PublicHeader } from "./PublicHeader";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockedUsePathname = vi.mocked(usePathname);

afterEach(() => {
  cleanup();
  mockedUsePathname.mockReset();
});

function renderPublicHeader() {
  return render(
    <MantineProvider>
      <PublicHeader />
    </MantineProvider>,
  );
}

describe("PublicHeader", () => {
  it("links the logo to the home page", () => {
    mockedUsePathname.mockReturnValue("/");
    renderPublicHeader();

    expect(screen.getByRole("link", { name: /Calendar/ })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("links to the event type catalog and the admin section", () => {
    mockedUsePathname.mockReturnValue("/");
    renderPublicHeader();

    expect(screen.getByRole("link", { name: "Записаться" })).toHaveAttribute(
      "href",
      "/book",
    );
    expect(screen.getByRole("link", { name: "Админка" })).toHaveAttribute(
      "href",
      "/admin",
    );
  });

  it("marks the catalog link active on its route and sub-routes", () => {
    mockedUsePathname.mockReturnValue("/book/15min");
    renderPublicHeader();

    expect(screen.getByRole("link", { name: "Записаться" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Админка" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("marks the admin link active on its sub-routes", () => {
    mockedUsePathname.mockReturnValue("/admin/upcoming");
    renderPublicHeader();

    expect(screen.getByRole("link", { name: "Админка" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Записаться" }),
    ).not.toHaveAttribute("aria-current");
  });
});
