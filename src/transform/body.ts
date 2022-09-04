import { PanteraConfig } from '../types'

export const transformBody = (
  config: PanteraConfig
): any => {
  if(!config.body)
    return config.body

  const contentType = config.headers && config.headers['Content-Type']

  if((typeof config.body === 'object') && (typeof contentType === 'string')) {

    if(contentType.startsWith('application/json'))
      return generateApplicationJson(config.body)

    if(contentType.startsWith('application/x-www-form-urlencoded'))
      return generateUrlSearchParams(config.body)

    if(contentType.startsWith('multipart/form-data'))
      return generateFormData(config.body)
  }

  return config.body
}

export const generateApplicationJson = (body: any): string => {
  if(typeof body !== 'object')
    return body

  return JSON.stringify(body)
}

export const generateUrlSearchParams = (params: any): string => {
  if((typeof params !== 'object') || (params.constructor === URLSearchParams))
    return params

  return `&${new URLSearchParams(params).toString()}`
}

export const generateFormData = (body: any): FormData => {
  if((typeof body !== 'object') || (body.constructor === FormData))
    return body

  let formData = new FormData()
  for(var key in body)
    formData.append(key, body[key])

  return formData
}
