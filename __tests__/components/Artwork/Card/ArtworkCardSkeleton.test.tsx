import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ArtworkCardSkeleton } from "@/components/Artwork/Card/ArtworkCardSkeleton";

describe("ArtworkCardSkeleton", () => {
  it("renders card container", () => {
    render(<ArtworkCardSkeleton />);

    const card = document.querySelector(".overflow-hidden.h-full");
    expect(card).toBeInTheDocument();
  });

  it("renders image skeleton with correct aspect ratio", () => {
    render(<ArtworkCardSkeleton />);

    const imageSkeleton = document.querySelector(".aspect-square.w-full");
    expect(imageSkeleton).toBeInTheDocument();
  });

  it("renders title skeleton elements", () => {
    render(<ArtworkCardSkeleton />);

    const titleContainer = document.querySelector(".h-\\[2\\.5rem\\]");
    expect(titleContainer).toBeInTheDocument();

    const skeletonLines = document.querySelectorAll(".h-4");
    expect(skeletonLines.length).toBeGreaterThanOrEqual(2);
  });

  it("renders artist skeleton element", () => {
    render(<ArtworkCardSkeleton />);

    const artistSkeleton = document.querySelector(".h-3.w-2\\/3");
    expect(artistSkeleton).toBeInTheDocument();
  });

  it("maintains proper height structure", () => {
    render(<ArtworkCardSkeleton />);

    const contentContainer = document.querySelector(".h-\\[100px\\]");
    expect(contentContainer).toBeInTheDocument();
  });

  it("has correct flex layout", () => {
    render(<ArtworkCardSkeleton />);

    const flexContainer = document.querySelector(
      ".flex.flex-col.justify-between",
    );
    expect(flexContainer).toBeInTheDocument();
  });

  it("renders all skeleton elements with proper spacing", () => {
    render(<ArtworkCardSkeleton />);

    const spacingContainer = document.querySelector(".space-y-2");
    expect(spacingContainer).toBeInTheDocument();

    const paddingContainer = document.querySelector(".p-4");
    expect(paddingContainer).toBeInTheDocument();
  });

  it("renders skeleton with animation classes", () => {
    render(<ArtworkCardSkeleton />);

    const skeletonElements = document.querySelectorAll(
      '[class*="animate-pulse"], [class*="skeleton"]',
    );
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it("maintains card content structure", () => {
    render(<ArtworkCardSkeleton />);

    const cardContent = document.querySelector(".p-0.h-full.flex.flex-col");
    expect(cardContent).toBeInTheDocument();
  });

  it("renders with overflow hidden", () => {
    render(<ArtworkCardSkeleton />);

    const card = document.querySelector(".overflow-hidden");
    expect(card).toBeInTheDocument();
  });

  it("has proper width constraints for skeleton elements", () => {
    render(<ArtworkCardSkeleton />);

    const fullWidthSkeleton = document.querySelector(".w-full");
    expect(fullWidthSkeleton).toBeInTheDocument();

    const partialWidthSkeleton = document.querySelector(".w-4\\/5, .w-2\\/3");
    expect(partialWidthSkeleton).toBeInTheDocument();
  });

  it("uses consistent height classes", () => {
    render(<ArtworkCardSkeleton />);

    const heightClasses = [
      ".h-4",
      ".h-3",
      ".h-\\[2\\.5rem\\]",
      ".h-\\[100px\\]",
    ];

    heightClasses.forEach((heightClass) => {
      const element = document.querySelector(heightClass);
      expect(element).toBeInTheDocument();
    });
  });

  it("renders multiple instances independently", () => {
    render(
      <div>
        <ArtworkCardSkeleton />
        <ArtworkCardSkeleton />
        <ArtworkCardSkeleton />
      </div>,
    );

    const cards = document.querySelectorAll(".overflow-hidden.h-full");
    expect(cards).toHaveLength(3);
  });

  it("has proper semantic structure", () => {
    render(<ArtworkCardSkeleton />);

    const links = screen.queryAllByRole("link");
    const buttons = screen.queryAllByRole("button");

    expect(links).toHaveLength(0);
    expect(buttons).toHaveLength(0);
  });

  it("maintains visual consistency with actual card", () => {
    const { container } = render(<ArtworkCardSkeleton />);

    expect(container.querySelector(".aspect-square")).toBeInTheDocument();
    expect(container.querySelector(".p-4")).toBeInTheDocument();
    expect(container.querySelector(".flex-col")).toBeInTheDocument();
  });
});
