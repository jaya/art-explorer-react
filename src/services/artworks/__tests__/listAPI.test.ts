import * as detailsAPI from "../detailsAPI";
import * as listAPI from "../listAPI";

jest.mock("../detailsAPI");

const mockGetArtworkDetails = detailsAPI.getArtworkDetails as jest.Mock;

describe("listAPI", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("deve buscar uma lista de artworks por IDs", async () => {
    const mockArtworks = [
      { objectID: 1, title: "Obra 1" },
      { objectID: 2, title: "Obra 2" },
    ];
    mockGetArtworkDetails
      .mockResolvedValueOnce(mockArtworks[0])
      .mockResolvedValueOnce(mockArtworks[1]);

    const result = await listAPI.getMultipleArtworkDetails([1, 2]);
    expect(mockGetArtworkDetails).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockArtworks);
  });

  it("deve retornar array vazio se nenhum ID for passado", async () => {
    const result = await listAPI.getMultipleArtworkDetails([]);
    expect(result).toEqual([]);
    expect(mockGetArtworkDetails).not.toHaveBeenCalled();
  });
});
