export type PanteraResponse<T> = Response & {
  config: PanteraConfig,
  data: T
}

export type PanteraError = (Error | Response) & {
  config: PanteraConfig,
}

export type ResponseType = 'json' | 'text'

export type PanteraConfig = RequestInit & {
  baseUrl?: string,
  url?: string,
  responseType?: ResponseType
}

export type PanteraRequestInterceptors = {
  onBeforeSend: (config: PanteraConfig) => Promise<PanteraConfig> | PanteraConfig
}

export type PanteraResponseInterceptors = {
  onSuccess: <T = any>(response: PanteraResponse<T>) => PanteraResponse<T> | Promise<PanteraResponse<T>>
  onError: <T = any>(error: PanteraError) => PanteraResponse<T> | Promise<PanteraResponse<T>>
}
