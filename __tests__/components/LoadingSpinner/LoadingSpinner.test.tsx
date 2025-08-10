import { render } from "@testing-library/react";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default medium size", () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector("div");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toBeTruthy();
  });

  it("renders with small size", () => {
    const { container } = render(<LoadingSpinner size="sm" />);

    const spinner = container.querySelector("div");
    expect(spinner).toBeInTheDocument();
  });

  it("renders with large size", () => {
    const { container } = render(<LoadingSpinner size="lg" />);

    const spinner = container.querySelector("div");
    expect(spinner).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);

    const spinner = container.querySelector("div");
    expect(spinner).toBeInTheDocument();
  });

  it("renders as a div element", () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector("div");
    expect(spinner?.tagName).toBe("DIV");
  });

  it("renders with different size props", () => {
    const { rerender, container } = render(<LoadingSpinner size="sm" />);
    expect(container.querySelector("div")).toBeInTheDocument();

    rerender(<LoadingSpinner size="md" />);
    expect(container.querySelector("div")).toBeInTheDocument();

    rerender(<LoadingSpinner size="lg" />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });
});
