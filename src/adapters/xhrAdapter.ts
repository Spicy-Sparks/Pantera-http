import { PanteraAdapter, AdapterRequestParams, AdapterResponse } from './types'

function parseRawHeaders(raw: string): Record<string, string> {
  const headers: Record<string, string> = {}
  for (const line of raw.trim().split(/[\r\n]+/)) {
    const [key, ...rest] = line.split(': ')
    if (key) {
      headers[key] = rest.join(': ')
    }
  }
  return headers
}

export const xhrAdapter: PanteraAdapter = {
  name: 'xhr',

  request(params: AdapterRequestParams): Promise<AdapterResponse> {
    const {
      url,
      method,
      headers,
      body,
      credentials,
      timeout,
      signal,
      onUploadProgress,
      onDownloadProgress
    } = params

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open(method, url, true)
      xhr.withCredentials = credentials === 'include'

      if (timeout != null) {
        xhr.timeout = timeout
      }

      for (const [key, value] of Object.entries(headers)) {
        if (value !== undefined) {
          xhr.setRequestHeader(key, String(value))
        }
      }

      if (onUploadProgress && xhr.upload) {
        xhr.upload.onprogress = onUploadProgress
      }

      if (onDownloadProgress) {
        xhr.onprogress = onDownloadProgress
      }

      if (signal) {
        if (signal.aborted) {
          xhr.abort()
          reject(new DOMException('Aborted', 'AbortError'))
          return
        }
        signal.addEventListener('abort', () => xhr.abort())
      }

      xhr.onload = () => {
        const responseText = xhr.responseText

        resolve({
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          statusText: xhr.statusText,
          url: xhr.responseURL,
          headers: parseRawHeaders(xhr.getAllResponseHeaders()),
          text: () => Promise.resolve(responseText),
          json: () => Promise.resolve(JSON.parse(responseText)),
          blob: () => Promise.resolve(new Blob([xhr.response])),
          arrayBuffer: () => Promise.resolve(new TextEncoder().encode(responseText).buffer),
          redirected: false,
          type: 'basic'
        })
      }

      xhr.onerror = () => reject(new TypeError('Network request failed'))
      xhr.ontimeout = () => reject(new TypeError('Request timeout'))
      xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'))

      xhr.send(body as XMLHttpRequestBodyInit | null)
    })
  }
}
