import { PanteraConfig, PanteraResponseInterceptors, PanteraRequestInterceptors, PanteraResponse } from '../types';
import { PanteraAdapter, AdapterType } from '../adapters/types';
export declare class Pantera {
    private baseConfig?;
    private requestInterceptor?;
    private responseInterceptor?;
    private defaultAdapter;
    constructor(config?: PanteraConfig);
    setDefaultAdapter: (adapter: AdapterType) => void;
    getDefaultAdapter: () => PanteraAdapter;
    request: <T = any>(config: PanteraConfig) => Promise<PanteraResponse<T>>;
    get: <T = any>(url: string, config?: PanteraConfig) => Promise<PanteraResponse<T>>;
    post: <T = any>(url: string, config?: PanteraConfig) => Promise<PanteraResponse<T>>;
    put: <T = any>(url: string, config?: PanteraConfig) => Promise<PanteraResponse<T>>;
    patch: <T = any>(url: string, config?: PanteraConfig) => Promise<PanteraResponse<T>>;
    delete: <T = any>(url: string, config?: PanteraConfig) => Promise<PanteraResponse<T>>;
    options: <T = any>(url: string, config?: PanteraConfig) => Promise<PanteraResponse<T>>;
    head: <T = any>(url: string, config?: PanteraConfig) => Promise<PanteraResponse<T>>;
    getBaseConfig: () => PanteraConfig | undefined;
    setBaseConfig: (config: PanteraConfig) => PanteraConfig;
    private bindRequestInterceptor;
    private unBindRequestInterceptor;
    private bindResponseInterceptor;
    private unBindResponseInterceptor;
    interceptors: {
        request: {
            use: (onBeforeSend: PanteraRequestInterceptors['onBeforeSend']) => void;
            eject: () => void;
        };
        response: {
            use: (onSuccess: PanteraResponseInterceptors['onSuccess'], onError: PanteraResponseInterceptors['onError']) => void;
            eject: () => void;
        };
    };
}
