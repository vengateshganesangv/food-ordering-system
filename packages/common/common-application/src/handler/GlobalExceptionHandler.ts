import { ErrorDTO } from './ErrorDTO';
import { DomainException } from '@food-ordering-system/common-domain';
import { ValidationError } from 'class-validator';

export class GlobalExceptionHandler {
  handleException(error: Error): ErrorDTO {
    console.error(error.message, error);
    return ErrorDTO.builder()
      .code('INTERNAL_SERVER_ERROR')
      .message('Unexpected error!')
      .build();
  }

  handleDomainException(error: DomainException): ErrorDTO {
    console.error(error.message, error);
    return ErrorDTO.builder()
      .code('BAD_REQUEST')
      .message(error.message)
      .build();
  }

  handleValidationException(errors: ValidationError[]): ErrorDTO {
    const violations = this.extractViolationsFromErrors(errors);
    console.error(violations);
    return ErrorDTO.builder()
      .code('BAD_REQUEST')
      .message(violations)
      .build();
  }

  private extractViolationsFromErrors(errors: ValidationError[]): string {
    return errors
      .map((error) => Object.values(error.constraints || {}).join(', '))
      .filter((msg) => msg.length > 0)
      .join('--');
  }
}
