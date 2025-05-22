// src/components/__tests__/ArtworkCard.test.tsx
import type { Artwork } from "@/types/artwork";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import ArtworkCard from "../ArtworkCard";

// Mock simples para framer-motion
type MotionProps = Record<string, unknown>;

jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: { children: React.ReactNode } & MotionProps) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
    img: ({ ...props }: MotionProps) => (
      <img data-testid="motion-img" {...props} />
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock para artwork
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
};

// Mock para artwork sem título
const mockArtworkSemTitulo: Artwork = {
  ...mockArtwork,
  objectID: 2,
  title: "",
};

// Funções de mock
const mockOnViewDetails = jest.fn();
const mockOnToggleFavorite = jest.fn();
const mockOnImageCorrupted = jest.fn();

describe("Componente ArtworkCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve chamar onImageCorrupted quando a imagem falha ao carregar", () => {
    const { container } = render(
      <ArtworkCard
        artwork={mockArtwork}
        onViewDetails={mockOnViewDetails}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onImageCorrupted={mockOnImageCorrupted}
      />
    );

    // Localiza a imagem
    const image = screen.getByAltText("Obra de Arte Teste");

    // Simula o erro na imagem
    fireEvent.error(image);

    // Verifica se onImageCorrupted foi chamado corretamente
    expect(mockOnImageCorrupted).toHaveBeenCalledTimes(1);
    expect(mockOnImageCorrupted).toHaveBeenCalledWith(mockArtwork.objectID);

    // Após o erro de imagem, o componente deveria retornar null
    // Re-renderiza para capturar as mudanças de estado
    // O container deve estar vazio porque o componente retorna null
    expect(container.firstChild).toBeNull();
  });

  test("deve renderizar 'Título Desconhecido' se title estiver vazio", () => {
    render(
      <ArtworkCard
        artwork={mockArtworkSemTitulo}
        onViewDetails={mockOnViewDetails}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onImageCorrupted={mockOnImageCorrupted}
      />
    );

    // Verifica se "Título Desconhecido" é renderizado
    expect(screen.getByText("Título Desconhecido")).toBeInTheDocument();
  });
});
