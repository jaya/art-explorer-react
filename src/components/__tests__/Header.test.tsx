/** @jest-environment jsdom */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

// Mock do componente ThemeToggle
jest.mock("@/components/ui/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="mock-theme-toggle">Theme Toggle</div>,
}));

// Mock do TypewriterSuggestion
jest.mock("@/components/ui/TypewriterSuggestion", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => (
    <div data-testid="typewriter-suggestion">{text}</div>
  ),
}));

// Mock do componente Icon
jest.mock("@/components/ui/icon", () => ({
  __esModule: true,
  default: ({ name, className }: { name: string; className?: string }) => (
    <div data-testid={`icon-${name}`} className={className}>
      {name}
    </div>
  ),
}));

// Mock para react-router-dom
jest.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to} data-testid={`link-${to}`}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: "/" }),
}));

// Mock dos componentes UI
jest.mock("@/components/ui/command", () => ({
  Command: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command">{children}</div>
  ),
  CommandInput: ({ placeholder }: { placeholder: string }) => (
    <input data-testid="command-input" placeholder={placeholder} />
  ),
  CommandList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command-list">{children}</div>
  ),
  CommandItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command-item">{children}</div>
  ),
}));

// Mock do componente Button
jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    variant?: string;
    className?: string;
  }) => (
    <button data-testid="button" className={className}>
      {children}
    </button>
  ),
}));

describe("Header", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve renderizar corretamente todos os elementos do Header", () => {
    render(<Header onSearch={mockOnSearch} />);

    // Logo e título
    expect(screen.getByTestId("icon-palette")).toBeInTheDocument();
    expect(screen.getByText("Art Explorer")).toBeInTheDocument();

    // Links de navegação
    // Verifica o primeiro link para a home, que deve ser o do logo/título.
    const homeLinks = screen.getAllByTestId("link-/");
    expect(homeLinks[0]).toBeInTheDocument();
    expect(screen.getByTestId("link-/favoritos")).toBeInTheDocument();

    // Input de busca
    expect(
      screen.getByPlaceholderText("Buscar obras, artistas...")
    ).toBeInTheDocument();

    // ThemeToggle - Verifica se ambos os toggles (desktop e mobile) estão presentes
    const themeToggles = screen.getAllByTestId("mock-theme-toggle");
    expect(themeToggles.length).toBe(2);
    themeToggles.forEach((toggle) => expect(toggle).toBeInTheDocument());

    // Elementos mobile (ícones)
    // Verifica se ambos os ícones de busca (desktop e mobile) estão presentes
    const searchIcons = screen.getAllByTestId("icon-search");
    expect(searchIcons.length).toBe(2);
    searchIcons.forEach((icon) => expect(icon).toBeInTheDocument());

    expect(screen.getByTestId("icon-menu")).toBeInTheDocument();
  });
});
