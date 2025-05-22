import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Artwork, SearchResponse } from "../types/artwork";

const API_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

// Funções base da API
export const searchArtworks = async (
  query: string
): Promise<SearchResponse> => {
  try {
    const response = await axios.get<SearchResponse>(
      `${API_BASE_URL}/search?q=${query}&hasImages=true`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching artworks:", error);
    // Retornar uma estrutura válida em caso de erro para evitar quebras
    return { total: 0, objectIDs: [] };
  }
};

export const getArtworkDetails = async (
  objectID: number
): Promise<Artwork | null> => {
  try {
    const response = await axios.get<Artwork>(
      `${API_BASE_URL}/objects/${objectID}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // É comum que alguns IDs de uma busca em massa não sejam encontrados ou sejam inválidos.
      // Não tratar como um erro crítico que impede o resto.
      // console.warn(`Artwork ${objectID} not found (404).`);
      return null;
    }
    console.error(`Error fetching details for artwork ${objectID}:`, error);
    return null;
  }
};

// Função para buscar vários detalhes de obras de arte em paralelo
export const getMultipleArtworkDetails = async (
  objectIDs: number[]
): Promise<Artwork[]> => {
  if (!objectIDs || objectIDs.length === 0) {
    return [];
  }
  // Usar Promise.allSettled para garantir que todas as promessas sejam resolvidas,
  // mesmo que algumas falhem. Isso evita que uma única falha derrube toda a busca.
  const artworkPromises = objectIDs.map((id) => getArtworkDetails(id));
  const results = await Promise.allSettled(artworkPromises);

  const artworks: Artwork[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      artworks.push(result.value);
    } else if (result.status === "rejected") {
      // O erro já é logado em getArtworkDetails (exceto 404s que retornam null)
      // ou poderia ser logado aqui se necessário: console.error("Failed to fetch one artwork:", result.reason);
    }
  });
  return artworks;
};

// Hooks do React Query para busca de obras

// Hook para buscar obras por termo de pesquisa (retorna apenas IDs)
export const useSearchArtworks = (query: string, enabled = true) => {
  return useQuery({
    queryKey: ["artworks", "search", query],
    queryFn: () => searchArtworks(query),
    enabled: !!query && enabled, // Só executa se houver uma query e estiver habilitado
    select: (data) => data.objectIDs || [], // Seleciona apenas os objectIDs do resultado
  });
};

// Hook para buscar detalhes de uma obra pelo ID
export const useArtworkDetails = (objectID: number | null, enabled = true) => {
  return useQuery({
    queryKey: ["artwork", objectID],
    queryFn: async () => {
      // Adiciona verificação para garantir que objectID não seja nulo quando a queryFn é chamada.
      // Embora 'enabled' deva prevenir isso, é uma camada extra de segurança.
      if (objectID === null) {
        // Pode retornar null ou lançar um erro, dependendo da lógica desejada.
        // Retornar null é consistente com o tipo de retorno de getArtworkDetails.
        return null;
      }
      return getArtworkDetails(objectID);
    },
    enabled: !!objectID && enabled, // Só executa se houver um ID e estiver habilitado
  });
};

// Hook para buscar múltiplas obras com paginação infinita
export const useInfiniteArtworks = (
  query: string,
  departmentId?: string | null,
  pageSize = 15
) => {
  return useInfiniteQuery({
    queryKey: ["artworks", "infinite", query, departmentId],
    queryFn: async ({ pageParam }) => {
      // pageParam é o cursor da página (índice inicial)
      const currentStartIndex = pageParam;

      // Constrói o termo de busca com o departamento, se fornecido
      let searchQuery = query || "painting"; // 'painting' como fallback
      if (departmentId) {
        searchQuery = `${searchQuery} departmentId:${departmentId}`;
      }

      // INEFICIENTE: searchArtworks é chamado em cada página.
      // A API do MET não pagina a busca de IDs, então todos os IDs são buscados aqui.
      // Para uma API real com paginação de IDs, pageParam seria usado na chamada da API.
      const searchResult = await searchArtworks(searchQuery);
      const allObjectIDs = searchResult.objectIDs || [];

      // Pega os IDs para a página atual baseada no currentStartIndex
      const pageIds = allObjectIDs.slice(
        currentStartIndex,
        currentStartIndex + pageSize
      );
      const artworks = await getMultipleArtworkDetails(pageIds); // Busca detalhes para os IDs da página

      // Calcula o cursor para a próxima página
      const hasMore = currentStartIndex + pageSize < allObjectIDs.length;
      const nextPageCursor = hasMore ? currentStartIndex + pageSize : undefined;

      return {
        artworks, // Os dados da página atual
        nextPageCursor, // O cursor para a próxima página (ou undefined se for a última)
      };
    },
    initialPageParam: 0, // Define o pageParam inicial para a primeira chamada de queryFn
    getNextPageParam: (lastPage) => {
      // lastPage é o objeto retornado por queryFn na chamada anterior
      // Retorna o cursor para a próxima página, ou undefined se não houver mais páginas
      return lastPage.nextPageCursor;
    },
    enabled: !!query, // Só executa se houver uma query
  });
};
