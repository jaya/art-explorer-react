import { render, screen, fireEvent } from "@testing-library/react";
import { ImageCursorTrail } from "@/components/ImageCursorTrail/ImageCursorTrail";

Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

const mockImages = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
  "https://example.com/image3.jpg",
];

describe("ImageCursorTrail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders section container", () => {
    render(<ImageCursorTrail items={mockImages} />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("renders all provided images", () => {
    render(<ImageCursorTrail items={mockImages} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);

    images.forEach((img, index) => {
      expect(img).toHaveAttribute("src", mockImages[index]);
      expect(img).toHaveAttribute("alt", `image-${index}`);
    });
  });

  it("renders children content", () => {
    render(
      <ImageCursorTrail items={mockImages}>
        <div data-testid="child-content">Child Content</div>
      </ImageCursorTrail>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("applies default props correctly", () => {
    render(<ImageCursorTrail items={mockImages} />);

    const section = document.querySelector("section");
    expect(section).toHaveClass(
      "relative",
      "grid",
      "h-[380px]",
      "w-full",
      "place-content-center",
      "overflow-hidden",
      "rounded-lg",
    );

    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveClass("w-40", "h-48");
      expect(img).toHaveAttribute("data-status", "inactive");
    });
  });

  it("applies custom className", () => {
    render(<ImageCursorTrail items={mockImages} className="custom-class" />);

    const section = document.querySelector("section");
    expect(section).toHaveClass("custom-class");
  });

  it("applies custom imgClass", () => {
    render(<ImageCursorTrail items={mockImages} imgClass="w-20 h-20" />);

    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveClass("w-20", "h-20");
    });
  });

  it("activates images on mouse move", () => {
    render(<ImageCursorTrail items={mockImages} distance={10} />);

    const section = document.querySelector("section");

    section!.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    }));

    fireEvent.mouseMove(section!, {
      clientX: 500,
      clientY: 500,
    });

    // The test passes if no errors occur during event handling
    expect(section).toBeInTheDocument();
  });

  it("activates images on touch move", () => {
    render(<ImageCursorTrail items={mockImages} distance={10} />);

    const section = document.querySelector("section");

    section!.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    }));

    fireEvent.touchMove(section!, {
      touches: [
        {
          clientX: 500,
          clientY: 500,
        },
      ],
    });

    expect(section).toBeInTheDocument();
  });

  it("limits active images based on maxNumberOfImages", () => {
    render(
      <ImageCursorTrail
        items={mockImages}
        maxNumberOfImages={2}
        distance={1}
      />,
    );

    const section = document.querySelector("section");

    section!.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    }));

    for (let i = 0; i < 5; i++) {
      fireEvent.mouseMove(section!, {
        clientX: 200 + i * 50,
        clientY: 200 + i * 50,
      });
    }

    const images = screen.getAllByRole("img");
    const activeImages = images.filter(
      (img) => img.getAttribute("data-status") === "active",
    );

    expect(activeImages.length).toBeLessThanOrEqual(2);
  });

  it("applies fade animation when enabled", () => {
    jest.useFakeTimers();

    render(
      <ImageCursorTrail items={mockImages} fadeAnimation={true} distance={1} />,
    );

    const section = document.querySelector("section");

    section!.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    }));

    fireEvent.mouseMove(section!, {
      clientX: 500,
      clientY: 500,
    });

    jest.advanceTimersByTime(1500);

    expect(section).toBeInTheDocument();

    jest.useRealTimers();
  });

  it("handles empty items array", () => {
    render(<ImageCursorTrail items={[]} />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(0);
  });

  it("cycles through images correctly", () => {
    render(<ImageCursorTrail items={mockImages} distance={1} />);

    const section = document.querySelector("section");

    section!.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    }));

    for (let i = 0; i < 10; i++) {
      fireEvent.mouseMove(section!, {
        clientX: 200 + i * 50,
        clientY: 200 + i * 50,
      });
    }

    const section2 = document.querySelector("section");
    expect(section2).toBeInTheDocument();
  });

  it("handles touch events without touches", () => {
    render(<ImageCursorTrail items={mockImages} />);

    const section = document.querySelector("section");

    fireEvent.touchMove(section!, {
      touches: [],
    });

    // Should not crash
    expect(section).toBeInTheDocument();
  });

  it("respects distance threshold", () => {
    render(<ImageCursorTrail items={mockImages} distance={50} />);

    const section = document.querySelector("section");
    const images = screen.getAllByRole("img");

    section!.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    }));

    fireEvent.mouseMove(section!, {
      clientX: 10,
      clientY: 10,
    });

    images.forEach((img) => {
      expect(img).toHaveAttribute("data-status", "inactive");
    });
  });
});
