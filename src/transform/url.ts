import { PanteraConfig } from '../types'
import { mergeUrl } from '../utils/config'

export const transformUrl = (
  config: PanteraConfig
): string => {
  let finalUrl = mergeUrl(config.url || '', config.baseUrl)

  if(config.params && (Object.keys(config.params).length > 0)) {
    if (config.params && (Object.keys(config.params).length > 0)) {
      const queryString = Object.entries(config.params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value!.toString())}`)
        .join('&')
      finalUrl = `${finalUrl}?${queryString}`;
    }
  }

  return finalUrl
}
