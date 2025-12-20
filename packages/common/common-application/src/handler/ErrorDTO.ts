export class ErrorDTO {
  readonly code: string;
  readonly message: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }

  static builder() {
    return new ErrorDTOBuilder();
  }
}

class ErrorDTOBuilder {
  private _code: string = '';
  private _message: string = '';

  code(code: string): ErrorDTOBuilder {
    this._code = code;
    return this;
  }

  message(message: string): ErrorDTOBuilder {
    this._message = message;
    return this;
  }

  build(): ErrorDTO {
    return new ErrorDTO(this._code, this._message);
  }
}
