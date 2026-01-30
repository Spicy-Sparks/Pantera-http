import { ResponseType } from '../types'

export interface AdapterRequestParams {
  url: string
  method: string
  headers: Record<string, string>
  body?: BodyInit | null
  credentials: RequestCredentials
  timeout?: number
  signal?: AbortSignal
  responseType?: ResponseType
  onUploadProgress?: (event: ProgressEvent) => void
  onDownloadProgress?: (event: ProgressEvent) => void
}

export interface AdapterResponse {
  ok: boolean
  status: number
  statusText: string
  url: string
  headers: Record<string, string>
  text: () => Promise<string>
  json: () => Promise<unknown>
  blob: () => Promise<Blob>
  arrayBuffer: () => Promise<ArrayBuffer>
  redirected: boolean
  type: globalThis.ResponseType
}

export interface PanteraAdapter {
  name: string
  request: (params: AdapterRequestParams) => Promise<AdapterResponse>
}

export type AdapterType = 'fetch' | 'xhr' | PanteraAdapter

export function parseHeadersToObject(
  headersIterable: Iterable<[string, string]>
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of headersIterable) {
    result[key] = value
  }
  return result
}
