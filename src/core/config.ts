import { PanteraConfig, PanteraHeaders } from './types'

export const mergeConfig = (
  config1: PanteraConfig,
  config2: PanteraConfig
): PanteraConfig => {

  return {
    ...config1,
    ...config2,
    headers: {
      ...config1.headers,
      ...config2.headers
    }
  }
}

export const mergeUrl = (
  url: string,
  baseUrl?: string
): string => {

  if(!baseUrl)
    return url

  if(baseUrl.endsWith('/'))
    baseUrl = baseUrl.slice(0, -1)

  if(!url.startsWith('/'))
    url = '/' + url

  return baseUrl + url
}

export const parseHeaders = (
  headers: HeadersInit
): PanteraHeaders => {
  
  const entries = headers.entries
  if(typeof entries === 'string')
    return {}

  return Object.fromEntries(entries())
}
