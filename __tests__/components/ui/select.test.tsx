import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";

describe("Select Components", () => {
  describe("Select Root", () => {
    it("renders with default props", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeInTheDocument();
    });

    it("respects defaultValue", () => {
      render(
        <Select defaultValue="option2">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeInTheDocument();
    });

    it("is disabled when disabled prop is true", () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });
  });

  describe("SelectTrigger", () => {
    it("renders with default props", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("data-slot", "select-trigger");
      expect(trigger).toHaveAttribute("data-size", "default");
    });

    it("applies small size correctly", () => {
      render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("data-size", "sm");
      expect(trigger).toHaveClass("data-[size=sm]:h-8");
    });

    it("applies custom className", () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass("custom-trigger");
    });

    it("shows chevron down icon", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      const chevron = trigger.querySelector("svg");
      expect(chevron).toBeInTheDocument();
      expect(chevron).toHaveClass("size-4", "opacity-50");
    });

    it("applies correct styling classes", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass(
        "border-input",
        "flex",
        "w-fit",
        "items-center",
        "justify-between",
        "gap-2",
        "rounded-md",
        "border",
        "bg-transparent",
        "px-3",
        "py-2",
      );
    });
  });

  describe("SelectValue", () => {
    it("shows placeholder when no value is selected", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
        </Select>,
      );

      expect(screen.getByText("Choose an option")).toBeInTheDocument();
    });

    it("has correct data attributes", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue data-testid="select-value" />
          </SelectTrigger>
        </Select>,
      );

      const selectValue = screen.getByTestId("select-value");
      expect(selectValue).toHaveAttribute("data-slot", "select-value");
    });
  });

  describe("Accessibility", () => {
    it("maintains proper ARIA attributes", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("supports custom accessibility attributes", () => {
      render(
        <Select>
          <SelectTrigger
            aria-label="Choose an option"
            aria-describedby="help-text"
          >
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-label", "Choose an option");
      expect(trigger).toHaveAttribute("aria-describedby", "help-text");
    });
  });

  describe("Component Integration", () => {
    it("handles basic props and styling", () => {
      render(
        <Select>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      const placeholder = screen.getByText("Select a framework");

      expect(trigger).toHaveClass("w-[280px]");
      expect(placeholder).toBeInTheDocument();
    });

    it("renders with focus and invalid states", () => {
      render(
        <Select>
          <SelectTrigger aria-invalid>
            <SelectValue placeholder="Invalid select" />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass("aria-invalid:border-destructive");
    });
  });
});
