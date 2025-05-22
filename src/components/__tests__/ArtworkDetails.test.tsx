// src/components/__tests__/ArtworkDetails.test.tsx
import { useFavoritesStore } from "@/stores/favoritesStore";
import type { Artwork } from "@/types/artwork";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import ArtworkDetails from "../ArtworkDetails";

// Mock do Framer Motion para evitar problemas com animações
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: { children: React.ReactNode } & Record<string, unknown>) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
    span: ({
      children,
      ...props
    }: { children?: React.ReactNode } & Record<string, unknown>) => (
      <span data-testid="motion-span" {...props}>
        {children}
      </span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock do radix dialog para evitar avisos de acessibilidade
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    ...props
  }: { children: React.ReactNode } & Record<string, unknown>) => (
    <div data-testid="dialog" {...props}>
      {children}
    </div>
  ),
  DialogClose: ({
    children,
    ...props
  }: { children: React.ReactNode } & Record<string, unknown>) => (
    <div data-testid="dialog-close" {...props}>
      {children}
    </div>
  ),
  DialogContent: ({
    children,
    ...props
  }: { children: React.ReactNode } & Record<string, unknown>) => (
    <div data-testid="dialog-content" {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({
    children,
    ...props
  }: { children: React.ReactNode } & Record<string, unknown>) => (
    <div data-testid="dialog-header" {...props}>
      {children}
    </div>
  ),
  DialogTitle: ({
    children,
    ...props
  }: { children: React.ReactNode } & Record<string, unknown>) => (
    <div data-testid="dialog-title" {...props}>
      {children}
    </div>
  ),
}));

// Mock do useFavoritesStore
jest.mock("@/stores/favoritesStore", () => ({
  useFavoritesStore: jest.fn(),
}));

// Mock da obra de arte completa para testes
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

// Mock da obra sem imagem
const mockArtworkSemImagem: Artwork = {
  ...mockArtwork,
  objectID: 2,
  primaryImage: "",
  title: "Obra Sem Imagem",
};

// Mock de funções
const mockOnClose = jest.fn();

describe("Componente ArtworkDetails", () => {
  // Configuração padrão do mock do useFavoritesStore
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock padrão para useFavoritesStore com conversão de tipo explícita
    (useFavoritesStore as unknown as jest.Mock).mockReturnValue({
      isFavorite: jest.fn().mockReturnValue(false),
      saveFavoriteArtwork: jest.fn(),
      removeFavorite: jest.fn(),
    });
  });

  test("deve renderizar os detalhes da obra de arte", () => {
    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    // Verifica o título da obra
    expect(screen.getByText("Obra de Arte Teste")).toBeInTheDocument();

    // Verifica o nome do artista - usando query seletivo para evitar ambiguidade
    const artistElement = screen.getByText((content, element) => {
      // Verifica se é um parágrafo com classe text-muted-foreground
      return (
        content.includes("Artista Teste") &&
        element?.tagName.toLowerCase() === "p" &&
        element?.classList.contains("text-muted-foreground")
      );
    });
    expect(artistElement).toBeInTheDocument();

    // Verifica outros detalhes importantes
    expect(screen.getByText(/1990/)).toBeInTheDocument();
    expect(screen.getByText(/Pinturas Europeias/)).toBeInTheDocument();
    expect(screen.getByText(/Óleo sobre tela/)).toBeInTheDocument();

    // Verifica as tags
    expect(screen.getByText("Tags:")).toBeInTheDocument();
    expect(screen.getByText("Arte")).toBeInTheDocument();
    expect(screen.getByText("Pintura")).toBeInTheDocument();
    expect(screen.getByText("Europa")).toBeInTheDocument();
  });

  test("deve renderizar mensagem alternativa quando não há imagem", () => {
    render(
      <ArtworkDetails artwork={mockArtworkSemImagem} onClose={mockOnClose} />
    );

    // Verifica se a mensagem de imagem não disponível é exibida
    expect(screen.getByText("Imagem não disponível")).toBeInTheDocument();
  });

  test("deve chamar onClose ao fechar o diálogo", () => {
    // Resetar mockOnClose antes do teste
    mockOnClose.mockReset();

    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    // Localiza o botão fechar
    const closeButton = screen.getByRole("button", { name: /fechar/i });

    // Simula a mudança de estado do diálogo através do onClick
    fireEvent.click(closeButton);

    // Verifica se onClose foi chamado
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("deve mostrar ícone de favorito preenchido quando a obra está nos favoritos", () => {
    // Configura o mock para uma obra favorita
    (useFavoritesStore as unknown as jest.Mock).mockReturnValue({
      isFavorite: jest.fn().mockReturnValue(true),
      saveFavoriteArtwork: jest.fn(),
      removeFavorite: jest.fn(),
    });

    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    // Localiza o botão de favorito
    screen.getByRole("button", {
      name: /remover dos favoritos/i,
    });

    // Verifica se o ícone de coração está preenchido usando data-testid
    const heartIcon = screen.getByTestId("heart-icon");
    expect(heartIcon).toHaveClass("text-red-500");
    expect(heartIcon).toHaveAttribute("fill", "currentColor");
  });

  test("deve alternar o estado de favorito ao clicar no botão de favorito", () => {
    const mockIsFavorite = jest.fn().mockReturnValue(false);
    const mockSaveFavorite = jest.fn();
    const mockRemoveFavorite = jest.fn();

    // Configura o mock para testar a ação de favoritar
    (useFavoritesStore as unknown as jest.Mock).mockReturnValue({
      isFavorite: mockIsFavorite,
      saveFavoriteArtwork: mockSaveFavorite,
      removeFavorite: mockRemoveFavorite,
    });

    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    // Localiza o botão de favorito
    const favoriteButton = screen.getByRole("button", {
      name: /adicionar aos favoritos/i,
    });

    // Clica no botão
    fireEvent.click(favoriteButton);

    // Verifica se saveFavoriteArtwork foi chamado com a obra
    expect(mockSaveFavorite).toHaveBeenCalledWith(mockArtwork);
    expect(mockRemoveFavorite).not.toHaveBeenCalled();
  });

  test("deve remover dos favoritos quando clicado e a obra já é favorita", () => {
    const mockIsFavorite = jest.fn().mockReturnValue(true);
    const mockSaveFavorite = jest.fn();
    const mockRemoveFavorite = jest.fn();

    // Configura o mock para testar a ação de remover favorito
    (useFavoritesStore as unknown as jest.Mock).mockReturnValue({
      isFavorite: mockIsFavorite,
      saveFavoriteArtwork: mockSaveFavorite,
      removeFavorite: mockRemoveFavorite,
    });

    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    // Localiza o botão de favorito
    const favoriteButton = screen.getByRole("button", {
      name: /remover dos favoritos/i,
    });

    // Clica no botão
    fireEvent.click(favoriteButton);

    // Verifica se removeFavorite foi chamado com o ID da obra
    expect(mockRemoveFavorite).toHaveBeenCalledWith(mockArtwork.objectID);
    expect(mockSaveFavorite).not.toHaveBeenCalled();
  });

  test("não deve renderizar nada se artwork for null ou não tiver objectID", () => {
    // Mockando o store para evitar erros
    (useFavoritesStore as unknown as jest.Mock).mockReturnValue({
      isFavorite: jest.fn().mockReturnValue(false),
      saveFavoriteArtwork: jest.fn(),
      removeFavorite: jest.fn(),
    });

    // Caso 1: artwork é null
    const { container: container1, rerender } = render(
      <ArtworkDetails
        artwork={null as unknown as Artwork}
        onClose={mockOnClose}
      />
    );
    expect(container1.firstChild).toBeNull();

    // Caso 2: artwork sem objectID
    const artworkSemID = {
      ...mockArtwork,
      objectID: undefined as unknown as number,
    };
    rerender(<ArtworkDetails artwork={artworkSemID} onClose={mockOnClose} />);
    expect(container1.firstChild).toBeNull();
  });

  test("deve abrir link externo em nova aba quando disponível", () => {
    render(<ArtworkDetails artwork={mockArtwork} onClose={mockOnClose} />);

    // Localiza o link externo
    const externalLink = screen.getByRole("link", {
      name: /ver no site do museu/i,
    });

    // Verifica os atributos do link
    expect(externalLink).toHaveAttribute("href", mockArtwork.objectURL);
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
