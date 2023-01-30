import { useApiEntrypoint } from "../composables"
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


export const extractHubURL = (response: Response): null | URL => {
  const linkHeader = response.headers.get("Link");
  if (!linkHeader) return null;

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/
  );

  return matches && matches[1] ? new URL(matches[1], useApiEntrypoint()) : null;
};
