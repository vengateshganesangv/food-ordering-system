import { DomainException } from '@food-ordering/common-domain';
import { ErrorResponse } from './ErrorResponse';

export class GlobalExceptionHandler {
  static handleException(error: Error): { status: number; body: ErrorResponse } {
    if (error instanceof DomainException) {
      return {
        status: 400,
        body: ErrorResponse.of('DOMAIN_ERROR', error.message),
      };
    }

    return {
      status: 500,
      body: ErrorResponse.of('INTERNAL_SERVER_ERROR', 'An unexpected error occurred'),
    };
  }
}
