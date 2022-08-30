export type PantersResponse<T> = Response & {
  data: T
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
  onSuccess: <T>(response: PantersResponse<T>) => PantersResponse<T> | Promise<PantersResponse<T>>
  onError: <T>(error: Response | Error) => PantersResponse<T> | Promise<PantersResponse<T>>
}
