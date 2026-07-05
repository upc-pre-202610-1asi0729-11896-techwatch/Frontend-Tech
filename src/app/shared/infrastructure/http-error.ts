import {HttpErrorResponse} from '@angular/common/http';

/** Error thrown by {@link toFriendlyError}; carries the original HTTP status when known. */
export type ApiError = Error & { status?: number };

/**
 * Backend error body shape (shared/interfaces/rest/resources/ErrorResource on the backend):
 * `{ code, message, details }`.
 */
interface BackendErrorBody {
  code?: string;
  message?: string;
  details?: string;
}

/**
 * Turns an HttpErrorResponse into a user-facing Error, preferring the backend's
 * own message/details (e.g. "Business rule violation: ...: The user's plan
 * allows a maximum of 5 devices") over the generic HTTP status text.
 */
export function toFriendlyError(operation: string, error: HttpErrorResponse): ApiError {
  let message: string;
  const body = error.error as BackendErrorBody | null;

  if (error.status === 404) {
    message = `${operation} : Resource not found`;
  } else if (error.error instanceof ErrorEvent) {
    message = `${operation} : ${error.error.message}`;
  } else if (body?.message) {
    message = body.details ? `${body.message}: ${body.details}` : body.message;
  } else {
    message = `${operation} : ${error.statusText || 'Unexpected error'}`;
  }

  const friendlyError: ApiError = new Error(message);
  friendlyError.status = error.status;
  return friendlyError;
}
