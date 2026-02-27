import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { mapError } from './error-mapper';

describe('mapError', () => {
  const getErrorResponse = (status: number, statusText: string, url = 'https://picsum.photos/v2/list') =>
    new HttpErrorResponse({ status, statusText, url });

  it('maps HttpErrorResponse status 0 to network error', async () => {
    const originalError = getErrorResponse(0, 'Unknown Error');

    await expect(firstValueFrom(mapError(originalError))).rejects.toMatchObject({
      type: 'network',
      message: originalError.message,
      statusCode: 0,
      originalError
    });
  });

  it('maps 4xx HttpErrorResponse to client error', async () => {
    const originalError = getErrorResponse(404, 'Not Found', 'https://picsum.photos/id/404/info');

    await expect(firstValueFrom(mapError(originalError))).rejects.toMatchObject({
      type: 'client',
      message: 'The client made an erroneous request.',
      statusCode: 404,
      originalError
    });
  });

  it('maps 5xx HttpErrorResponse to server error', async () => {
    const originalError = getErrorResponse(500, 'Server Error');

    await expect(firstValueFrom(mapError(originalError))).rejects.toMatchObject({
      type: 'server',
      message: 'Server error occurred.',
      statusCode: 500,
      originalError
    });
  });

  it('maps non-http errors to unknown error', async () => {
    const originalError = new Error('generic error');

    await expect(firstValueFrom(mapError(originalError))).rejects.toMatchObject({
      type: 'unknown',
      message: 'Unexpected error occurred.',
      statusCode: -1,
      originalError
    });
  });
});
