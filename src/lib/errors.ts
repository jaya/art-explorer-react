
export interface CustomError extends Error {
  statusCode?: number;
  originalError?: unknown;
}

/**
 * Cria um objeto de erro base para a API.
 *
 * @param name O nome/tipo do erro (ex: "ArtworkNotFoundError").
 * @param message A mensagem de erro.
 * @param statusCode O código de status HTTP, se aplicável.
 * @param originalError O erro original que causou esta exceção, se houver.
 * @returns Um objeto CustomError.
 */
function createError(
  name: string,
  message: string,
  statusCode?: number,
  originalError?: unknown
): CustomError {
  const error = new Error(message) as CustomError;
  error.name = name;
  error.statusCode = statusCode;
  error.originalError = originalError;
  return error;
}


export function createApiError(
  message: string,
  statusCode?: number,
  originalError?: unknown
): CustomError {
  return createError("ApiError", message, statusCode, originalError);
}

export function createArtworkNotFoundError(
  objectId: number | string
): CustomError {
  return createError(
    "ArtworkNotFoundError",
    `Artwork with ID '${objectId}' not found.`,
    404
  );
}

export function createSearchOperationFailedError(
  query: string,
  originalError?: unknown
): CustomError {
  return createError(
    "SearchOperationFailedError",
    `Search operation failed for query: "${query}".`,
    undefined,
    originalError
  );
}

export function createMultipleArtworksFetchError(
  message: string = "Failed to fetch details for one or more artworks.",
  originalError?: unknown
): CustomError {
  return createError(
    "MultipleArtworksFetchError",
    message,
    undefined,
    originalError
  );
}

export function isArtworkNotFoundError(error: unknown): error is CustomError {
  return error instanceof Error && error.name === "ArtworkNotFoundError";
}

export function isSearchOperationFailedError(
  error: unknown
): error is CustomError {
  return error instanceof Error && error.name === "SearchOperationFailedError";
}


export function isMultipleArtworksFetchError(
  error: unknown
): error is CustomError {
  return error instanceof Error && error.name === "MultipleArtworksFetchError";
}

export function isApiError(error: unknown): error is CustomError {
  if (!(error instanceof Error)) {
    return false;
  }
  return (
    error.name === "ApiError" ||
    isArtworkNotFoundError(error) ||
    isSearchOperationFailedError(error) ||
    isMultipleArtworksFetchError(error)
  );
}
