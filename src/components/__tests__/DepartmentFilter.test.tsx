// src/components/__tests__/DepartmentFilter.test.tsx
import { departments } from "@/constants/departments";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import DepartmentFilter from "../DepartmentFilter";

// Mock para o componente DropdownMenu do Radix UI
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

// Mock para o componente Icon
jest.mock("@/components/ui/icon", () => ({
  __esModule: true,
  default: ({ name, className }: { name: string; className: string }) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
}));

// Mock para o componente Button
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

    // Verifica se o botão do trigger contém "Todos os departamentos"
    // Usando uma query mais específica para evitar duplicidade
    const triggerElement = screen.getByTestId("dropdown-trigger");
    expect(triggerElement.textContent).toContain("Todos os departamentos");

    // Verifica se o ícone de edifício está presente no trigger
    // Usando getAllByTestId e verificando se pelo menos um existe
    const buildingIcons = screen.getAllByTestId("icon-building");
    expect(buildingIcons.length).toBeGreaterThan(0);
  });

  test("deve exibir o nome correto do departamento quando um ID é selecionado", () => {
    // Selecionar o departamento "European Paintings" com ID 11
    const departmentId = "11";
    const departmentName = "European Paintings";

    render(
      <DepartmentFilter
        selectedDepartment={departmentId}
        onSelectDepartment={mockOnSelectDepartment}
      />
    );

    // Verifica se o botão contém o nome do departamento selecionado
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

    // Verifica o conteúdo do dropdown
    const dropdownContent = screen.getByTestId("dropdown-content");

    // Verifica se todos os departamentos estão presentes no menu
    departments.forEach((department) => {
      expect(dropdownContent.textContent).toContain(department.name);
    });

    // Verifica se "Todos os departamentos" também está presente
    expect(dropdownContent.textContent).toContain("Todos os departamentos");
  });

  test("deve chamar onSelectDepartment quando um departamento é selecionado", () => {
    render(
      <DepartmentFilter
        selectedDepartment={null}
        onSelectDepartment={mockOnSelectDepartment}
      />
    );

    // Encontra os itens de dropdown e clica no departamento "Modern Art"
    const departmentItems = screen.getAllByTestId("dropdown-item");

    // Filtra o item que contém o texto "Modern Art"
    const modernArtItem = departmentItems.find((item) =>
      item.textContent?.includes("Modern Art")
    );

    // Clica no item
    fireEvent.click(modernArtItem!);

    // Verifica se a função de callback foi chamada com o ID correto
    expect(mockOnSelectDepartment).toHaveBeenCalledWith("21");
  });

  test("deve destacar o departamento selecionado no menu", () => {
    // Seleciona o departamento "Asian Art" com ID 6
    const departmentId = "6";

    render(
      <DepartmentFilter
        selectedDepartment={departmentId}
        onSelectDepartment={mockOnSelectDepartment}
      />
    );

    // Obtém todos os itens de dropdown
    const dropdownItems = screen.getAllByTestId("dropdown-item");

    // O item correspondente a "Asian Art" deve ter o atributo data-selected="true"
    const selectedItem = dropdownItems.find((item) =>
      item.textContent?.includes("Asian Art")
    );

    expect(selectedItem).toHaveAttribute("data-selected", "true");

    // Os outros itens não devem estar selecionados
    const nonSelectedItems = dropdownItems.filter(
      (item) => !item.textContent?.includes("Asian Art")
    );

    // Verifica que pelo menos alguns não estão selecionados
    expect(
      nonSelectedItems.some(
        (item) => item.getAttribute("data-selected") === "false"
      )
    ).toBeTruthy();
  });
});
