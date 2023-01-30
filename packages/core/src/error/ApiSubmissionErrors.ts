import { ApiError } from './ApiError';
import { ApiResponseError } from './ApiResponseError';


export interface ApiViolationsData {
  propertyPath: string
  message: string
}

export interface ApiValidationErrorData {
  'hydra:title': string
  'hydra:description': string
  'violations': ApiViolationsData[]
}

export interface ApiViolationsMap {
  [key: string]: string
}

export class ApiSubmissionErrors extends ApiError {
  violations: ApiViolationsMap

  constructor(json: ApiValidationErrorData){
    super(json['hydra:description'])

    this.title = json['hydra:title']
    this.violations = {}

    json.violations.map(val => {
      this.violations[val.propertyPath] = val.message
    })

  }
}
