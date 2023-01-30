import { ApiClientFetchData } from "../../src/composables"
import { parseJsonError } from "../../src/utils/helpers"

export async function doFetch({
  path,
  baseURL,
  options
}: ApiClientFetchData)
{
  const response = await global.fetch(new URL(path, baseURL), options)
  let data = null
  let error = null
  if(options?.onResponse){
    options.onResponse(response)
  }
  if(response.ok){
    data = await response.json()
      .then(json => {return json})
      .catch(e => {
        error = e
      })
  }else{
    error = await response.json()
      .then(json => {
        throw parseJsonError(json)
      })
      .catch(e => {
        return e
      })
  }

  if(error){
    if(options?.onError){
      options.onError(response, error)
    }
  }

  return { data, error}
}
