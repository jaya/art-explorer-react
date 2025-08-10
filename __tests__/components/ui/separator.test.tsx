import { render, screen } from "@testing-library/react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

describe("Separator Component", () => {
  it("renders with default props", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-slot", "separator");
    expect(separator).toHaveAttribute("role", "none");
  });

  it("applies horizontal orientation by default", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
    expect(separator).toHaveClass("data-[orientation=horizontal]:h-px");
    expect(separator).toHaveClass("data-[orientation=horizontal]:w-full");
  });

  it("applies vertical orientation correctly", () => {
    render(<Separator orientation="vertical" data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
    expect(separator).toHaveClass("data-[orientation=vertical]:h-full");
    expect(separator).toHaveClass("data-[orientation=vertical]:w-px");
  });

  it("is decorative by default", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
    expect(separator).toHaveAttribute("role", "none");
  });

  it("handles non-decorative separator", () => {
    render(<Separator decorative={false} data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("role", "separator");
  });

  it("applies custom className", () => {
    render(<Separator className="custom-separator" data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toHaveClass("custom-separator");
  });

  it("forwards all props to the root element", () => {
    render(
      <Separator
        id="test-separator"
        data-testid="separator"
        aria-label="Content divider"
        title="Separator tooltip"
      />,
    );

    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("id", "test-separator");
    expect(separator).toHaveAttribute("aria-label", "Content divider");
    expect(separator).toHaveAttribute("title", "Separator tooltip");
  });

  it("applies correct base styling classes", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toHaveClass("bg-border", "shrink-0");
  });

  it("works in horizontal layout context", () => {
    render(
      <div className="flex flex-col space-y-4">
        <div>Content above</div>
        <Separator data-testid="separator" />
        <div>Content below</div>
      </div>,
    );

    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getByText("Content above")).toBeInTheDocument();
    expect(screen.getByText("Content below")).toBeInTheDocument();
  });

  it("works in vertical layout context", () => {
    render(
      <div className="flex items-center space-x-4">
        <div>Left content</div>
        <Separator
          orientation="vertical"
          className="h-6"
          data-testid="separator"
        />
        <div>Right content</div>
      </div>,
    );

    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
    expect(separator).toHaveClass("h-6");
    expect(screen.getByText("Left content")).toBeInTheDocument();
    expect(screen.getByText("Right content")).toBeInTheDocument();
  });

  it("handles both orientations with custom styling", () => {
    render(
      <div>
        <Separator
          orientation="horizontal"
          className="my-4 bg-red-500"
          data-testid="horizontal"
        />
        <Separator
          orientation="vertical"
          className="mx-4 bg-blue-500 h-10"
          data-testid="vertical"
        />
      </div>,
    );

    const horizontalSeparator = screen.getByTestId("horizontal");
    const verticalSeparator = screen.getByTestId("vertical");

    expect(horizontalSeparator).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
    expect(horizontalSeparator).toHaveClass("my-4", "bg-red-500");

    expect(verticalSeparator).toHaveAttribute("data-orientation", "vertical");
    expect(verticalSeparator).toHaveClass("mx-4", "bg-blue-500", "h-10");
  });

  it("maintains accessibility with proper role", () => {
    render(
      <div>
        <section aria-label="Section 1">
          <p>First section content</p>
        </section>
        <Separator aria-label="Section divider" decorative={false} />
        <section aria-label="Section 2">
          <p>Second section content</p>
        </section>
      </div>,
    );

    const separator = screen.getByLabelText("Section divider");
    expect(separator).toHaveAttribute("role", "separator");
    expect(separator).toBeInTheDocument();
  });

  it("works with complex layout structures", () => {
    render(
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Separator className="my-6" data-testid="horizontal-sep" />
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div>Blog</div>
          <Separator orientation="vertical" data-testid="vertical-sep-1" />
          <div>Docs</div>
          <Separator orientation="vertical" data-testid="vertical-sep-2" />
          <div>Source</div>
        </div>
      </div>,
    );

    const horizontalSeparator = screen.getByTestId("horizontal-sep");
    const verticalSeparator1 = screen.getByTestId("vertical-sep-1");
    const verticalSeparator2 = screen.getByTestId("vertical-sep-2");

    expect(horizontalSeparator).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
    expect(horizontalSeparator).toHaveClass("my-6");

    expect(verticalSeparator1).toHaveAttribute("data-orientation", "vertical");
    expect(verticalSeparator2).toHaveAttribute("data-orientation", "vertical");
  });

  it("handles decorative prop correctly", () => {
    render(
      <div>
        <Separator decorative={true} data-testid="decorative" />
        <Separator decorative={false} data-testid="non-decorative" />
      </div>,
    );

    const decorativeSeparator = screen.getByTestId("decorative");
    const nonDecorativeSeparator = screen.getByTestId("non-decorative");

    expect(decorativeSeparator).toBeInTheDocument();
    expect(nonDecorativeSeparator).toBeInTheDocument();

    expect(decorativeSeparator).toHaveAttribute("role", "none");
    expect(nonDecorativeSeparator).toHaveAttribute("role", "separator");
  });

  it("renders without content", () => {
    render(<Separator data-testid="empty-separator" />);

    const separator = screen.getByTestId("empty-separator");
    expect(separator).toBeInTheDocument();
    expect(separator.textContent).toBe("");
  });

  it("handles edge case with custom orientation values", () => {
    render(
      <Separator orientation="horizontal" data-testid="horizontal-separator" />,
    );

    const separator = screen.getByTestId("horizontal-separator");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("applies orientation-specific classes correctly", () => {
    const { rerender } = render(
      <Separator orientation="horizontal" data-testid="test-separator" />,
    );

    let separator = screen.getByTestId("test-separator");
    expect(separator).toHaveClass("data-[orientation=horizontal]:h-px");
    expect(separator).toHaveClass("data-[orientation=horizontal]:w-full");

    rerender(<Separator orientation="vertical" data-testid="test-separator" />);

    separator = screen.getByTestId("test-separator");
    expect(separator).toHaveClass("data-[orientation=vertical]:h-full");
    expect(separator).toHaveClass("data-[orientation=vertical]:w-px");
  });

  it("integrates well with navigation menus", () => {
    render(
      <nav className="flex items-center space-x-4 lg:space-x-6">
        <Link href="/" className="text-sm font-medium">
          Home
        </Link>
        <Separator orientation="vertical" className="h-4" decorative={false} />
        <Link href="/about" className="text-sm font-medium">
          About
        </Link>
        <Separator orientation="vertical" className="h-4" decorative={false} />
        <Link href="/contact" className="text-sm font-medium">
          Contact
        </Link>
      </nav>,
    );

    const separators = screen.getAllByRole("separator");
    expect(separators).toHaveLength(2);

    separators.forEach((separator) => {
      expect(separator).toHaveAttribute("data-orientation", "vertical");
      expect(separator).toHaveClass("h-4");
    });

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });
});
