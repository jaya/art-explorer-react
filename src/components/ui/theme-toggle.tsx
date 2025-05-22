import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useThemeStore } from "@/stores/themeStore";

export function ThemeToggle() {
  const { toggleTheme } = useThemeStore();

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={toggleTheme}
      aria-label="Alternar tema"
    >
      <Icon
        name="sun"
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Icon
        name="moon"
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
