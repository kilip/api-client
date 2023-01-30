import { ApiError } from "./ApiError";

export class ApiResponseError extends ApiError {
  constructor({
    title,
    status,
    detail
  }){
    super(detail)
    this.title = title
    this.status = status
  }
}
