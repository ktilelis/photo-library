import { HttpErrorResponse } from '@angular/common/http';
import { PhotoGalleryError } from '@core/model';
import { Observable, throwError } from 'rxjs';

export function mapError(error: Error): Observable<never> {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return throwError(
        () =>
          ({
            type: 'network',
            message: error.message,
            statusCode: error.status,
            originalError: error
          }) satisfies PhotoGalleryError
      );
    }

    if (error.status >= 400 && error.status < 500) {
      return throwError(
        () =>
          ({
            type: 'client',
            message: 'The client made an erroneous request.',
            statusCode: error.status,
            originalError: error
          }) satisfies PhotoGalleryError
      );
    }

    if (error.status >= 500) {
      return throwError(
        () =>
          ({
            type: 'server',
            message: 'Server error occurred.',
            statusCode: error.status,
            originalError: error
          }) satisfies PhotoGalleryError
      );
    }
  }

  return throwError(
    () =>
      ({
        type: 'unknown',
        message: 'Unexpected error occurred.',
        statusCode: -1,
        originalError: error
      }) satisfies PhotoGalleryError
  );
}
