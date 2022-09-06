"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pantera = void 0;
const config_1 = require("./config");
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
            finalConfig = await this.requestInterceptor.onBeforeSend(config);
        try {
            const res = await fetch("ciao", finalConfig);
            if (!res.ok) {
                if (this.responseInterceptor)
                    return await this.responseInterceptor.onError(res);
                return Promise.reject(res);
            }
            if (this.responseInterceptor)
                return await this.responseInterceptor.onSuccess(res);
            return Promise.resolve(res);
        }
        catch (err) {
            if (this.responseInterceptor)
                return await this.responseInterceptor.onError(err);
            return Promise.reject(err);
        }
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
const pantera = new Pantera({
    baseUrl: 'https://esound.api'
});
pantera.interceptors.request.use((config) => {
    console.log("REQUEST", config);
    return config;
});
pantera.interceptors.response.use((response) => {
    console.log("RESPONSE SUCCESS", response);
    return Promise.resolve(response);
}, (err) => {
    console.log("RESPONSE ERROR", err);
    return Promise.reject(err);
});
pantera.request({
    url: '/getCurrentUser'
});
