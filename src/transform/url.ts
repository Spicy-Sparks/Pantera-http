import { PanteraConfig } from '../types'
import { mergeUrl } from '../utils/config'

export const transformUrl = (
  config: PanteraConfig
): string => {
  const finalUrl = mergeUrl(config.url || '', config.baseUrl)

  if(config.params && (Object.keys(config.params).length > 0)) {
    for (const [key, value] of Object.entries(config.params)) {
      if (typeof value === 'string') {
        config.params[key] = encodeURIComponent(value)
      }
    }
    // @ts-ignore
    const urlSearchParams = new URLSearchParams(config.params).toString()
    return `${finalUrl}?${urlSearchParams}`
  }

  return finalUrl
}
