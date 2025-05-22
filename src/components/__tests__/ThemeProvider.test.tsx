/** @jest-environment jsdom */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ThemeProvider } from "../ThemeProvider";

// Mock do useThemeStore
const mockUseThemeStore = jest.fn();

jest.mock("@/stores/themeStore", () => ({
  useThemeStore: () => mockUseThemeStore(),
}));

describe("ThemeProvider", () => {
  // Setup para acessar a classe do elemento HTML
  let originalClassList: DOMTokenList;
  let mockClassList: jest.Mocked<DOMTokenList>;

  beforeEach(() => {
    // Reset todos os mocks
    jest.clearAllMocks();

    // Salva o classList original
    originalClassList = document.documentElement.classList;

    // Cria mock para classList
    mockClassList = {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
      toggle: jest.fn(),
      replace: jest.fn(),
      supports: jest.fn(),
      entries: jest.fn(),
      forEach: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      item: jest.fn(),
      toString: jest.fn(),
      [Symbol.iterator]: jest.fn(),
    } as unknown as jest.Mocked<DOMTokenList>;

    // Substitui o classList com o mock
    Object.defineProperty(document.documentElement, "classList", {
      value: mockClassList,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restaura o classList original
    Object.defineProperty(document.documentElement, "classList", {
      value: originalClassList,
      configurable: true,
    });
  });

  test("deve aplicar a classe 'dark' quando isDarkMode for true", () => {
    // Configura o mock para retornar isDarkMode como true
    mockUseThemeStore.mockReturnValue({ isDarkMode: true });

    // Renderiza o componente
    render(
      <ThemeProvider>
        <div data-testid="child">Conteúdo de teste</div>
      </ThemeProvider>
    );

    // Verifica se a classe 'dark' foi adicionada
    expect(mockClassList.add).toHaveBeenCalledWith("dark");
    expect(mockClassList.remove).not.toHaveBeenCalled();
  });

  test("deve remover a classe 'dark' quando isDarkMode for false", () => {
    // Configura o mock para retornar isDarkMode como false
    mockUseThemeStore.mockReturnValue({ isDarkMode: false });

    // Renderiza o componente
    render(
      <ThemeProvider>
        <div data-testid="child">Conteúdo de teste</div>
      </ThemeProvider>
    );

    // Verifica se a classe 'dark' foi removida
    expect(mockClassList.remove).toHaveBeenCalledWith("dark");
    expect(mockClassList.add).not.toHaveBeenCalled();
  });
  test("deve renderizar seus children corretamente", () => {
    // Configura o mock
    mockUseThemeStore.mockReturnValue({ isDarkMode: false });

    // Renderiza o componente
    const { getByTestId } = render(
      <ThemeProvider>
        <div data-testid="child">Conteúdo de teste</div>
      </ThemeProvider>
    );

    // Verifica se o conteúdo filho foi renderizado
    expect(getByTestId("child")).toBeInTheDocument();
    expect(getByTestId("child")).toHaveTextContent("Conteúdo de teste");
  });
});
