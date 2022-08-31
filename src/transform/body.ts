import { PanteraConfig } from '../types'

export const transformBody = (config: PanteraConfig): any => {
  const contentType = config.headers && config.headers['Content-Type']

  if((contentType === 'application/json') && config.body && (typeof config.body === 'object'))
    return JSON.stringify(config.body)

  return config.body
}
