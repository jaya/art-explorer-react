/** @jest-environment jsdom */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ThemeProvider } from "../ThemeProvider";

const mockUseThemeStore = jest.fn();

jest.mock("@/stores/themeStore", () => ({
  useThemeStore: () => mockUseThemeStore(),
}));

describe("ThemeProvider", () => {
  let originalClassList: DOMTokenList;
  let mockClassList: jest.Mocked<DOMTokenList>;

  beforeEach(() => {
    jest.clearAllMocks();

    originalClassList = document.documentElement.classList;

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

    Object.defineProperty(document.documentElement, "classList", {
      value: mockClassList,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(document.documentElement, "classList", {
      value: originalClassList,
      configurable: true,
    });
  });

  test("deve aplicar a classe 'dark' quando isDarkMode for true", () => {
    mockUseThemeStore.mockReturnValue({ isDarkMode: true });

    render(
      <ThemeProvider>
        <div data-testid="child">Conteúdo de teste</div>
      </ThemeProvider>
    );

    expect(mockClassList.add).toHaveBeenCalledWith("dark");
    expect(mockClassList.remove).not.toHaveBeenCalled();
  });

  test("deve remover a classe 'dark' quando isDarkMode for false", () => {
    mockUseThemeStore.mockReturnValue({ isDarkMode: false });

    render(
      <ThemeProvider>
        <div data-testid="child">Conteúdo de teste</div>
      </ThemeProvider>
    );

    expect(mockClassList.remove).toHaveBeenCalledWith("dark");
    expect(mockClassList.add).not.toHaveBeenCalled();
  });
  test("deve renderizar seus children corretamente", () => {
    mockUseThemeStore.mockReturnValue({ isDarkMode: false });

    const { getByTestId } = render(
      <ThemeProvider>
        <div data-testid="child">Conteúdo de teste</div>
      </ThemeProvider>
    );

    expect(getByTestId("child")).toBeInTheDocument();
    expect(getByTestId("child")).toHaveTextContent("Conteúdo de teste");
  });
});
