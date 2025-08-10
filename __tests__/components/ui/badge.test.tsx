import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Badge } from "@/components/ui/badge";

describe("Badge Component", () => {
  it("renders with default props", () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge.tagName).toBe("SPAN");
  });

  it("applies different variants correctly", () => {
    render(
      <div>
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>,
    );

    expect(screen.getByText("Default")).toHaveClass(
      "bg-primary",
      "text-primary-foreground",
    );
    expect(screen.getByText("Secondary")).toHaveClass(
      "bg-secondary",
      "text-secondary-foreground",
    );
    expect(screen.getByText("Destructive")).toHaveClass(
      "bg-destructive",
      "text-white",
    );
    expect(screen.getByText("Outline")).toHaveClass("text-foreground");
  });

  it("applies default variant when no variant is specified", () => {
    render(<Badge>No Variant</Badge>);

    const badge = screen.getByText("No Variant");
    expect(badge).toHaveClass("bg-primary", "text-primary-foreground");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-badge">Custom Badge</Badge>);

    const badge = screen.getByText("Custom Badge");
    expect(badge).toHaveClass("custom-badge");
  });

  it("renders as child when asChild is true", () => {
    render(
      <Badge asChild>
        <a href="/link">Link Badge</a>
      </Badge>,
    );

    const link = screen.getByRole("link", { name: /link badge/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/link");
    expect(link).toHaveAttribute("data-slot", "badge");
  });

  it("handles click events when interactive", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Badge asChild>
        <button onClick={handleClick}>Clickable Badge</button>
      </Badge>,
    );

    const button = screen.getByRole("button", { name: /clickable badge/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("forwards all props to span element", () => {
    render(
      <Badge
        id="test-badge"
        role="status"
        aria-label="Test badge"
        data-testid="badge"
        title="Badge tooltip"
      >
        Test Badge
      </Badge>,
    );

    const badge = screen.getByTestId("badge");
    expect(badge).toHaveAttribute("id", "test-badge");
    expect(badge).toHaveAttribute("role", "status");
    expect(badge).toHaveAttribute("aria-label", "Test badge");
    expect(badge).toHaveAttribute("title", "Badge tooltip");
  });

  it("handles empty content", () => {
    render(<Badge data-testid="empty-badge" />);

    const badge = screen.getByTestId("empty-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("handles long text content", () => {
    const longText =
      "This is a very long badge text that might wrap or truncate";
    render(<Badge>{longText}</Badge>);

    const badge = screen.getByText(longText);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("whitespace-nowrap"); // ensures no wrapping
  });

  it("handles special characters and emojis", () => {
    const specialText = "🚀 New! @user #tag $100";
    render(<Badge>{specialText}</Badge>);

    const badge = screen.getByText(specialText);
    expect(badge).toBeInTheDocument();
  });

  it("applies correct base styling classes", () => {
    render(<Badge>Styled Badge</Badge>);

    const badge = screen.getByText("Styled Badge");
    expect(badge).toHaveClass(
      "inline-flex",
      "items-center",
      "justify-center",
      "rounded-md",
      "border",
      "px-2",
      "py-0.5",
      "text-xs",
      "font-medium",
      "w-fit",
      "whitespace-nowrap",
      "shrink-0",
    );
  });

  it("applies focus styles correctly", () => {
    render(<Badge>Focus Badge</Badge>);

    const badge = screen.getByText("Focus Badge");
    expect(badge).toHaveClass(
      "focus-visible:border-ring",
      "focus-visible:ring-ring/50",
      "focus-visible:ring-[3px]",
    );
  });

  it("applies invalid styles when aria-invalid is true", () => {
    render(<Badge aria-invalid>Invalid Badge</Badge>);

    const badge = screen.getByText("Invalid Badge");
    expect(badge).toHaveClass(
      "aria-invalid:ring-destructive/20",
      "aria-invalid:border-destructive",
    );
  });

  it("handles svg icons correctly", () => {
    render(
      <Badge>
        <svg data-testid="icon" width="12" height="12">
          <circle cx="6" cy="6" r="6" />
        </svg>
        Badge with icon
      </Badge>,
    );

    const badge = screen.getByText("Badge with icon");
    const icon = screen.getByTestId("icon");

    expect(badge).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(badge).toHaveClass(
      "[&>svg]:size-3",
      "gap-1",
      "[&>svg]:pointer-events-none",
    );
  });

  it("works with asChild and button for interactive badge", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Badge variant="outline" asChild>
        <button onClick={handleClick} type="button">
          Interactive Outline Badge
        </button>
      </Badge>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-foreground");

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("maintains accessibility when used as status indicator", () => {
    render(
      <div>
        <span id="status-label">Status:</span>
        <Badge
          role="status"
          aria-labelledby="status-label"
          variant="destructive"
        >
          Error
        </Badge>
      </div>,
    );

    const badge = screen.getByRole("status");
    expect(badge).toHaveAttribute("aria-labelledby", "status-label");
    expect(badge).toHaveClass("bg-destructive", "text-white");
  });

  it("handles multiple badges in a container", () => {
    render(
      <div>
        <Badge variant="default">Tag 1</Badge>
        <Badge variant="secondary">Tag 2</Badge>
        <Badge variant="outline">Tag 3</Badge>
      </div>,
    );

    expect(screen.getByText("Tag 1")).toBeInTheDocument();
    expect(screen.getByText("Tag 2")).toBeInTheDocument();
    expect(screen.getByText("Tag 3")).toBeInTheDocument();
  });

  it("applies hover styles for interactive variants", () => {
    render(
      <Badge variant="default" asChild>
        <a href="/test">Hoverable Badge</a>
      </Badge>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("[a&]:hover:bg-primary/90");
  });

  it("handles overflow correctly", () => {
    render(<Badge>Badge</Badge>);

    const badge = screen.getByText("Badge");
    expect(badge).toHaveClass("overflow-hidden");
  });

  it("applies transition effects", () => {
    render(<Badge>Transition Badge</Badge>);

    const badge = screen.getByText("Transition Badge");
    expect(badge).toHaveClass("transition-[color,box-shadow]");
  });

  it("works with complex content structure", () => {
    render(
      <Badge variant="secondary">
        <span>Count:</span>
        <strong>42</strong>
      </Badge>,
    );

    const badge = screen.getByText("Count:").parentElement;
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});
