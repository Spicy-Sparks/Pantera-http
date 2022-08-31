import {
  PanteraConfig,
  PanteraResponseInterceptors,
  PanteraRequestInterceptors,
  PanteraResponse,
  PanteraError
} from './types'
import {
  mergeConfig,
  mergeUrl,
  parseHeaders
} from './config'

export class Pantera {

  private baseConfig?: PanteraConfig

  private requestInterceptor?: PanteraRequestInterceptors

  private responseInterceptor?: PanteraResponseInterceptors

  constructor (config?: PanteraConfig) {
    this.baseConfig = config
  }

  public request = async <T = any>(config: PanteraConfig): Promise<PanteraResponse<T>> => {
    let finalConfig = this.baseConfig
      ? mergeConfig(this.baseConfig, config)
      : config

    if(this.requestInterceptor)
      finalConfig = await this.requestInterceptor.onBeforeSend(config)

    const finalUrl = mergeUrl(finalConfig.url || '', finalConfig.baseUrl)

    try {
      const res = await fetch(finalUrl, {
        ...finalConfig,
        // @ts-ignore
        headers: new Headers(finalConfig.headers)
      })

      if(!res.ok) {
        const error: PanteraError<T> = {
          ...res,
          data: finalConfig.responseType === 'json'
            ? await res.json() as T
            : await res.text() as unknown as T,
          headers: parseHeaders(res.headers),
          config: finalConfig
        }

        if(this.responseInterceptor)
          return await this.responseInterceptor.onError(error)

        return Promise.reject(res)
      }

      const response: PanteraResponse<T> = {
        ...res,
        config: finalConfig,
        headers: parseHeaders(res.headers),
        data: finalConfig.responseType === 'json'
          ? await res.json() as T
          : await res.text() as T
      }

      if(this.responseInterceptor)
        return await this.responseInterceptor.onSuccess(response)

      return Promise.resolve(response)
    }
    catch (err: any) {
      const error: PanteraError<T> = {
        ...err,
        config: finalConfig
      }

      if(this.responseInterceptor)
        return await this.responseInterceptor.onError(error)

      return Promise.reject(error)
    }
  }

  public get = <T = any>(url: string, config: PanteraConfig) => this.request<T>({
    method: 'get',
    url: url,
    ...config
  })

  public post = <T = any>(url: string, config: PanteraConfig) => this.request<T>({
    method: 'post',
    url: url,
    ...config
  })

  public put = <T = any>(url: string, config: PanteraConfig) => this.request<T>({
    method: 'put',
    url: url,
    ...config
  })

  public patch = <T = any>(url: string, config: PanteraConfig) => this.request<T>({
    method: 'patch',
    url: url,
    ...config
  })

  public delete = <T = any>(url: string, config: PanteraConfig) => this.request<T>({
    method: 'delete',
    url: url,
    ...config
  })

  public options = <T = any>(url: string, config: PanteraConfig) => this.request<T>({
    method: 'options',
    url: url,
    ...config
  })

  public head = <T = any>(url: string, config: PanteraConfig) => this.request<T>({
    method: 'head',
    url: url,
    ...config
  })

  private bindRequestInterceptor = (
    onBeforeSend: PanteraRequestInterceptors['onBeforeSend']
  ) => {
    this.requestInterceptor = {
      onBeforeSend
    }
  }

  private unBindRequestInterceptor = () => {
    this.requestInterceptor = undefined
  }

  private bindResponseInterceptor = (
    onSuccess: PanteraResponseInterceptors['onSuccess'],
    onError: PanteraResponseInterceptors['onError']
  ) => {
    this.responseInterceptor = {
      onSuccess,
      onError
    }
  }

  private unBindResponseInterceptor = () => {
    this.responseInterceptor = undefined
  }

  public interceptors = {
    request: {
      use: this.bindRequestInterceptor,
      eject: this.unBindRequestInterceptor
    },
    response: {
      use: this.bindResponseInterceptor,
      eject: this.unBindResponseInterceptor
    }
  }
}
