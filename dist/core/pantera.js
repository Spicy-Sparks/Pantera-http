import { mergeConfig } from '../utils/config';
import { transformBody } from '../transform/body';
import { transformUrl } from '../transform/url';
import { transformHeaders } from '../transform/headers';
import { transformCredentials } from '../transform/credentials';
import { transformResponse } from '../transform/response';
import { errorToObject } from '../utils/errors';
import { xhrAdapter } from '../adapters/xhrAdapter';
import { fetchAdapter } from '../adapters/fetchAdapter';
const adapterMap = {
    fetch: fetchAdapter,
    xhr: xhrAdapter
};
function resolveAdapter(adapterConfig, defaultAdapter) {
    if (!adapterConfig) {
        return defaultAdapter;
    }
    if (typeof adapterConfig === 'string') {
        return adapterMap[adapterConfig] ?? defaultAdapter;
    }
    return adapterConfig;
}
export class Pantera {
    baseConfig;
    requestInterceptor;
    responseInterceptor;
    defaultAdapter = xhrAdapter;
    constructor(config) {
        this.baseConfig = config;
    }
    setDefaultAdapter = (adapter) => {
        this.defaultAdapter = resolveAdapter(adapter, this.defaultAdapter);
    };
    getDefaultAdapter = () => {
        return this.defaultAdapter;
    };
    request = async (config) => {
        let finalConfig = this.baseConfig
            ? mergeConfig(this.baseConfig, config)
            : config;
        if (this.requestInterceptor) {
            finalConfig = await this.requestInterceptor.onBeforeSend(finalConfig);
        }
        const reqBody = transformBody(finalConfig);
        const reqUrl = transformUrl(finalConfig);
        const reqHeaders = transformHeaders(finalConfig, reqBody);
        const reqCredentials = transformCredentials(finalConfig);
        const adapter = resolveAdapter(finalConfig.adapter, this.defaultAdapter);
        const adapterParams = {
            url: reqUrl,
            method: (finalConfig.method ?? 'GET').toUpperCase(),
            headers: reqHeaders ?? {},
            body: reqBody,
            credentials: reqCredentials ?? 'same-origin',
            timeout: finalConfig.timeout,
            signal: finalConfig.signal,
            redirect: finalConfig.redirect,
            responseType: finalConfig.responseType,
            onUploadProgress: finalConfig.onUploadProgress,
            onDownloadProgress: finalConfig.onDownloadProgress
        };
        try {
            const adapterResponse = await adapter.request(adapterParams);
            let data;
            try {
                data = await transformResponse(finalConfig, adapterResponse);
            }
            catch (_err) {
                // Response transformation failed, data remains undefined
            }
            const baseResponse = {
                status: adapterResponse.status,
                statusText: adapterResponse.statusText,
                url: adapterResponse.url,
                headers: adapterResponse.headers,
                config: finalConfig,
                data
            };
            if (!adapterResponse.ok) {
                const error = baseResponse;
                if (this.responseInterceptor) {
                    return this.responseInterceptor.onError(error);
                }
                return Promise.reject(error);
            }
            const response = baseResponse;
            if (this.responseInterceptor) {
                return this.responseInterceptor.onSuccess(response);
            }
            return response;
        }
        catch (err) {
            const error = {
                ...errorToObject(err),
                config: finalConfig
            };
            if (this.responseInterceptor) {
                return this.responseInterceptor.onError(error);
            }
            return Promise.reject(error);
        }
    };
    get = (url, config) => this.request({
        method: 'GET',
        url: url,
        ...config
    });
    post = (url, config) => this.request({
        method: 'POST',
        url: url,
        ...config
    });
    put = (url, config) => this.request({
        method: 'PUT',
        url: url,
        ...config
    });
    patch = (url, config) => this.request({
        method: 'PATCH',
        url: url,
        ...config
    });
    delete = (url, config) => this.request({
        method: 'DELETE',
        url: url,
        ...config
    });
    options = (url, config) => this.request({
        method: 'OPTIONS',
        url: url,
        ...config
    });
    head = (url, config) => this.request({
        method: 'HEAD',
        url: url,
        ...config
    });
    getBaseConfig = () => this.baseConfig;
    setBaseConfig = (config) => {
        this.baseConfig = config;
        return this.baseConfig;
    };
    bindRequestInterceptor = (onBeforeSend) => {
        this.requestInterceptor = {
            onBeforeSend
        };
    };
    unBindRequestInterceptor = () => {
        this.requestInterceptor = undefined;
    };
    bindResponseInterceptor = (onSuccess, onError) => {
        this.responseInterceptor = {
            onSuccess,
            onError
        };
    };
    unBindResponseInterceptor = () => {
        this.responseInterceptor = undefined;
    };
    interceptors = {
        request: {
            use: this.bindRequestInterceptor,
            eject: this.unBindRequestInterceptor
        },
        response: {
            use: this.bindResponseInterceptor,
            eject: this.unBindResponseInterceptor
        }
    };
}
