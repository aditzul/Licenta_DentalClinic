export interface ApiError {
  type: string;
  title: string;
  status: 200 | 204 | 500;
  detail: string;
  traceId: string;
  message?: string;
}
