import { PanteraConfig } from '../types'

export const mergeConfig = (
  config1: PanteraConfig,
  config2: PanteraConfig
): PanteraConfig => {

  return {
    ...config1,
    ...config2,
    ...((config1.headers || config2.headers) && {
      headers: {
        ...config1.headers,
        ...config2.headers
      }
    }),
    ...((config1.extraConfig || config2.extraConfig) && {
      extraConfig: {
        ...config1.extraConfig,
        ...config2.extraConfig
      }
    }),
    ...((config1.params || config2.params) && {
      params: {
        ...config1.params,
        ...config2.params
      }
    })
  }
}

export const mergeUrl = (
  url: string,
  baseUrl?: string
): string => {

  if(!baseUrl)
    return url

  if(url.startsWith('http'))
    return url

  if(baseUrl.endsWith('/'))
    baseUrl = baseUrl.slice(0, -1)

  if(!url.startsWith('/'))
    url = '/' + url

  return baseUrl + url
}
