"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFormData = exports.generateUrlSearchParams = exports.generateApplicationJson = exports.transformBody = void 0;
const transformBody = (config) => {
    if (!config.body)
        return config.body;
    const contentType = config.headers && config.headers['Content-Type'];
    if ((typeof config.body === 'object') && (typeof contentType === 'string')) {
        if (contentType.startsWith('application/json'))
            return (0, exports.generateApplicationJson)(config.body);
        if (contentType.startsWith('application/x-www-form-urlencoded'))
            return (0, exports.generateUrlSearchParams)(config.body);
        if (contentType.startsWith('multipart/form-data'))
            return (0, exports.generateFormData)(config.body);
    }
    return config.body;
};
exports.transformBody = transformBody;
const generateApplicationJson = (body) => {
    if (typeof body !== 'object')
        return body;
    return JSON.stringify(body);
};
exports.generateApplicationJson = generateApplicationJson;
const generateUrlSearchParams = (params) => {
    if ((typeof params !== 'object') || (params.constructor === URLSearchParams))
        return params;
    return `&${new URLSearchParams(params).toString()}`;
};
exports.generateUrlSearchParams = generateUrlSearchParams;
const generateFormData = (body) => {
    if ((typeof body !== 'object') || (body.constructor === FormData))
        return body;
    let formData = new FormData();
    for (var key in body)
        formData.append(key, body[key]);
    return formData;
};
exports.generateFormData = generateFormData;
