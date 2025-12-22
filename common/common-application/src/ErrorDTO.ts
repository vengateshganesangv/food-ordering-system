/**
 * Error Data Transfer Object
 * Represents an error response structure for REST APIs
 */
export interface ErrorDTO {
  /**
   * Error code (typically HTTP status text)
   */
  code: string;

  /**
   * Error message describing what went wrong
   */
  message: string;
}

/**
 * Creates an ErrorDTO instance
 * @param code - Error code
 * @param message - Error message
 * @returns ErrorDTO object
 */
export function createErrorDTO(code: string, message: string): ErrorDTO {
  return {
    code,
    message
  };
}
