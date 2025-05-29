// src/components/__tests__/Footer.test.tsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Footer } from "../Footer";

describe("Componente Footer", () => {
  test("deve renderizar o texto de copyright com o ano atual", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText((content) =>
      content.includes(`© ${currentYear}`)
    );
    expect(copyrightText).toBeInTheDocument();
    expect(copyrightText).toHaveTextContent(
      `© ${currentYear} Art Explorer. Todos os direitos reservados.`
    );
  });

  test("deve renderizar a mensagem de desenvolvido por com emoji", () => {
    render(<Footer />);

    const paragraphWithEmoji = screen.getByText(
      (content) =>
        content.includes("Desenvolvido com") &&
        content.includes("por Christian Martins.")
    );
    expect(paragraphWithEmoji).toBeInTheDocument();

    const heartEmoji = screen.getByRole("img", { name: "coração" });
    expect(heartEmoji).toBeInTheDocument();
    expect(heartEmoji.textContent).toBe("❤️");
  });
});
