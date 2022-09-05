import { PanteraConfig } from '../types'

export const transformResponse = async <T>(
  config: PanteraConfig,
  response: Response
): Promise<T | undefined> => {
  if(response.bodyUsed)
    return

  switch (config.responseType) {
    case 'json':
      return await response.json() as unknown as T
    case 'blob':
      return await response.blob() as unknown as T
    case 'text':
    default:
      return await response.text() as unknown as T
  }
}
