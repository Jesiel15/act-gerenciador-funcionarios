export interface ResponseModel<T> {
  error?: unknown;
  message: string;
  response: T;
}