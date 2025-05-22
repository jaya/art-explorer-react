import { useThemeStore } from "../themeStore";

describe("useThemeStore", () => {
  beforeEach(() => {
    // Garante que o estado está limpo antes de cada teste
    useThemeStore.setState({ isDarkMode: false });
  });

  it("deve iniciar com isDarkMode como booleano", () => {
    expect(typeof useThemeStore.getState().isDarkMode).toBe("boolean");
  });

  it("deve alternar o tema corretamente", () => {
    const initial = useThemeStore.getState().isDarkMode;
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().isDarkMode).toBe(!initial);
  });
});
