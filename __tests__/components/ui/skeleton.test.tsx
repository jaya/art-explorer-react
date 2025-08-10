import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton Component", () => {
  it("renders with default props", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("data-slot", "skeleton");
  });

  it("applies default styling classes", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveClass("bg-accent", "animate-pulse", "rounded-md");
  });

  it("applies custom className", () => {
    render(<Skeleton className="custom-skeleton" data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveClass("custom-skeleton");
    expect(skeleton).toHaveClass("bg-accent", "animate-pulse", "rounded-md");
  });

  it("forwards all props to div element", () => {
    render(
      <Skeleton
        id="test-skeleton"
        data-testid="skeleton"
        aria-label="Loading content"
        title="Loading..."
        role="status"
      />,
    );

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveAttribute("id", "test-skeleton");
    expect(skeleton).toHaveAttribute("aria-label", "Loading content");
    expect(skeleton).toHaveAttribute("title", "Loading...");
    expect(skeleton).toHaveAttribute("role", "status");
  });

  it("handles different size variations with custom classes", () => {
    render(
      <div>
        <Skeleton className="h-4 w-full" data-testid="text-line" />
        <Skeleton className="h-12 w-12 rounded-full" data-testid="avatar" />
        <Skeleton className="h-64 w-full rounded-lg" data-testid="image" />
        <Skeleton className="h-8 w-24" data-testid="button" />
      </div>,
    );

    const textLine = screen.getByTestId("text-line");
    const avatar = screen.getByTestId("avatar");
    const image = screen.getByTestId("image");
    const button = screen.getByTestId("button");

    expect(textLine).toHaveClass("h-4", "w-full");
    expect(avatar).toHaveClass("h-12", "w-12", "rounded-full");
    expect(image).toHaveClass("h-64", "w-full", "rounded-lg");
    expect(button).toHaveClass("h-8", "w-24");
  });

  it("can be used to create text skeleton patterns", () => {
    render(
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" data-testid="skeleton-1" />
        <Skeleton className="h-4 w-4/5" data-testid="skeleton-2" />
        <Skeleton className="h-4 w-3/4" data-testid="skeleton-3" />
        <Skeleton className="h-4 w-1/2" data-testid="skeleton-4" />
      </div>,
    );

    const skeleton1 = screen.getByTestId("skeleton-1");
    const skeleton2 = screen.getByTestId("skeleton-2");
    const skeleton3 = screen.getByTestId("skeleton-3");
    const skeleton4 = screen.getByTestId("skeleton-4");

    const allSkeletons = [skeleton1, skeleton2, skeleton3, skeleton4];
    allSkeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass("animate-pulse");
      expect(skeleton).toHaveAttribute("data-slot", "skeleton");
    });
  });

  it("can be used to create card skeleton layouts", () => {
    render(
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" data-testid="avatar" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" data-testid="title" />
          <Skeleton className="h-4 w-[200px]" data-testid="description" />
        </div>
      </div>,
    );

    const avatar = screen.getByTestId("avatar");
    const title = screen.getByTestId("title");
    const description = screen.getByTestId("description");

    expect(avatar).toHaveClass("h-12", "w-12", "rounded-full");
    expect(title).toHaveClass("h-4", "w-[250px]");
    expect(description).toHaveClass("h-4", "w-[200px]");
  });

  it("supports accessibility features for loading states", () => {
    render(
      <div>
        <Skeleton
          className="h-8 w-48"
          aria-label="Loading article title"
          role="status"
        />
        <Skeleton
          className="h-4 w-full mt-2"
          aria-label="Loading article content"
          role="status"
        />
      </div>,
    );

    const titleSkeleton = screen.getByLabelText("Loading article title");
    const contentSkeleton = screen.getByLabelText("Loading article content");

    expect(titleSkeleton).toHaveAttribute("role", "status");
    expect(contentSkeleton).toHaveAttribute("role", "status");
  });

  it("can contain child content when needed", () => {
    render(
      <Skeleton
        className="h-20 w-20 flex items-center justify-center"
        data-testid="skeleton-with-content"
      >
        <span className="text-xs">Loading</span>
      </Skeleton>,
    );

    const skeleton = screen.getByTestId("skeleton-with-content");
    expect(skeleton).toContainHTML('<span class="text-xs">Loading</span>');
  });

  it("handles empty content gracefully", () => {
    render(<Skeleton data-testid="empty-skeleton" />);

    const skeleton = screen.getByTestId("empty-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.textContent).toBe("");
  });

  it("works with responsive classes", () => {
    render(
      <Skeleton
        className="h-4 w-full sm:h-6 md:h-8 lg:w-1/2"
        data-testid="responsive-skeleton"
      />,
    );

    const skeleton = screen.getByTestId("responsive-skeleton");
    expect(skeleton).toHaveClass(
      "h-4",
      "w-full",
      "sm:h-6",
      "md:h-8",
      "lg:w-1/2",
    );
  });

  it("can be composed into complex loading layouts", () => {
    render(
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" data-testid="avatar" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" data-testid="name" />
            <Skeleton className="h-4 w-[150px]" data-testid="email" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" data-testid="line1" />
          <Skeleton className="h-4 w-full" data-testid="line2" />
          <Skeleton className="h-4 w-3/4" data-testid="line3" />
        </div>

        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" data-testid="button1" />
          <Skeleton className="h-10 w-20" data-testid="button2" />
        </div>
      </div>,
    );

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
    expect(screen.getByTestId("name")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("line1")).toBeInTheDocument();
    expect(screen.getByTestId("line2")).toBeInTheDocument();
    expect(screen.getByTestId("line3")).toBeInTheDocument();
    expect(screen.getByTestId("button1")).toBeInTheDocument();
    expect(screen.getByTestId("button2")).toBeInTheDocument();
  });

  it("maintains consistent animation across multiple skeletons", () => {
    render(
      <div>
        <Skeleton className="h-4 w-full mb-2" data-testid="skeleton-a" />
        <Skeleton className="h-4 w-4/5 mb-2" data-testid="skeleton-b" />
        <Skeleton className="h-4 w-3/4" data-testid="skeleton-c" />
      </div>,
    );

    const skeletonA = screen.getByTestId("skeleton-a");
    const skeletonB = screen.getByTestId("skeleton-b");
    const skeletonC = screen.getByTestId("skeleton-c");

    const allSkeletons = [skeletonA, skeletonB, skeletonC];
    allSkeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass("animate-pulse");
      expect(skeleton).toHaveClass("bg-accent");
    });
  });

  it("can be styled with different background variants", () => {
    render(
      <div>
        <Skeleton className="bg-gray-200" data-testid="gray" />
        <Skeleton className="bg-slate-200" data-testid="slate" />
        <Skeleton className="bg-muted" data-testid="muted" />
      </div>,
    );

    const graySkeleton = screen.getByTestId("gray");
    const slateSkeleton = screen.getByTestId("slate");
    const mutedSkeleton = screen.getByTestId("muted");

    expect(graySkeleton).toHaveClass("bg-gray-200");
    expect(slateSkeleton).toHaveClass("bg-slate-200");
    expect(mutedSkeleton).toHaveClass("bg-muted");
  });

  it("supports different border radius variations", () => {
    render(
      <div>
        <Skeleton className="rounded-none" data-testid="none" />
        <Skeleton className="rounded-sm" data-testid="sm" />
        <Skeleton className="rounded-lg" data-testid="lg" />
        <Skeleton className="rounded-full" data-testid="full" />
      </div>,
    );

    const noneRadius = screen.getByTestId("none");
    const smRadius = screen.getByTestId("sm");
    const lgRadius = screen.getByTestId("lg");
    const fullRadius = screen.getByTestId("full");

    expect(noneRadius).toHaveClass("rounded-none");
    expect(smRadius).toHaveClass("rounded-sm");
    expect(lgRadius).toHaveClass("rounded-lg");
    expect(fullRadius).toHaveClass("rounded-full");
  });

  it("can override default animation", () => {
    render(<Skeleton className="animate-bounce" data-testid="bounce" />);

    const skeleton = screen.getByTestId("bounce");
    expect(skeleton).toHaveClass("animate-bounce");
    expect(skeleton).toHaveClass("bg-accent");
  });

  it("works with grid layouts for skeleton cards", () => {
    render(
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton
              className="h-48 w-full rounded-lg"
              data-testid={`card-${i}-image`}
            />
            <div className="space-y-2">
              <Skeleton
                className="h-4 w-full"
                data-testid={`card-${i}-title`}
              />
              <Skeleton className="h-4 w-4/5" data-testid={`card-${i}-desc`} />
            </div>
          </div>
        ))}
      </div>,
    );

    expect(screen.getByTestId("card-0-image")).toBeInTheDocument();
    expect(screen.getByTestId("card-0-title")).toBeInTheDocument();
    expect(screen.getByTestId("card-0-desc")).toBeInTheDocument();
  });
});
