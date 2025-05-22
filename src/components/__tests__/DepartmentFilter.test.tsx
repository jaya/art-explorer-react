// src/components/__tests__/DepartmentFilter.test.tsx
import { departments } from "@/constants/departments";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import DepartmentFilter from "../DepartmentFilter";

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu" {...props}>
      {children}
    </div>
  ),
  DropdownMenuTrigger: ({
    children,
    asChild,
    ...props
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => (
    <div data-testid="dropdown-trigger" data-aschild={asChild} {...props}>
      {children}
    </div>
  ),
  DropdownMenuContent: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="dropdown-content" className={className} {...props}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({
    children,
    onSelect,
    className,
    ...props
  }: {
    children: React.ReactNode;
    onSelect?: () => void;
    className?: string;
  }) => (
    <div
      data-testid="dropdown-item"
      data-selected={className?.includes("bg-accent") ? "true" : "false"}
      onClick={onSelect}
      {...props}
    >
      {children}
    </div>
  ),
  DropdownMenuLabel: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  }) => (
    <div data-testid="dropdown-label" {...props}>
      {children}
    </div>
  ),
  DropdownMenuSeparator: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr data-testid="dropdown-separator" {...props} />
  ),
}));

jest.mock("@/components/ui/icon", () => ({
  __esModule: true,
  default: ({ name, className }: { name: string; className: string }) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    className,
    variant,
    whileHover,
    whileTap,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    variant?: string;
    whileHover?: unknown;
    whileTap?: unknown;
  }) => (
    <button
      data-testid="button"
      className={className}
      data-variant={variant}
      data-has-whilehover={whileHover ? "true" : "false"}
      data-has-whiletap={whileTap ? "true" : "false"}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe("Componente DepartmentFilter", () => {
  const mockOnSelectDepartment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve renderizar com 'Todos os departamentos' quando nenhum departamento está selecionado", () => {
    render(
      <DepartmentFilter
        selectedDepartment={null}
        onSelectDepartment={mockOnSelectDepartment}
      />
    );

    const triggerElement = screen.getByTestId("dropdown-trigger");
    expect(triggerElement.textContent).toContain("Todos os departamentos");

    const buildingIcons = screen.getAllByTestId("icon-building");
    expect(buildingIcons.length).toBeGreaterThan(0);
  });

  test("deve exibir o nome correto do departamento quando um ID é selecionado", () => {
    const departmentId = "11";
    const departmentName = "European Paintings";

    render(
      <DepartmentFilter
        selectedDepartment={departmentId}
        onSelectDepartment={mockOnSelectDepartment}
      />
    );

    const triggerElement = screen.getByTestId("dropdown-trigger");
    expect(triggerElement.textContent).toContain(departmentName);
  });

  test("deve mostrar todos os departamentos no menu dropdown", () => {
    render(
      <DepartmentFilter
        selectedDepartment={null}
        onSelectDepartment={mockOnSelectDepartment}
      />
    );

    const dropdownContent = screen.getByTestId("dropdown-content");

    departments.forEach((department) => {
      expect(dropdownContent.textContent).toContain(department.name);
    });

    expect(dropdownContent.textContent).toContain("Todos os departamentos");
  });

  test("deve chamar onSelectDepartment quando um departamento é selecionado", () => {
    render(
      <DepartmentFilter
        selectedDepartment={null}
        onSelectDepartment={mockOnSelectDepartment}
      />
    );

    const departmentItems = screen.getAllByTestId("dropdown-item");

    const modernArtItem = departmentItems.find((item) =>
      item.textContent?.includes("Modern Art")
    );

    fireEvent.click(modernArtItem!);

    expect(mockOnSelectDepartment).toHaveBeenCalledWith("21");
  });

  test("deve destacar o departamento selecionado no menu", () => {
    const departmentId = "6";

    render(
      <DepartmentFilter
        selectedDepartment={departmentId}
        onSelectDepartment={mockOnSelectDepartment}
      />
    );

    const dropdownItems = screen.getAllByTestId("dropdown-item");

    const selectedItem = dropdownItems.find((item) =>
      item.textContent?.includes("Asian Art")
    );

    expect(selectedItem).toHaveAttribute("data-selected", "true");

    const nonSelectedItems = dropdownItems.filter(
      (item) => !item.textContent?.includes("Asian Art")
    );

    expect(
      nonSelectedItems.some(
        (item) => item.getAttribute("data-selected") === "false"
      )
    ).toBeTruthy();
  });
});
