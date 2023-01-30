export class ApiError extends Error {
  public title?: string
  public status?: number
}
