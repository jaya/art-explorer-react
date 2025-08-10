import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input Component", () => {
  it("renders with default props", () => {
    render(<Input />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("applies different input types correctly", () => {
    render(
      <div>
        <Input type="email" data-testid="email" />
        <Input type="password" data-testid="password" />
        <Input type="number" data-testid="number" />
        <Input type="search" data-testid="search" />
        <Input type="tel" data-testid="tel" />
        <Input type="url" data-testid="url" />
      </div>,
    );

    expect(screen.getByTestId("email")).toHaveAttribute("type", "email");
    expect(screen.getByTestId("password")).toHaveAttribute("type", "password");
    expect(screen.getByTestId("number")).toHaveAttribute("type", "number");
    expect(screen.getByTestId("search")).toHaveAttribute("type", "search");
    expect(screen.getByTestId("tel")).toHaveAttribute("type", "tel");
    expect(screen.getByTestId("url")).toHaveAttribute("type", "url");
  });

  it("handles user input correctly", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  it("calls onChange handler when input changes", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "test");

    expect(handleChange).toHaveBeenCalledTimes(4);
  });

  it("handles focus and blur events", async () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const user = userEvent.setup();

    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByRole("textbox");

    await user.click(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed",
    );
  });

  it("cannot be interacted with when disabled", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input disabled onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "should not work");

    expect(input).toHaveValue("");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<Input className="custom-input" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-input");
  });

  it("forwards all props to input element", () => {
    render(
      <Input
        id="test-input"
        name="test"
        value="test value"
        placeholder="Test placeholder"
        maxLength={10}
        required
        aria-label="Test input"
        data-testid="input"
        readOnly
      />,
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("id", "test-input");
    expect(input).toHaveAttribute("name", "test");
    expect(input).toHaveValue("test value");
    expect(input).toHaveAttribute("placeholder", "Test placeholder");
    expect(input).toHaveAttribute("maxLength", "10");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-label", "Test input");
    expect(input).toHaveAttribute("readonly");
  });

  it("handles placeholder text correctly", () => {
    render(<Input placeholder="Enter your email" />);

    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("placeholder:text-muted-foreground");
  });

  it("handles defaultValue prop", () => {
    render(<Input defaultValue="Default text" />);

    const input = screen.getByDisplayValue("Default text");
    expect(input).toBeInTheDocument();
  });

  it("handles controlled value prop", async () => {
    const ControlledInput = () => {
      const [value, setValue] = React.useState("initial");
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="controlled"
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledInput />);

    const input = screen.getByTestId("controlled");
    expect(input).toHaveValue("initial");

    await user.clear(input);
    await user.type(input, "new value");
    expect(input).toHaveValue("new value");
  });

  it("applies focus styles correctly", () => {
    render(<Input />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "focus-visible:border-ring",
      "focus-visible:ring-ring/50",
      "focus-visible:ring-[3px]",
    );
  });

  it("applies invalid styles when aria-invalid is true", () => {
    render(<Input aria-invalid />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "aria-invalid:ring-destructive/20",
      "aria-invalid:border-destructive",
    );
  });

  it("handles file input type with file styling", () => {
    render(<Input type="file" data-testid="file-input" />);

    const input = screen.getByTestId("file-input");
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveClass(
      "file:text-foreground",
      "file:inline-flex",
      "file:h-7",
      "file:border-0",
      "file:bg-transparent",
    );
  });

  it("handles very long text input", async () => {
    const user = userEvent.setup();
    const longText = "a".repeat(100);

    render(<Input />);

    const input = screen.getByRole("textbox");
    await user.type(input, longText);

    expect(input).toHaveValue(longText);
  }, 10000);

  it("handles special characters and emojis", async () => {
    const user = userEvent.setup();
    const specialText = "Hello @world! #test $100 & more...";

    render(<Input />);

    const input = screen.getByRole("textbox");
    await user.type(input, specialText);

    expect(input).toHaveValue(specialText);
  });

  it("maintains accessibility features", () => {
    render(
      <div>
        <label htmlFor="accessible-input">Email Address</label>
        <Input
          id="accessible-input"
          type="email"
          aria-describedby="email-help"
          aria-required="true"
        />
        <div id="email-help">Enter your email address</div>
      </div>,
    );

    const input = screen.getByLabelText("Email Address");
    expect(input).toHaveAttribute("aria-describedby", "email-help");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("handles number input with min/max constraints", async () => {
    const user = userEvent.setup();

    render(<Input type="number" min="0" max="100" />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");

    await user.type(input, "50");
    expect(input).toHaveValue(50);
  });

  it("applies correct styling classes", () => {
    render(<Input />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "border-input",
      "bg-transparent",
      "rounded-md",
      "shadow-xs",
      "transition-[color,box-shadow]",
      "outline-none",
      "h-9",
      "w-full",
      "min-w-0",
      "px-3",
      "py-1",
    );
  });
});
