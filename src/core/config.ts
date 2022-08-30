import { PanteraConfig } from './types'

export const mergeConfig = (
  config1: PanteraConfig,
  config2: PanteraConfig
): PanteraConfig => {

  return {
    ...config1,
    ...config2,
    headers: new Headers({
      ...config1.headers,
      ...config2.headers
    })
  }
}
