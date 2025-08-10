import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("applies different variants correctly", () => {
    render(
      <div>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>,
    );

    expect(screen.getByRole("button", { name: /default/i })).toHaveClass(
      "bg-primary",
    );
    expect(screen.getByRole("button", { name: /destructive/i })).toHaveClass(
      "bg-destructive",
    );
    expect(screen.getByRole("button", { name: /outline/i })).toHaveClass(
      "border",
    );
    expect(screen.getByRole("button", { name: /secondary/i })).toHaveClass(
      "bg-secondary",
    );
    expect(screen.getByRole("button", { name: /ghost/i })).toHaveClass(
      "hover:bg-accent",
    );
    expect(screen.getByRole("button", { name: /link/i })).toHaveClass(
      "underline-offset-4",
    );
  });

  it("applies different sizes correctly", () => {
    render(
      <div>
        <Button size="default">Default Size</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">Icon</Button>
      </div>,
    );

    expect(screen.getByRole("button", { name: /default size/i })).toHaveClass(
      "h-9",
    );
    expect(screen.getByRole("button", { name: /small/i })).toHaveClass("h-8");
    expect(screen.getByRole("button", { name: /large/i })).toHaveClass("h-10");
    expect(screen.getByRole("button", { name: /icon/i })).toHaveClass("size-9");
  });

  it("handles click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });

  it("renders as child when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole("button", { name: /custom button/i });
    expect(button).toHaveClass("custom-class");
  });
});
