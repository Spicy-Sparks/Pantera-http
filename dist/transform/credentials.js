"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformCredentials = void 0;
const transformCredentials = (config) => {
    if (config.credentials === true)
        return 'include';
    if (config.credentials === false)
        return 'omit';
    return config.credentials;
};
exports.transformCredentials = transformCredentials;
