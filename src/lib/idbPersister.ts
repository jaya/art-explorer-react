import { Persister } from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";

/**
 * Cria um persister para o IndexedDB usando idb-keyval.
 * @param idbKey A chave a ser usada no IndexedDB para armazenar o cache.
 * @returns Um objeto Persister.
 */
export function createIDBPersister(idbKey: IDBValidKey = "reactQuery") {
  return {
    persistClient: async (client) => {
      await set(idbKey, client);
    },
    restoreClient: async () => {
      return await get(idbKey);
    },
    removeClient: async () => {
      await del(idbKey);
    },
  } as Persister;
}
