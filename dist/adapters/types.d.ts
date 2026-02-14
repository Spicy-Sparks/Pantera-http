import { ResponseType } from '../types';
export interface AdapterRequestParams {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: BodyInit | null;
    credentials: RequestCredentials;
    timeout?: number;
    signal?: AbortSignal;
    redirect?: RequestRedirect;
    responseType?: ResponseType;
    onUploadProgress?: (event: ProgressEvent) => void;
    onDownloadProgress?: (event: ProgressEvent) => void;
}
export interface AdapterResponse {
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
    headers: Record<string, string>;
    text: () => Promise<string>;
    json: () => Promise<unknown>;
    blob: () => Promise<Blob>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    redirected: boolean;
    type: globalThis.ResponseType;
}
export interface PanteraAdapter {
    name: string;
    request: (params: AdapterRequestParams) => Promise<AdapterResponse>;
}
export declare type AdapterType = 'fetch' | 'xhr' | PanteraAdapter;
export declare function parseHeadersToObject(headersIterable: Iterable<[string, string]>): Record<string, string>;
