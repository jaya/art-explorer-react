import { Footer } from "@/components/Footer"; // Importa o Footer
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import FavoritesPage from "@/pages/FavoritesPage/FavoritesPage";
import HomePage from "@/pages/HomePage/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        {" "}
        {/* Wrapper Flex */}
        <BrowserRouter>
          <main className="flex-grow">
            {" "}
            {/* Conteúdo principal cresce para preencher o espaço */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/favoritos" element={<FavoritesPage />} />
            </Routes>
          </main>
          <Toaster />
          <Footer /> {/* Adiciona o Footer aqui */}
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
