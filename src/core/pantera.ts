import {
  PanteraConfig,
  PanteraResponseInterceptors,
  PanteraRequestInterceptors,
  PanteraResponse,
  PanteraError
} from '../types'
import {
  mergeConfig
} from '../utils/config'
import { transformBody } from '../transform/body'
import { transformUrl } from '../transform/url'
import { transformHeaders } from '../transform/headers'
import { transformCredentials } from '../transform/credentials'
import { transformResponse } from '../transform/response'
import { errorToObject } from '../utils/errors'

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
      finalConfig = await this.requestInterceptor.onBeforeSend(finalConfig)

    const reqBody = transformBody(finalConfig)
    const reqUrl = transformUrl(finalConfig)
    const reqHeaders = transformHeaders(finalConfig, reqBody)
    const reqCredentials = transformCredentials(finalConfig)

    try {
      const res = await fetch(reqUrl, {
        ...finalConfig,
        body: reqBody,
        headers: reqHeaders,
        credentials: reqCredentials
      })

      let data: T | undefined = undefined

      try {
        data = await transformResponse<T>(finalConfig, res)
      }
      catch (err) {}

      const headers = Object.fromEntries(res.headers.entries())

      if(!res.ok) {
        const error: PanteraError<T> = {
          ...res,
          data: data,
          headers: headers,
          config: finalConfig
        }

        if(this.responseInterceptor)
          return await this.responseInterceptor.onError(error)

        return Promise.reject(res)
      }

      const response: PanteraResponse<T> = {
        ...res,
        config: finalConfig,
        headers: headers,
        data: data
      }

      if(this.responseInterceptor)
        return await this.responseInterceptor.onSuccess(response)

      return Promise.resolve(response)
    }
    catch (err: any) {
      const error: PanteraError<T> = {
        ...errorToObject(err),
        config: finalConfig
      }

      if(this.responseInterceptor)
        return await this.responseInterceptor.onError(error)

      return Promise.reject(error)
    }
  }

  public get = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'get',
    url: url,
    ...config
  })

  public post = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'post',
    url: url,
    ...config
  })

  public put = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'put',
    url: url,
    ...config
  })

  public patch = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'patch',
    url: url,
    ...config
  })

  public delete = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'delete',
    url: url,
    ...config
  })

  public options = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'options',
    url: url,
    ...config
  })

  public head = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'head',
    url: url,
    ...config
  })

  public getBaseConfig = (): PanteraConfig | undefined => this.baseConfig

  public setBaseConfig = (config: PanteraConfig): PanteraConfig => {
    this.baseConfig = config
    return this.baseConfig
  }

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
