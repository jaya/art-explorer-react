import { Artwork } from "@/types/artwork";
import "@testing-library/jest-dom";
import { render} from "@testing-library/react";
import ArtworkCard from "../ArtworkCard";

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
  accessionNumber: "12345", 
  dimensions: "100x100cm",
  creditLine: "Gift of Mr. and Mrs. Test",
  tags: null,
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
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
