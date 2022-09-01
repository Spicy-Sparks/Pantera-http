import { PanteraConfig } from '../types'

export const transformHeaders = (config: PanteraConfig): Headers | undefined => {
  if(!config.headers)
    return

  let headers = new Headers()

  for(var key in config.headers) {
    const value = config.headers[key]
    if(typeof value === 'undefined' || value === null)
      continue
    headers.append(key, value.toString())
  }

  return headers
}
