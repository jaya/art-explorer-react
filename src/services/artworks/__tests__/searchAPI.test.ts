import axios from "axios";
import * as searchAPI from "../searchAPI";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("searchAPI", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("deve buscar artworks por termo", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { objectIDs: [1, 2, 3], total: 3 },
    });

    const result = await searchAPI.searchArtworks("monet");
    expect(mockedAxios.get).toHaveBeenCalled();
    expect(result.objectIDs).toEqual([1, 2, 3]);
    expect(result.total).toBe(3);
  });

  it("deve retornar vazio se query for vazia", async () => {
    const result = await searchAPI.searchArtworks("");
    expect(result).toEqual({ total: 0, objectIDs: [] });
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("deve lançar erro se axios lançar erro", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Erro de rede"));
    await expect(searchAPI.searchArtworks("falha")).rejects.toThrow();
  });
});
