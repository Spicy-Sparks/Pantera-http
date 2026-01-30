import {
  PanteraConfig,
  PanteraResponseInterceptors,
  PanteraRequestInterceptors,
  PanteraResponse,
  PanteraError
} from '../types'
import { mergeConfig } from '../utils/config'
import { transformBody } from '../transform/body'
import { transformUrl } from '../transform/url'
import { transformHeaders } from '../transform/headers'
import { transformCredentials } from '../transform/credentials'
import { transformResponse } from '../transform/response'
import { errorToObject } from '../utils/errors'
import { PanteraAdapter, AdapterType, AdapterRequestParams } from '../adapters/types'
import { xhrAdapter } from '../adapters/xhrAdapter'
import { fetchAdapter } from '../adapters/fetchAdapter'

const adapterMap: Record<string, PanteraAdapter> = {
  fetch: fetchAdapter,
  xhr: xhrAdapter
}

function resolveAdapter(
  adapterConfig: AdapterType | undefined,
  defaultAdapter: PanteraAdapter
): PanteraAdapter {
  if (!adapterConfig) {
    return defaultAdapter
  }
  if (typeof adapterConfig === 'string') {
    return adapterMap[adapterConfig] ?? defaultAdapter
  }
  return adapterConfig
}

export class Pantera {

  private baseConfig?: PanteraConfig

  private requestInterceptor?: PanteraRequestInterceptors

  private responseInterceptor?: PanteraResponseInterceptors

  private defaultAdapter: PanteraAdapter = xhrAdapter

  constructor (config?: PanteraConfig) {
    this.baseConfig = config
  }

  public setDefaultAdapter = (adapter: AdapterType) => {
    this.defaultAdapter = resolveAdapter(adapter, this.defaultAdapter)
  }

  public getDefaultAdapter = (): PanteraAdapter => {
    return this.defaultAdapter
  }

  public request = async <T = any>(config: PanteraConfig): Promise<PanteraResponse<T>> => {
    let finalConfig = this.baseConfig
      ? mergeConfig(this.baseConfig, config)
      : config

    if (this.requestInterceptor) {
      finalConfig = await this.requestInterceptor.onBeforeSend(finalConfig)
    }

    const reqBody        = transformBody(finalConfig)
    const reqUrl         = transformUrl(finalConfig)
    const reqHeaders     = transformHeaders(finalConfig, reqBody)
    const reqCredentials = transformCredentials(finalConfig)

    const adapter = resolveAdapter(finalConfig.adapter, this.defaultAdapter)

    const adapterParams: AdapterRequestParams = {
      url: reqUrl,
      method: (finalConfig.method ?? 'GET').toUpperCase(),
      headers: reqHeaders ?? {},
      body: reqBody,
      credentials: reqCredentials ?? 'same-origin',
      timeout: finalConfig.timeout,
      signal: finalConfig.signal,
      responseType: finalConfig.responseType,
      onUploadProgress: finalConfig.onUploadProgress,
      onDownloadProgress: finalConfig.onDownloadProgress
    }

    try {
      const adapterResponse = await adapter.request(adapterParams)

      let data: T | undefined
      try {
        data = await transformResponse<T>(finalConfig, adapterResponse as unknown as Response)
      } catch (_err) {
        // Response transformation failed, data remains undefined
      }

      const baseResponse = {
        status: adapterResponse.status,
        statusText: adapterResponse.statusText,
        url: adapterResponse.url,
        headers: adapterResponse.headers,
        config: finalConfig,
        data
      }

      if (!adapterResponse.ok) {
        const error: PanteraError<T> = baseResponse
        if (this.responseInterceptor) {
          return this.responseInterceptor.onError(error)
        }
        return Promise.reject(error)
      }

      const response = baseResponse as PanteraResponse<T>

      if (this.responseInterceptor) {
        return this.responseInterceptor.onSuccess(response)
      }

      return response
    } catch (err) {
      const error: PanteraError<T> = {
        ...errorToObject(err as Error),
        config: finalConfig
      }
      if (this.responseInterceptor) {
        return this.responseInterceptor.onError(error)
      }
      return Promise.reject(error)
    }
  }

  public get = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'GET',
    url: url,
    ...config
  })

  public post = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'POST',
    url: url,
    ...config
  })

  public put = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'PUT',
    url: url,
    ...config
  })

  public patch = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'PATCH',
    url: url,
    ...config
  })

  public delete = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'DELETE',
    url: url,
    ...config
  })

  public options = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'OPTIONS',
    url: url,
    ...config
  })

  public head = <T = any>(url: string, config?: PanteraConfig) => this.request<T>({
    method: 'HEAD',
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
