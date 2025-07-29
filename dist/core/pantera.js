import { mergeConfig } from '../utils/config';
import { transformBody } from '../transform/body';
import { transformUrl } from '../transform/url';
import { transformHeaders } from '../transform/headers';
import { transformCredentials } from '../transform/credentials';
import { transformResponse } from '../transform/response';
import { errorToObject } from '../utils/errors';
export class Pantera {
    baseConfig;
    requestInterceptor;
    responseInterceptor;
    constructor(config) {
        this.baseConfig = config;
    }
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
        try {
            const xhrResponse = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open((finalConfig.method ?? 'GET').toUpperCase(), reqUrl, true);
                xhr.withCredentials = reqCredentials === 'include';
                // if (finalConfig.timeout != null) xhr.timeout = finalConfig.timeout
                Object.entries(reqHeaders ?? {}).forEach(([k, v]) => {
                    if (v !== undefined)
                        xhr.setRequestHeader(k, String(v));
                });
                xhr.onload = () => {
                    const raw = xhr.getAllResponseHeaders();
                    const map = new Map();
                    raw.trim().split(/[\r\n]+/).forEach(line => {
                        const [key, ...rest] = line.split(': ');
                        if (key)
                            map.set(key, rest.join(': '));
                    });
                    const headersObject = Object.fromEntries(map);
                    const resLike = {
                        ok: xhr.status >= 200 && xhr.status < 300,
                        status: xhr.status,
                        statusText: xhr.statusText,
                        url: xhr.responseURL,
                        headers: { entries: () => map.entries() },
                        text: () => Promise.resolve(xhr.responseText),
                        json: () => Promise.resolve(JSON.parse(xhr.responseText)),
                        blob: () => Promise.resolve(new Blob([xhr.response])),
                        arrayBuffer: () => Promise.resolve(new TextEncoder().encode(xhr.responseText).buffer),
                        bodyUsed: false,
                        redirected: false,
                        type: 'basic'
                    };
                    resolve({ resLike, headersObject });
                };
                xhr.onerror = () => reject(new TypeError('Network request failed'));
                xhr.ontimeout = () => reject(new TypeError('XMLHttpRequest timeout'));
                xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'));
                xhr.send(reqBody);
            });
            const { resLike, headersObject } = xhrResponse;
            let data;
            try {
                data = await transformResponse(finalConfig, resLike);
            }
            catch (_err) { }
            if (!resLike.ok) {
                const error = {
                    ...Object.assign({}, resLike, {
                        status: resLike.status,
                        statusText: resLike.statusText,
                        url: resLike.url,
                    }),
                    config: finalConfig,
                    headers: headersObject,
                    data
                };
                if (this.responseInterceptor) {
                    try {
                        return await this.responseInterceptor.onError(error);
                    }
                    catch (err) {
                        return Promise.reject(err);
                    }
                }
                return Promise.reject(error);
            }
            const response = {
                ...Object.assign({}, resLike, {
                    status: resLike.status,
                    statusText: resLike.statusText,
                    url: resLike.url,
                }),
                config: finalConfig,
                headers: headersObject,
                data
            };
            if (this.responseInterceptor)
                return await this.responseInterceptor.onSuccess(response);
            return Promise.resolve(response);
        }
        catch (err) {
            const error = {
                ...errorToObject(err),
                config: finalConfig
            };
            if (this.responseInterceptor) {
                try {
                    return await this.responseInterceptor.onError(error);
                }
                catch (err) {
                    return Promise.reject(err);
                }
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
