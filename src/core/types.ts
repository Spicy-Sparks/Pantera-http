export type PantersResponse<T> = Response & {
  data: T
}

export type PanteraConfig = RequestInit & {
  baseUrl?: string,
  url?: string
}

export type PanteraRequestInterceptors = {
  onBeforeSend: (config: PanteraConfig) => Promise<PanteraConfig> | PanteraConfig
}

export type PanteraResponseInterceptors = {
  onSuccess: <T>(response: PantersResponse<T>) => PantersResponse<T> | Promise<PantersResponse<T>>
  onError: <T>(error: Response | Error) => PantersResponse<T> | Promise<PantersResponse<T>>
}
