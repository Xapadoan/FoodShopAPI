export interface HTTPError {
  error: string;
}

export interface Pagination<T> {
  page: number;
  length: number;
  results: T[];
}
