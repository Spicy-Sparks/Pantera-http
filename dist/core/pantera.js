"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pantera = void 0;
const config_1 = require("../utils/config");
const body_1 = require("../transform/body");
const url_1 = require("../transform/url");
const headers_1 = require("../transform/headers");
const credentials_1 = require("../transform/credentials");
const response_1 = require("../transform/response");
const errors_1 = require("../utils/errors");
class Pantera {
    baseConfig;
    requestInterceptor;
    responseInterceptor;
    constructor(config) {
        this.baseConfig = config;
    }
    request = async (config) => {
        let finalConfig = this.baseConfig
            ? (0, config_1.mergeConfig)(this.baseConfig, config)
            : config;
        if (this.requestInterceptor)
            finalConfig = await this.requestInterceptor.onBeforeSend(finalConfig);
        const reqBody = (0, body_1.transformBody)(finalConfig);
        const reqUrl = (0, url_1.transformUrl)(finalConfig);
        const reqHeaders = (0, headers_1.transformHeaders)(finalConfig);
        const reqCredentials = (0, credentials_1.transformCredentials)(finalConfig);
        try {
            const res = await fetch(reqUrl, {
                ...finalConfig,
                body: reqBody,
                headers: reqHeaders,
                credentials: reqCredentials
            });
            let data = undefined;
            try {
                data = await (0, response_1.transformResponse)(finalConfig, res);
            }
            catch (err) { }
            const headers = Object.fromEntries(res.headers.entries());
            if (!res.ok) {
                const error = {
                    ...res,
                    data: data,
                    headers: headers,
                    config: finalConfig
                };
                if (this.responseInterceptor)
                    return await this.responseInterceptor.onError(error);
                return Promise.reject(res);
            }
            const response = {
                ...res,
                config: finalConfig,
                headers: headers,
                data: data
            };
            if (this.responseInterceptor)
                return await this.responseInterceptor.onSuccess(response);
            return Promise.resolve(response);
        }
        catch (err) {
            const error = {
                ...(0, errors_1.errorToObject)(err),
                config: finalConfig
            };
            if (this.responseInterceptor)
                return await this.responseInterceptor.onError(error);
            return Promise.reject(error);
        }
    };
    get = (url, config) => this.request({
        method: 'get',
        url: url,
        ...config
    });
    post = (url, config) => this.request({
        method: 'post',
        url: url,
        ...config
    });
    put = (url, config) => this.request({
        method: 'put',
        url: url,
        ...config
    });
    patch = (url, config) => this.request({
        method: 'patch',
        url: url,
        ...config
    });
    delete = (url, config) => this.request({
        method: 'delete',
        url: url,
        ...config
    });
    options = (url, config) => this.request({
        method: 'options',
        url: url,
        ...config
    });
    head = (url, config) => this.request({
        method: 'head',
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
exports.Pantera = Pantera;
