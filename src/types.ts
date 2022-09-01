export type ResponseType = 'json' | 'text'

export type PanteraHeaders = {
  [key: string]: string | number | boolean | null | undefined
}

export type PanteraConfig = Omit<Omit<RequestInit, "body">, "headers"> & {
  baseUrl?: string,
  url?: string,
  responseType?: ResponseType,
  headers?: PanteraHeaders,
  body?: any,
  params?: {
    [key: string]: string | number | boolean | null | undefined
  },
  extraConfig?: {
    [key: string]: string | number | boolean | null | undefined
  }
}

export type PanteraResponse<T = any> = Omit<Response, "headers"> & {
  config: PanteraConfig,
  data?: T,
  headers?: PanteraHeaders
}

export type PanteraError<T = any> = Partial<Error> & Partial<Omit<Response, "headers">> & {
  config: PanteraConfig,
  data?: T,
  headers?: PanteraHeaders
}

export type PanteraRequestInterceptors = {
  onBeforeSend: (config: PanteraConfig) => Promise<PanteraConfig> | PanteraConfig
}

export type PanteraResponseInterceptors = {
  onSuccess: <T = any>(response: PanteraResponse<T>) => PanteraResponse<T> | Promise<PanteraResponse<T>>
  onError: <T = any>(error: PanteraError<T>) => PanteraResponse<T> | Promise<PanteraResponse<T>>
}
