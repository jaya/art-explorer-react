import ArtworkCard from "@/components/ArtworkCard";
import ArtworkDetails from "@/components/ArtworkDetails";
import DepartmentFilter from "@/components/DepartmentFilter";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Icon from "@/components/ui/icon";
import Loading from "@/components/ui/loading";
import { useInfiniteArtworks } from "@/services/api";
import { useFavoritesStore } from "@/stores/favoritesStore";
import type { Artwork } from "@/types/artwork";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 15; // Itens por página para a paginação no cliente
const MAX_INITIAL_FETCH_ATTEMPTS = 3; // Máximo de tentativas para a carga inicial automática

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("painting");
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [displayedItemsCount, setDisplayedItemsCount] =
    useState(ITEMS_PER_PAGE);
  const [initialFetchAttempts, setInitialFetchAttempts] = useState(0);
  const [corruptedImageIds, setCorruptedImageIds] = useState<Set<number>>(
    new Set()
  );

  // Zustand store para gerenciar favoritos
  const { removeFavorite, isFavorite, saveFavoriteArtwork } =
    useFavoritesStore();

  // React Query para busca de obras com paginação infinita
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteArtworks(searchTerm, selectedDepartment);

  // Extrai todos os artworks de todas as páginas carregadas pela API
  const allArtworksFromApi = data?.pages.flatMap((page) => page.artworks) || [];

  // Filtra para obter apenas obras válidas
  const allValidArtworksFromApi = allArtworksFromApi
    .filter((artwork) => artwork.primaryImage) // Primeiro, filtra as que têm imagem principal
    .filter((artwork) => {
      // Se o searchTerm for específico (não "painting" e não vazio), aplica filtro rigoroso
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      if (normalizedSearchTerm && normalizedSearchTerm !== "painting") {
        const searchableFields = [
          artwork.title,
          artwork.artistDisplayName,
          artwork.department,
          artwork.medium,
          artwork.objectDate, // Corrigido
        ];
        return searchableFields.some(
          (field) => field && field.toLowerCase().includes(normalizedSearchTerm)
        );
      }
      // Se for "painting" ou busca vazia, não aplica filtro adicional de texto aqui (API já fez o trabalho)
      return true;
    })
    .filter((artwork) => !corruptedImageIds.has(artwork.objectID)); // Por fim, filtra as corrompidas

  // Seleciona a fatia de obras válidas a serem renderizadas com base na contagem atual
  const artworksToRender = allValidArtworksFromApi.slice(
    0,
    displayedItemsCount
  );

  const isLoading = isPending; // Usado para o indicador de carregamento inicial

  // Efeito para resetar a contagem de itens exibidos, tentativas de busca inicial e IDs corrompidos ao mudar busca/filtro
  useEffect(() => {
    setDisplayedItemsCount(ITEMS_PER_PAGE);
    setInitialFetchAttempts(0); // Resetar tentativas
    setCorruptedImageIds(new Set()); // Resetar IDs de imagens corrompidas
  }, [searchTerm, selectedDepartment]);

  // useEffect para garantir que a carga inicial tente buscar ITEMS_PER_PAGE
  useEffect(() => {
    if (
      isPending ||
      isFetchingNextPage ||
      !data?.pages || // Garante que data e data.pages existam
      allValidArtworksFromApi.length >= ITEMS_PER_PAGE ||
      !hasNextPage ||
      initialFetchAttempts >= MAX_INITIAL_FETCH_ATTEMPTS
    ) {
      // Se já temos itens suficientes, não há mais páginas, ou atingimos o limite de tentativas, paramos.
      // Ou se a query inicial ainda está pendente ou já buscando a próxima página.
      return;
    }

    console.log(
      `[InitialLoad] Tentativa ${
        initialFetchAttempts + 1
      }/${MAX_INITIAL_FETCH_ATTEMPTS}. Itens válidos: ${
        allValidArtworksFromApi.length
      }. Buscando mais para atingir ${ITEMS_PER_PAGE}...`
    );
    setInitialFetchAttempts((prev) => prev + 1);
    fetchNextPage();
  }, [
    data, // Reage a novos dados carregados
    hasNextPage,
    isPending,
    isFetchingNextPage,
    initialFetchAttempts,
    fetchNextPage,
    allValidArtworksFromApi.length, // Adicionado para reavaliar quando o número de itens válidos muda
  ]);

  const handleImageCorrupted = (artworkId: number) => {
    setCorruptedImageIds((prevIds) => new Set(prevIds).add(artworkId));
  };

  // Debounce para a busca
  useEffect(() => {
    const handler = setTimeout(() => {
      // Define searchTerm com o valor do input atual (trim para remover espaços)
      // ou volta para "painting" se o input estiver vazio.
      setSearchTerm(currentSearchInput.trim() || "painting");
    }, 700); // 700ms de delay para o debounce

    // Limpa o timeout se o componente for desmontado ou se currentSearchInput mudar antes do timeout completar
    return () => {
      clearTimeout(handler);
    };
  }, [currentSearchInput]); // A dependência é apenas currentSearchInput

  const handleSearch = (query: string) => {
    setCurrentSearchInput(query); // Atualiza o input em tempo real
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseDetails = () => {
    setSelectedArtwork(null);
  };

  const toggleFavorite = (artwork: Artwork) => {
    if (isFavorite(artwork.objectID)) {
      removeFavorite(artwork.objectID);
    } else {
      saveFavoriteArtwork(artwork);
    }
  };

  const handleLoadMore = async () => {
    const newCount = displayedItemsCount + ITEMS_PER_PAGE;
    setDisplayedItemsCount(newCount);

    // Se o novo número de itens a exibir excede o que temos de válidos localmente,
    // e há mais páginas na API, e não estamos já buscando, então busque mais.
    if (
      newCount > allValidArtworksFromApi.length &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  // Determina se o botão "Carregar mais" deve ser exibido
  const showLoadMoreButton =
    !isLoading && // Não na carga inicial absoluta da query
    !isFetchingNextPage && // Não enquanto já estiver buscando a próxima página da API
    (displayedItemsCount < allValidArtworksFromApi.length || hasNextPage); // Condição principal: ou há mais itens locais para mostrar, ou há mais páginas na API

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <main className="container mx-auto px-4 py-8">
        {/* <h2 className="text-2xl font-bold mb-6 text-foreground">
          {searchTerm
            ? `Resultados para "${searchTerm}"`
            : "Descubra Obras de Arte"}
        </h2> */}

        {/* Filtro de departamentos */}
        <DepartmentFilter
          selectedDepartment={selectedDepartment}
          onSelectDepartment={setSelectedDepartment}
        />

        {/* Indicador de carregamento animado principal (só se estiver carregando e não houver nada para mostrar ainda) */}
        {isLoading && artworksToRender.length === 0 && (
          <Loading
            icon="palette"
            text="Carregando obras..."
            size="lg"
            className="py-20"
          />
        )}

        {/* Mensagem para quando não há resultados e não há mais páginas para buscar */}
        {!isLoading &&
          !isFetchingNextPage &&
          artworksToRender.length === 0 &&
          !hasNextPage && (
            <EmptyState
              icon="imageOff"
              title={`Nenhuma obra encontrada para "${searchTerm}".`}
              description="Tente uma nova busca com outros termos."
            />
          )}

        {/* Grid de cards de obras de arte (só renderiza se houver obras) */}
        {artworksToRender.length > 0 && (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              {artworksToRender.map((artwork) => (
                <ArtworkCard
                  key={artwork.objectID}
                  artwork={artwork}
                  onViewDetails={handleArtworkClick}
                  isFavorite={isFavorite(artwork.objectID)}
                  onToggleFavorite={() => toggleFavorite(artwork)}
                  onImageCorrupted={handleImageCorrupted} // Passar a nova prop
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Botão "Carregar mais" */}
        {showLoadMoreButton && (
          <div className="mt-8 text-center">
            <Button onClick={handleLoadMore} className="px-6 py-2 gap-2">
              <span>Carregar mais obras</span>
              <Icon name="arrowDown" className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Indicador de carregamento para "Carregar mais" (quando buscando da API) */}
        {isFetchingNextPage && (
          <Loading text="Carregando mais obras..." className="mt-8" />
        )}
      </main>

      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <Icon name="palette" className="h-5 w-5 text-primary" />
            <span className="font-semibold">Art Explorer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} - Visualize obras de arte do
            Metropolitan Museum
          </p>
        </div>
      </footer>

      {/* Modal de detalhes da obra */}
      {selectedArtwork && (
        <ArtworkDetails
          artwork={selectedArtwork}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default HomePage;
