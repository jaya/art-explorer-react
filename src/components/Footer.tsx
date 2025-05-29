import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted py-6 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>&copy; {currentYear} Art Explorer. Todos os direitos reservados.</p>
        <p className="mt-1">
          Desenvolvido com{" "}
          <span role="img" aria-label="coração">
            ❤️
          </span>{" "}
          por Christian Martins.
        </p>
      </div>
    </footer>
  );
};
