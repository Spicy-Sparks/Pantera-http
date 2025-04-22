import { PanteraConfig } from '../types'
import { mergeUrl } from '../utils/config'

export const transformUrl = (
  config: PanteraConfig
): string => {
  const finalUrl = mergeUrl(config.url || '', config.baseUrl)

  if(config.params && (Object.keys(config.params).length > 0) && config.method?.toLocaleLowerCase()?.match(/get|head/)) {
    // @ts-ignore
    const urlSearchParams = new URLSearchParams(config.params).toString()
    return `${finalUrl}?${urlSearchParams}`
  }

  return finalUrl
}
