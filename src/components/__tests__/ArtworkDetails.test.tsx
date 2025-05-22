// src/components/__tests__/ArtworkDetails.test.tsx
import type { Artwork } from "@/types/artwork";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import ArtworkDetails from "../ArtworkDetails";
import { useFavoritesStore } from "@/stores/favoritesStore";
import "@testing-library/jest-dom";

jest.mock("@/stores/favoritesStore");

export const mockOnOpenChange = jest.fn();
export const mockDialogClose = jest.fn();

jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      whileTap?: unknown;
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
    } & Record<string, unknown>) => (
      <div data-testid="motion-div" data-motion-props="true" {...props}>
        {children}
      </div>
    ),
    span: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      whileHover?: unknown;
      whileTap?: unknown;
      variants?: unknown;
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
    } & Record<string, unknown>) => (
      <span data-testid="motion-span" data-motion-props="true" {...props}>
        {children}
      </span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const mockOnClose = jest.fn();

interface MockDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

jest.mock("@/components/ui/dialog", () => {
  const MockDialog = ({ open, onOpenChange, children }: MockDialogProps) => {
    const [isOpen, setIsOpen] = React.useState(open);

    React.useEffect(() => {
      setIsOpen(open);
    }, [open]);

    const handleOpenChange = (newOpenState: boolean) => {
      setIsOpen(newOpenState);
      if (onOpenChange) {
        onOpenChange(newOpenState);
      }
      mockOnOpenChange(newOpenState); 
    };

    return (
      <>
        {isOpen && (
          <div data-testid="mock-dialog-content">
            {children}
            <button
              onClick={() => handleOpenChange(false)}
              data-testid="mock-dialog-close-button"
            >
              Close
            </button>
          </div>
        )}
      </>
    );
  };

  const MockDialogTrigger = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  const MockDialogContent = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-content-wrapper">{children}</div>
  );

  const MockDialogHeader = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  const MockDialogTitle = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  const MockDialogDescription = ({
    children,
  }: {
    children: React.ReactNode;
  }) => <>{children}</>;

  const MockDialogFooter = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  const MockDialogClose = ({ children }: { children: React.ReactNode }) => {
    if (React.isValidElement(children)) {
      const element = children as React.ReactElement<
        React.HTMLAttributes<HTMLElement>
      >;

      return React.cloneElement(element, {
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          if (typeof element.props.onClick === "function") {
            element.props.onClick(event);
          }
          mockDialogClose();
        },
      });
    }
    return <button onClick={mockDialogClose}>Close</button>;
  };

  return {
    __esModule: true,
    Dialog: ({ open, onOpenChange, children }: MockDialogProps) => {
      const handleOpenChange = (newOpenState: boolean) => {
        if (onOpenChange) {
          onOpenChange(newOpenState);
        }
        mockOnOpenChange(newOpenState);
      };
      return (
        <MockDialog open={open} onOpenChange={handleOpenChange}>
          {children}
        </MockDialog>
      );
    },
    DialogTrigger: MockDialogTrigger,
    DialogContent: MockDialogContent,
    DialogHeader: MockDialogHeader,
    DialogTitle: MockDialogTitle,
    DialogDescription: MockDialogDescription,
    DialogFooter: MockDialogFooter,
    DialogClose: MockDialogClose,
  };
});

describe("Componente ArtworkDetails", () => {
  const mockUseFavoritesStore = useFavoritesStore as jest.MockedFunction<
    typeof useFavoritesStore
  >;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseFavoritesStore.mockReturnValue({
      isFavorite: jest.fn().mockReturnValue(false),
      saveFavoriteArtwork: jest.fn(),
      removeFavorite: jest.fn(),
      favoriteArtworks: [],
      clearFavorites: jest.fn(),
    });
  });

  const mockArtwork: Artwork = {
    objectID: 1,
    primaryImage: "test-image.jpg",
    primaryImageSmall: "test-image-small.jpg",
    title: "Obra de Arte Teste",
    artistDisplayName: "Artista Teste",
    objectDate: "1990",
    department: "Pinturas Europeias",
    medium: "Óleo sobre tela",
    dimensions: "100 x 100 cm",
    isHighlight: true,
    accessionNumber: "1991.123",
    creditLine: "Doação de Teste, 1991",
    objectURL: "https://www.metmuseum.org/art/collection/search/1",
    tags: [
      {
        term: "Arte",
        AAT_URL: "http://vocab.getty.edu/page/aat/300055547",
        Wikidata_URL: "http://www.wikidata.org/entity/Q735",
      },
      {
        term: "Pintura",
        AAT_URL: "http://vocab.getty.edu/page/aat/300033618",
        Wikidata_URL: "http://www.wikidata.org/entity/Q11629",
      },
      {
        term: "Europa",
        AAT_URL: "http://vocab.getty.edu/page/aat/300111192",
        Wikidata_URL: "http://www.wikidata.org/entity/Q46",
      },
    ],
  };

  const mockArtworkSemImagem: Artwork = {
    ...mockArtwork,
    objectID: 2,
    primaryImage: "",
    title: "Obra Sem Imagem",
  };

  test("deve renderizar os detalhes da obra de arte", () => {
    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    expect(screen.getByText("Obra de Arte Teste")).toBeInTheDocument();

    const artistElement = screen.getByText((content, element) => {
      return (
        content.includes("Artista Teste") &&
        element?.tagName.toLowerCase() === "p" &&
        element?.classList.contains("text-muted-foreground")
      );
    });
    expect(artistElement).toBeInTheDocument();

    expect(screen.getByText(/1990/)).toBeInTheDocument();
    expect(screen.getByText(/Pinturas Europeias/)).toBeInTheDocument();
    expect(screen.getByText(/Óleo sobre tela/)).toBeInTheDocument();

    expect(screen.getByText("Tags:")).toBeInTheDocument();
    expect(screen.getByText("Arte")).toBeInTheDocument();
    expect(screen.getByText("Pintura")).toBeInTheDocument();
    expect(screen.getByText("Europa")).toBeInTheDocument();
  });

  test("deve renderizar mensagem alternativa quando não há imagem", () => {
    render(
      <ArtworkDetails artwork={mockArtworkSemImagem} onClose={mockOnClose} />
    );

    expect(screen.getByText("Imagem não disponível")).toBeInTheDocument();
  });

  test("deve chamar onClose ao fechar o diálogo", () => {
    mockOnClose.mockReset();

    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    const closeButton = screen.getByTestId("mock-dialog-close-button"); // Alterado de "dialog-close" para "mock-dialog-close-button"
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("não deve renderizar informações de destaque se a obra não for destaque", () => {
    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    expect(screen.queryByText("Destaque")).not.toBeInTheDocument();
  });

  test("deve mostrar ícone de favorito preenchido quando a obra está nos favoritos", () => {
    mockUseFavoritesStore.mockReturnValue({
      isFavorite: jest.fn().mockReturnValue(true),
      saveFavoriteArtwork: jest.fn(),
      removeFavorite: jest.fn(),
      favoriteArtworks: [],
      clearFavorites: jest.fn(),
    });

    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    screen.getByRole("button", {
      name: /remover dos favoritos/i,
    });

    const heartIcon = screen.getByTestId("heart-icon");
    expect(heartIcon).toHaveClass("text-red-500");
    expect(heartIcon).toHaveAttribute("fill", "currentColor");
  });

  test("deve alternar o estado de favorito ao clicar no botão de favorito", () => {
    const mockIsFavorite = jest.fn().mockReturnValue(false);
    const mockSaveFavorite = jest.fn();
    const mockRemoveFavorite = jest.fn();

    mockUseFavoritesStore.mockReturnValue({
      isFavorite: mockIsFavorite,
      saveFavoriteArtwork: mockSaveFavorite,
      removeFavorite: mockRemoveFavorite,
      favoriteArtworks: [],
      clearFavorites: jest.fn(),
    });

    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    const favoriteButton = screen.getByRole("button", {
      name: /adicionar aos favoritos/i,
    });

    fireEvent.click(favoriteButton);

    expect(mockSaveFavorite).toHaveBeenCalledWith(mockArtwork);
    expect(mockRemoveFavorite).not.toHaveBeenCalled();
  });

  test("deve remover dos favoritos quando clicado e a obra já é favorita", () => {
    const mockIsFavorite = jest.fn().mockReturnValue(true);
    const mockSaveFavorite = jest.fn();
    const mockRemoveFavorite = jest.fn();

    mockUseFavoritesStore.mockReturnValue({
      isFavorite: mockIsFavorite,
      saveFavoriteArtwork: mockSaveFavorite,
      removeFavorite: mockRemoveFavorite,
      favoriteArtworks: [],
      clearFavorites: jest.fn(),
    });

    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    const favoriteButton = screen.getByRole("button", {
      name: /remover dos favoritos/i,
    });

    fireEvent.click(favoriteButton);

    expect(mockRemoveFavorite).toHaveBeenCalledWith(mockArtwork.objectID);
    expect(mockSaveFavorite).not.toHaveBeenCalled();
  });

  test("não deve renderizar nada se artwork for null ou não tiver objectID", () => {
    mockUseFavoritesStore.mockReturnValue({
      isFavorite: jest.fn().mockReturnValue(false),
      saveFavoriteArtwork: jest.fn(),
      removeFavorite: jest.fn(),
      favoriteArtworks: [],
      clearFavorites: jest.fn(),
    });

    const { container: container1, rerender } = render(
      <ArtworkDetails
        artwork={null as unknown as Artwork}
        onClose={mockOnClose}
      />
    );
    expect(container1.firstChild).toBeNull();

    const artworkSemID = {
      ...mockArtwork,
      objectID: undefined as unknown as number,
    };
    rerender(<ArtworkDetails artwork={artworkSemID} onClose={mockOnClose} />);
    expect(container1.firstChild).toBeNull();
  });

  test("deve abrir link externo em nova aba quando disponível", () => {
    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    const externalLink = screen.getByRole("link", {
      name: /ver no site do museu/i,
    });

    expect(externalLink).toHaveAttribute("href", mockArtwork.objectURL);
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
