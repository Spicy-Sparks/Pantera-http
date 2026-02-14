import { PanteraAdapter, AdapterRequestParams, AdapterResponse, parseHeadersToObject } from './types'

export const fetchAdapter: PanteraAdapter = {
  name: 'fetch',

  async request(params: AdapterRequestParams): Promise<AdapterResponse> {
    const { url, method, headers, body, credentials, timeout, signal, redirect } = params

    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let abortController: AbortController | undefined

    if (timeout && !signal) {
      abortController = new AbortController()
      timeoutId = setTimeout(() => abortController!.abort(), timeout)
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        credentials,
        signal: signal ?? abortController?.signal,
        ...(redirect && { redirect })
      })

      const clonedResponse = response.clone()

      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: parseHeadersToObject(response.headers.entries()),
        text: () => clonedResponse.text(),
        json: () => clonedResponse.json(),
        blob: () => clonedResponse.blob(),
        arrayBuffer: () => clonedResponse.arrayBuffer(),
        redirected: response.redirected,
        type: response.type
      }
    } catch (error) {
      const isAbortError = error instanceof Error && error.name === 'AbortError'
      if (isAbortError && timeoutId) {
        throw new TypeError('Request timeout')
      }
      if (isAbortError) {
        throw new DOMException('Aborted', 'AbortError')
      }
      throw new TypeError('Network request failed')
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }
}
