import { ApiResponseError, ApiSubmissionErrors } from "../error"

export function parseJsonError(json: any){
  if(json.violations){
      return new ApiSubmissionErrors(json)
  }

  if(json.status){
    return new ApiResponseError(json)
  }
  return new Error(json.message)
}
