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
        if (this.requestInterceptor)
            finalConfig = await this.requestInterceptor.onBeforeSend(finalConfig);
        const reqBody = transformBody(finalConfig);
        const reqUrl = transformUrl(finalConfig);
        const reqHeaders = transformHeaders(finalConfig, reqBody);
        const reqCredentials = transformCredentials(finalConfig);
        try {
            const res = await fetch(reqUrl, {
                ...finalConfig,
                method: finalConfig.method?.toUpperCase(),
                body: reqBody,
                headers: reqHeaders,
                credentials: reqCredentials
            });
            let data = undefined;
            try {
                data = await transformResponse(finalConfig, res);
            }
            catch (err) { }
            const headers = Object.fromEntries(res.headers.entries());
            if (!res.ok) {
                const error = {
                    ...Object.assign({}, res, {
                        bodyUsed: res.bodyUsed,
                        redirected: res.redirected,
                        status: res.status,
                        statusText: res.statusText,
                        type: res.type,
                        url: res.url,
                    }, res, {
                        config: finalConfig,
                        headers: headers,
                        data: data
                    })
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
                ...Object.assign({}, res, {
                    bodyUsed: res.bodyUsed,
                    redirected: res.redirected,
                    status: res.status,
                    statusText: res.statusText,
                    type: res.type,
                    url: res.url,
                }, res, {
                    config: finalConfig,
                    headers: headers,
                    data: data
                })
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
