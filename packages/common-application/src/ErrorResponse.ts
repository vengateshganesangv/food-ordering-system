export class ErrorResponse {
  constructor(
    public readonly code: string,
    public readonly message: string,
  ) {}

  static of(code: string, message: string): ErrorResponse {
    return new ErrorResponse(code, message);
  }
}
