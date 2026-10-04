import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the home page", () => {
    render(<HomePage />);
    expect(screen.getByText("Home page")).toBeInTheDocument();
  });
});
