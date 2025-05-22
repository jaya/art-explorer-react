import { Artwork } from "@/types/artwork";
import "@testing-library/jest-dom";
import { render} from "@testing-library/react";
import ArtworkCard from "../ArtworkCard";

// Mock para Icon, já que não é relevante para o teste inicial
jest.mock("@/components/ui/icon", () => ({
  __esModule: true,
  default: ({ name, className }: { name: string; className: string }) => (
    <div data-testid={`icon-${name}`} className={className} />
  ),
}));

const mockArtwork: Artwork = {
  objectID: 1,
  primaryImage: "test-image.jpg",
  title: "Test Artwork",
  artistDisplayName: "Test Artist",
  objectDate: "2023",
  department: "Test Department",
  isHighlight: false,
  medium: "Oil on canvas",
  objectURL: "http://example.com/artwork/1",
  primaryImageSmall: "test-image-small.jpg",
  constituents: null,
  accessionNumber: "12345", // Adicionado para conformidade com o tipo
  dimensions: "100x100cm", // Adicionado para conformidade com o tipo
  creditLine: "Gift of Mr. and Mrs. Test", // Adicionado para conformidade com o tipo
  tags: null, // Adicionado para conformidade com o tipo
};

const mockOnViewDetails = jest.fn();
const mockOnToggleFavorite = jest.fn();
const mockOnImageCorrupted = jest.fn();

describe("ArtworkCard", () => {

  it("does not render if artwork has no primaryImage and renderWithoutImage is false", () => {
    const artworkWithoutImage = { ...mockArtwork, primaryImage: "" };
    const { container } = render(
      <ArtworkCard
        artwork={artworkWithoutImage}
        onViewDetails={mockOnViewDetails}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onImageCorrupted={mockOnImageCorrupted}
        // renderWithoutImage é false por padrão
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
