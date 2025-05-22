import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createIDBPersister } from "./idbPersister.ts";

// Cria uma instância do cliente do React Query com configurações padrão
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // dados considerados "frescos" por 5 minutos
      gcTime: 1000 * 60 * 30, // cache mantido por 30 minutos
      refetchOnWindowFocus: false, // não refetch quando a janela ganhar foco
      retry: 1, // tenta uma vez em caso de erro
    },
  },
});

// Cria o persister para IndexedDB
const persister = createIDBPersister("artExplorerCache");

// Configura a persistência do cliente
persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // Persistir por 7 dias
  // buster: 'v1', // Opcional: string para invalidar o cache se a estrutura de dados mudar
});
