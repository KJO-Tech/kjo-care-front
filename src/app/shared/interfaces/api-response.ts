export interface ApiResponse<T> {
  statusCode: string;
  message: string;
  result: T;
  success: boolean;
}
