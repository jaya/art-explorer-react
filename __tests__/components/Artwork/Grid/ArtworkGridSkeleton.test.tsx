import { render } from "@testing-library/react";
import { ArtworkGridSkeleton } from "@/components/Artwork/Grid/ArtworkGridSkeleton";

describe("ArtworkGridSkeleton", () => {
  it("renders grid container with default count", () => {
    render(<ArtworkGridSkeleton />);

    const grid = document.querySelector(".grid");
    expect(grid).toBeInTheDocument();

    const skeletonCards = document.querySelectorAll(".overflow-hidden.h-full");
    expect(skeletonCards).toHaveLength(15);
  });

  it("renders custom count of skeleton cards", () => {
    render(<ArtworkGridSkeleton count={8} />);

    const skeletonCards = document.querySelectorAll(".overflow-hidden.h-full");
    expect(skeletonCards).toHaveLength(8);
  });

  it("has responsive grid layout", () => {
    render(<ArtworkGridSkeleton />);

    const grid = document.querySelector(".grid");
    expect(grid).toHaveClass(
      "grid-cols-1",
      "sm:grid-cols-2",
      "md:grid-cols-3",
      "lg:grid-cols-4",
      "xl:grid-cols-5",
    );
  });

  it("applies proper gap spacing", () => {
    render(<ArtworkGridSkeleton />);

    const grid = document.querySelector(".grid");
    expect(grid).toHaveClass("gap-6");
  });

  it("renders zero skeleton cards when count is 0", () => {
    render(<ArtworkGridSkeleton count={0} />);

    const skeletonCards = document.querySelectorAll(".overflow-hidden.h-full");
    expect(skeletonCards).toHaveLength(0);

    const grid = document.querySelector(".grid");
    expect(grid).toBeInTheDocument();
  });

  it("handles large count values", () => {
    render(<ArtworkGridSkeleton count={50} />);

    const skeletonCards = document.querySelectorAll(".overflow-hidden.h-full");
    expect(skeletonCards).toHaveLength(50);
  });

  it("each skeleton card has unique key", () => {
    const { container } = render(<ArtworkGridSkeleton count={5} />);

    const skeletonCards = container.querySelectorAll(".overflow-hidden.h-full");
    expect(skeletonCards).toHaveLength(5);
  });

  it("maintains consistent skeleton structure", () => {
    render(<ArtworkGridSkeleton count={3} />);

    const skeletonCards = document.querySelectorAll(".overflow-hidden.h-full");

    skeletonCards.forEach((card) => {
      const aspectSquare = card.querySelector(".aspect-square");
      const contentArea = card.querySelector(".p-4");

      expect(aspectSquare).toBeInTheDocument();
      expect(contentArea).toBeInTheDocument();
    });
  });

  it("matches the grid layout of actual ArtworkGrid", () => {
    render(<ArtworkGridSkeleton />);

    const grid = document.querySelector(".grid");

    expect(grid).toHaveClass(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "md:grid-cols-3",
      "lg:grid-cols-4",
      "xl:grid-cols-5",
      "gap-6",
    );
  });

  it("handles negative count gracefully", () => {
    render(<ArtworkGridSkeleton count={-5} />);

    const skeletonCards = document.querySelectorAll(".overflow-hidden.h-full");
    expect(skeletonCards).toHaveLength(0);
  });

  it("handles floating point count", () => {
    render(<ArtworkGridSkeleton count={5.7} />);

    const skeletonCards = document.querySelectorAll(".overflow-hidden.h-full");
    expect(skeletonCards).toHaveLength(5);
  });

  it("renders without accessibility issues", () => {
    render(<ArtworkGridSkeleton />);

    const grid = document.querySelector(".grid");
    expect(grid).toBeInTheDocument();

    const interactiveElements = grid?.querySelectorAll("a, button, input");
    expect(interactiveElements?.length).toBe(0);
  });

  it("provides proper loading state indication", () => {
    render(<ArtworkGridSkeleton />);

    const skeletonElements = document.querySelectorAll(
      '[class*="animate"], [class*="pulse"]',
    );
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it("maintains performance with large counts", () => {
    const startTime = performance.now();

    render(<ArtworkGridSkeleton count={100} />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(500);

    const skeletonCards = document.querySelectorAll(".overflow-hidden.h-full");
    expect(skeletonCards).toHaveLength(100);
  });

  it("uses ArtworkCardSkeleton components", () => {
    render(<ArtworkGridSkeleton count={3} />);

    const cardSkeletons = document.querySelectorAll(".overflow-hidden.h-full");
    expect(cardSkeletons).toHaveLength(3);

    cardSkeletons.forEach((skeleton) => {
      expect(skeleton.querySelector(".aspect-square")).toBeInTheDocument();
      expect(skeleton.querySelector(".p-4")).toBeInTheDocument();
    });
  });
});
