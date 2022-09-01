import { PanteraConfig } from '../types'

export const transformBody = (config: PanteraConfig): any => {
  if(!config.body)
    return config.body

  const contentType = config.headers && config.headers['Content-Type']

  if((typeof config.body === 'object') && (typeof contentType === 'string')) {

    if(contentType.startsWith('application/json'))
      return JSON.stringify(config.body)

    if(contentType.startsWith('application/x-www-form-urlencoded')) {
      let urlSearchParams = (config.body.constructor === URLSearchParams)
        ? config.body
        : new URLSearchParams(config.body)
      return '&' +urlSearchParams.toString()
    }
  }

  return config.body
}
