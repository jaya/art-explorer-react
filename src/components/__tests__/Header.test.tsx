/** @jest-environment jsdom */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

jest.mock("@/components/ui/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="mock-theme-toggle">Theme Toggle</div>,
}));

jest.mock("@/components/ui/TypewriterSuggestion", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => (
    <div data-testid="typewriter-suggestion">{text}</div>
  ),
}));

jest.mock("@/components/ui/icon", () => ({
  __esModule: true,
  default: ({ name, className }: { name: string; className?: string }) => (
    <div data-testid={`icon-${name}`} className={className}>
      {name}
    </div>
  ),
}));

jest.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to} data-testid={`link-${to}`}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: "/" }),
}));

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

    expect(screen.getByTestId("icon-palette")).toBeInTheDocument();
    expect(screen.getByText("Art Explorer")).toBeInTheDocument();

    const homeLinks = screen.getAllByTestId("link-/");
    expect(homeLinks[0]).toBeInTheDocument();
    expect(screen.getByTestId("link-/favoritos")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Buscar obras, artistas...")
    ).toBeInTheDocument();

    const themeToggles = screen.getAllByTestId("mock-theme-toggle");
    expect(themeToggles.length).toBe(2);
    themeToggles.forEach((toggle) => expect(toggle).toBeInTheDocument());

    const searchIcons = screen.getAllByTestId("icon-search");
    expect(searchIcons.length).toBe(2);
    searchIcons.forEach((icon) => expect(icon).toBeInTheDocument());

    expect(screen.getByTestId("icon-menu")).toBeInTheDocument();
  });
});
