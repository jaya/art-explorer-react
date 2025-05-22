import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import TypewriterSuggestion from "@/components/ui/TypewriterSuggestion"; 
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const suggestions = [
  "Van Gogh",
  "Monet",
  "Picasso",
  "Rembrandt",
  "Leonardo da Vinci",
  "Claude Lorrain",
  "Paul Cézanne",
  "Salvador Dalí",
  "Frida Kahlo",
  "Tarsila do Amaral",
];

interface HeaderProps {
  onSearch?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch = () => {} }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const commandRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions =
    query.length > 0
      ? suggestions.filter((s) =>
          s.toLowerCase().startsWith(query.toLowerCase())
        )
      : [];

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false); 
      }
    }

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions, commandRef]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between relative">
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tight hover:text-primary transition-colors"
          >
            <Icon name="palette" className="h-6 w-6 text-primary" />
            <h1>Art Explorer</h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {" "}
          <Link to="/">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              className={cn(
                "text-base gap-2",
                location.pathname === "/" && "shadow-sm"
              )}
            >
              <Icon name="paintBucket" className="h-4 w-4" />
              <span>Explorar</span>
            </Button>
          </Link>
          <Link to="/favoritos">
            <Button
              variant={location.pathname === "/favoritos" ? "default" : "ghost"}
              className={cn(
                "text-base gap-2",
                location.pathname === "/favoritos" && "shadow-sm"
              )}
            >
              <Icon name="heart" className="h-4 w-4" />
              <span>Favoritos</span>
            </Button>
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative w-72" ref={commandRef}>
            <Command className="rounded-lg border border-border bg-card dark:bg-transparent dark:border-input">
              <div className="relative flex items-center">
                <Icon
                  name="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
                <CommandInput
                  value={query}
                  onValueChange={(currentValue) => {
                    setQuery(currentValue);
                    onSearch(currentValue);
                    setShowSuggestions(currentValue.length > 0);
                  }}
                  onFocus={() => {
                    if (query.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder="Buscar obras, artistas..."
                  className="pl-10 h-10 bg-transparent dark:bg-transparent focus:ring-0 focus:border-transparent border-transparent focus:outline-none"
                />
              </div>

              {showSuggestions && (
                <CommandList className="absolute z-10 w-full bg-card rounded-lg max-h-60 overflow-y-auto p-1 mt-1 border border-border shadow-md">
                  {filteredSuggestions.length > 0 &&
                    filteredSuggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        value={suggestion}
                        onSelect={() => handleSuggestionSelect(suggestion)}
                        className="cursor-pointer"
                      >
                        <TypewriterSuggestion text={suggestion} />
                      </CommandItem>
                    ))}
                </CommandList>
              )}
            </Command>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <div className="flex-1 mr-2">
            <DropdownMenu
              onOpenChange={(open) => {
                if (!open && query.length === 0) {
                  setShowSuggestions(false);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Icon name="search" className="h-4 w-4" />
                  <span className="sr-only">Buscar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-0">
                <Command>
                  <CommandInput
                    placeholder="Buscar obras, artistas..."
                    value={query}
                    onValueChange={(currentValue) => {
                      setQuery(currentValue);
                      onSearch(currentValue);

                    }}
                    className="h-10"
                  />
                  
                  {query.length > 0 && (
                    <CommandList className="p-1">
                      {filteredSuggestions.length > 0 &&
                        filteredSuggestions.map((suggestion) => (
                          <CommandItem
                            key={suggestion}
                            value={suggestion}
                            onSelect={() => {
                              handleSuggestionSelect(suggestion);
                            }}
                            className="cursor-pointer"
                          >
                            <TypewriterSuggestion text={suggestion} />
                          </CommandItem>
                        ))}
                    </CommandList>
                  )}
                </Command>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="ml-2 rounded-full"
              >
                <Icon name="menu" className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <Icon name="close" className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col space-y-4">
                  <SheetClose asChild>
                    <Link to="/">
                      <Button
                        variant={
                          location.pathname === "/" ? "default" : "ghost"
                        }
                        className="w-full justify-start gap-2"
                      >
                        <Icon name="paintBucket" className="h-4 w-4" />
                        <span>Explorar</span>
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/favoritos">
                      <Button
                        variant={
                          location.pathname === "/favoritos"
                            ? "default"
                            : "ghost"
                        }
                        className="w-full justify-start gap-2"
                      >
                        <Icon name="heart" className="h-4 w-4" />
                        <span>Favoritos</span>
                      </Button>
                    </Link>
                  </SheetClose>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
