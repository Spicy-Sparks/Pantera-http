import {
  PanteraConfig,
  PanteraResponseInterceptors,
  PantersResponse,
  PanteraRequestInterceptors
} from './types'
import {
  mergeConfig,
  mergeUrl
} from './config'

export class Pantera {

  private baseConfig?: PanteraConfig

  private requestInterceptor?: PanteraRequestInterceptors

  private responseInterceptor?: PanteraResponseInterceptors

  constructor (config?: PanteraConfig) {
    this.baseConfig = config
  }

  public request = async <T = any>(config: PanteraConfig): Promise<PantersResponse<T>> => {
    let finalConfig = this.baseConfig
      ? mergeConfig(this.baseConfig, config)
      : config

    if(this.requestInterceptor)
      finalConfig = await this.requestInterceptor.onBeforeSend(config)

    const finalUrl = mergeUrl(finalConfig.url || '', finalConfig.baseUrl)

    try {
      const res = await fetch(finalUrl, finalConfig)

      if(!res.ok) {
        if(this.responseInterceptor)
          return await this.responseInterceptor.onError(res)

        return Promise.reject(res)
      }

      const response: PantersResponse<T> = {
        ...res,
        data: finalConfig.responseType === 'json'
          ? await res.json() as T
          : await res.text() as T
      }

      if(this.responseInterceptor)
        return await this.responseInterceptor.onSuccess(response)

      return Promise.resolve(response)
    }
    catch (err: any) {
      if(this.responseInterceptor)
        return await this.responseInterceptor.onError(err)

      return Promise.reject(err)
    }
  }

  public get = (url: string, config: PanteraConfig) => this.request({
    method: 'get',
    url: url,
    ...config
  })

  public post = (url: string, config: PanteraConfig) => this.request({
    method: 'post',
    url: url,
    ...config
  })

  public put = (url: string, config: PanteraConfig) => this.request({
    method: 'put',
    url: url,
    ...config
  })

  public patch = (url: string, config: PanteraConfig) => this.request({
    method: 'patch',
    url: url,
    ...config
  })

  public delete = (url: string, config: PanteraConfig) => this.request({
    method: 'delete',
    url: url,
    ...config
  })

  public options = (url: string, config: PanteraConfig) => this.request({
    method: 'options',
    url: url,
    ...config
  })

  public head = (url: string, config: PanteraConfig) => this.request({
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
