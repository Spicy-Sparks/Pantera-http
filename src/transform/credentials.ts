import { PanteraConfig } from '../types'

export const transformCredentials = (
  config: PanteraConfig
): RequestCredentials | undefined => {
  
  if(config.credentials === true)
    return 'include'

  if(config.credentials === false)
    return 'omit'

  return config.credentials
}
