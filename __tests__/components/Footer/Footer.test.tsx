import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/Footer/Footer";

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("Footer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders footer element", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("displays current year in copyright text", () => {
    render(<Footer />);

    expect(screen.getByText(/©\d{4} Art Explorer/)).toBeInTheDocument();
  });

  it("includes author name and link", () => {
    render(<Footer />);

    expect(screen.getByText("Jonathas Germano")).toBeInTheDocument();

    const authorLink = screen.getByRole("link");
    expect(authorLink).toHaveAttribute(
      "href",
      "https://www.github.com/jonathas3c",
    );
  });

  it("has correct styling classes", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "p-1",
      "bg-primary",
    );
  });

  it("has correct text styling", () => {
    render(<Footer />);

    const text = document.querySelector("p");
    expect(text).toHaveClass("text-sm");
  });

  it("renders complete copyright text", () => {
    render(<Footer />);

    const copyrightText = screen.getByText((content, element) => {
      return (
        /©\d{4} Art Explorer, by/.test(content) && element?.tagName === "P"
      );
    });

    expect(copyrightText).toBeInTheDocument();
  });

  it("link opens to correct GitHub profile", () => {
    render(<Footer />);

    const link = screen.getByRole("link", { name: "Jonathas Germano" });
    expect(link).toHaveAttribute("href", "https://www.github.com/jonathas3c");
  });

  it("handles different years correctly", () => {
    jest.setSystemTime(new Date("2025-06-15"));

    render(<Footer />);

    expect(screen.getByText(/©2025 Art Explorer/)).toBeInTheDocument();
  });

  it("is accessible", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAccessibleName("Jonathas Germano");
  });

  it("has semantic HTML structure", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();

    const paragraph = footer?.querySelector("p");
    expect(paragraph).toBeInTheDocument();

    const link = paragraph?.querySelector("a");
    expect(link).toBeInTheDocument();
  });
});
