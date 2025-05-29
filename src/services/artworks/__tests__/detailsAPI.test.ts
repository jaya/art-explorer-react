import axios from "axios";
import * as detailsAPI from "../detailsAPI";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("detailsAPI", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("deve buscar detalhes de uma obra pelo ID", async () => {
    const mockArtwork = {
      objectID: 123,
      title: "Obra Teste",
      primaryImage: "img.jpg",
      artistDisplayName: "Artista",
      department: "Depto",
      medium: "Óleo",
      objectDate: "2024",
      dimensions: "10x10",
      creditLine: "Crédito",
      objectURL: "http://url",
      primaryImageSmall: "img-small.jpg",
      isHighlight: false,
      accessionNumber: "ACC123",
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockArtwork });

    const result = await detailsAPI.getArtworkDetails(123);
    expect(mockedAxios.get).toHaveBeenCalled();
    expect(result).toEqual(mockArtwork);
  });

  it("deve lançar erro se a obra não for encontrada", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: {} });
    await expect(detailsAPI.getArtworkDetails(999)).rejects.toThrow();
  });
});
