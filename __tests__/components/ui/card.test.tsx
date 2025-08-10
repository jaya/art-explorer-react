import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

describe("Card Components", () => {
  describe("Card", () => {
    it("renders with default props", () => {
      render(<Card>Card content</Card>);

      const card = screen.getByText("Card content");
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("data-slot", "card");
      expect(card).toHaveClass(
        "bg-card",
        "text-card-foreground",
        "rounded-xl",
        "border",
      );
    });

    it("applies custom className", () => {
      render(<Card className="custom-card">Card content</Card>);

      const card = screen.getByText("Card content");
      expect(card).toHaveClass("custom-card");
    });

    it("forwards all props to div element", () => {
      render(
        <Card data-testid="card" role="region">
          Card content
        </Card>,
      );

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("role", "region");
    });

    it("handles empty content", () => {
      render(<Card data-testid="empty-card" />);

      const card = screen.getByTestId("empty-card");
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("data-slot", "card");
    });
  });

  describe("CardHeader", () => {
    it("renders with default props", () => {
      render(<CardHeader>Header content</CardHeader>);

      const header = screen.getByText("Header content");
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute("data-slot", "card-header");
      expect(header).toHaveClass(
        "@container/card-header",
        "grid",
        "auto-rows-min",
      );
    });

    it("applies custom className", () => {
      render(<CardHeader className="custom-header">Header content</CardHeader>);

      const header = screen.getByText("Header content");
      expect(header).toHaveClass("custom-header");
    });

    it("works with CardTitle and CardAction together", () => {
      render(
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardAction>Action</CardAction>
        </CardHeader>,
      );

      const header = screen.getByText("Title").parentElement;
      expect(header).toHaveAttribute("data-slot", "card-header");
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });
  });

  describe("CardTitle", () => {
    it("renders with default props", () => {
      render(<CardTitle>Card Title</CardTitle>);

      const title = screen.getByText("Card Title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute("data-slot", "card-title");
      expect(title).toHaveClass("leading-none", "font-semibold");
    });

    it("applies custom className", () => {
      render(<CardTitle className="custom-title">Card Title</CardTitle>);

      const title = screen.getByText("Card Title");
      expect(title).toHaveClass("custom-title");
    });

    it("handles long text", () => {
      const longTitle =
        "This is a very long title that might wrap to multiple lines and should be handled gracefully";
      render(<CardTitle>{longTitle}</CardTitle>);

      const title = screen.getByText(longTitle);
      expect(title).toBeInTheDocument();
    });

    it("handles empty title", () => {
      render(<CardTitle data-testid="empty-title" />);

      const title = screen.getByTestId("empty-title");
      expect(title).toHaveAttribute("data-slot", "card-title");
    });
  });

  describe("CardDescription", () => {
    it("renders with default props", () => {
      render(<CardDescription>Card description</CardDescription>);

      const description = screen.getByText("Card description");
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute("data-slot", "card-description");
      expect(description).toHaveClass("text-muted-foreground", "text-sm");
    });

    it("applies custom className", () => {
      render(
        <CardDescription className="custom-description">
          Description
        </CardDescription>,
      );

      const description = screen.getByText("Description");
      expect(description).toHaveClass("custom-description");
    });

    it("handles long description text", () => {
      const longDescription =
        "This is a very long description that provides detailed information about the card content and might span multiple lines";
      render(<CardDescription>{longDescription}</CardDescription>);

      const description = screen.getByText(longDescription);
      expect(description).toBeInTheDocument();
    });
  });

  describe("CardAction", () => {
    it("renders with default props", () => {
      render(<CardAction>Action button</CardAction>);

      const action = screen.getByText("Action button");
      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute("data-slot", "card-action");
      expect(action).toHaveClass("col-start-2", "row-span-2", "row-start-1");
    });

    it("applies custom className", () => {
      render(<CardAction className="custom-action">Action</CardAction>);

      const action = screen.getByText("Action");
      expect(action).toHaveClass("custom-action");
    });

    it("positions correctly in grid layout", () => {
      render(<CardAction>Action</CardAction>);

      const action = screen.getByText("Action");
      expect(action).toHaveClass("self-start", "justify-self-end");
    });
  });

  describe("CardContent", () => {
    it("renders with default props", () => {
      render(<CardContent>Card content</CardContent>);

      const content = screen.getByText("Card content");
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-slot", "card-content");
      expect(content).toHaveClass("px-6");
    });

    it("applies custom className", () => {
      render(<CardContent className="custom-content">Content</CardContent>);

      const content = screen.getByText("Content");
      expect(content).toHaveClass("custom-content");
    });

    it("handles complex content", () => {
      render(
        <CardContent>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <div>Nested div</div>
        </CardContent>,
      );

      expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
      expect(screen.getByText("Nested div")).toBeInTheDocument();
    });
  });

  describe("CardFooter", () => {
    it("renders with default props", () => {
      render(<CardFooter>Footer content</CardFooter>);

      const footer = screen.getByText("Footer content");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute("data-slot", "card-footer");
      expect(footer).toHaveClass("flex", "items-center", "px-6");
    });

    it("applies custom className", () => {
      render(<CardFooter className="custom-footer">Footer</CardFooter>);

      const footer = screen.getByText("Footer");
      expect(footer).toHaveClass("custom-footer");
    });

    it("handles multiple footer items", () => {
      render(
        <CardFooter>
          <button>Cancel</button>
          <button>Save</button>
        </CardFooter>,
      );

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });

  describe("Complete Card Structure", () => {
    it("renders full card with all components", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description</CardDescription>
            <CardAction>
              <button>Action</button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>Main content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Footer Button</button>
          </CardFooter>
        </Card>,
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card description")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("Main content goes here")).toBeInTheDocument();
      expect(screen.getByText("Footer Button")).toBeInTheDocument();
    });

    it("maintains proper accessibility structure", () => {
      render(
        <Card role="article" aria-labelledby="card-title">
          <CardHeader>
            <CardTitle id="card-title">Accessible Card</CardTitle>
            <CardDescription>This card is properly labeled</CardDescription>
          </CardHeader>
          <CardContent>Content here</CardContent>
        </Card>,
      );

      const card = screen.getByRole("article");
      expect(card).toHaveAttribute("aria-labelledby", "card-title");
      expect(screen.getByText("Accessible Card")).toHaveAttribute(
        "id",
        "card-title",
      );
    });
  });
});
