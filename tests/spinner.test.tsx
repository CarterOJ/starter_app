import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Spinner from "../components/spinner";

describe("Spinner Component", () => {
  // Test default rendering
  it("renders with default medium size", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-label", "Loading");
  });

  // Test small size variant
  it("renders with small size", () => {
    render(<Spinner size="sm" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-6", "h-6", "border-2");
  });

  // Test large size variant
  it("renders with large size", () => {
    render(<Spinner size="lg" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-16", "h-16", "border-4");
  });

  // Test accessibility: screen reader text
  it("has screen reader text", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
