export class ApiResponse<T = any> {
  constructor(
    public success: boolean,
    public message: string,
    public data: T | null = null,
  ) {}

  static success<T>(message: string, data?: T) {
    return new ApiResponse(true, message, data || null);
  }

  static error<T>(message: string, data?: T) {
    return new ApiResponse(false, message, data || null);
  }
}
