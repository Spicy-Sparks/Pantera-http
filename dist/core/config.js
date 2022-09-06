"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeConfig = void 0;
const mergeConfig = (config1, config2) => {
    return {
        ...config1,
        ...config2,
        headers: new Headers({
            ...config1.headers,
            ...config2.headers
        })
    };
};
exports.mergeConfig = mergeConfig;
