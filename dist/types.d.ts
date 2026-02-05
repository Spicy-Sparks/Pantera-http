import { AdapterType } from './adapters/types';
export declare type ResponseType = 'json' | 'text' | 'blob' | 'arraybuffer';
export declare type PanteraHeaders = {
    [key: string]: string | number | boolean | null | undefined;
};
export declare type PanteraConfig = Omit<Omit<Omit<RequestInit, "credentials">, "body">, "headers"> & {
    baseUrl?: string;
    url?: string;
    responseType?: ResponseType;
    headers?: PanteraHeaders;
    body?: any;
    credentials?: boolean | RequestCredentials;
    params?: {
        [key: string]: string | number | boolean | null | undefined;
    };
    extraConfig?: {
        [key: string]: string | number | boolean | null | undefined;
    };
    auth?: {
        username: string;
        password: string;
    };
    adapter?: AdapterType;
    timeout?: number;
    signal?: AbortSignal;
    onUploadProgress?: (event: ProgressEvent) => void;
    onDownloadProgress?: (event: ProgressEvent) => void;
};
export declare type PanteraResponse<T = any> = Omit<Response, "headers"> & {
    config: PanteraConfig;
    data?: T;
    headers?: PanteraHeaders;
};
export declare type PanteraError<T = any> = Partial<Error> & Partial<Omit<Response, "headers">> & {
    config: PanteraConfig;
    data?: T;
    headers?: PanteraHeaders;
};
export declare type PanteraRequestInterceptors = {
    onBeforeSend: (config: PanteraConfig) => Promise<PanteraConfig> | PanteraConfig;
};
export declare type PanteraResponseInterceptors = {
    onSuccess: <T = any>(response: PanteraResponse<T>) => PanteraResponse<T> | Promise<PanteraResponse<T>>;
    onError: <T = any>(error: PanteraError<T>) => PanteraResponse<T> | Promise<PanteraResponse<T>>;
};
