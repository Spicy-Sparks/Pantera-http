"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformUrl = void 0;
const config_1 = require("../utils/config");
const transformUrl = (config) => {
    const finalUrl = (0, config_1.mergeUrl)(config.url || '', config.baseUrl);
    if (config.params && config.method?.match(/get|head/)) {
        // @ts-ignore
        const urlSearchParams = new URLSearchParams(config.params).toString();
        return `${finalUrl}?${urlSearchParams}`;
    }
    return finalUrl;
};
exports.transformUrl = transformUrl;
