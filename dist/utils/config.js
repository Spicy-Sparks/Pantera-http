"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeUrl = exports.mergeConfig = void 0;
const mergeConfig = (config1, config2) => {
    return {
        ...config1,
        ...config2,
        ...((config1.headers || config2.headers) && {
            headers: {
                ...config1.headers,
                ...config2.headers
            }
        }),
        ...((config1.extraConfig || config2.extraConfig) && {
            extraConfig: {
                ...config1.extraConfig,
                ...config2.extraConfig
            }
        }),
        ...((config1.params || config2.params) && {
            params: {
                ...config1.params,
                ...config2.params
            }
        })
    };
};
exports.mergeConfig = mergeConfig;
const mergeUrl = (url, baseUrl) => {
    if (!baseUrl)
        return url;
    if (url.startsWith('http'))
        return url;
    if (baseUrl.endsWith('/'))
        baseUrl = baseUrl.slice(0, -1);
    if (!url.startsWith('/'))
        url = '/' + url;
    return baseUrl + url;
};
exports.mergeUrl = mergeUrl;
