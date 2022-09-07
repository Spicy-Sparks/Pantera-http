export const transformBody = (config) => {
    if (!config.body)
        return config.body;
    const contentType = config.headers && config.headers['Content-Type'];
    if ((typeof config.body === 'object') && (typeof contentType === 'string')) {
        if (contentType.startsWith('application/json'))
            return generateApplicationJson(config.body);
        if (contentType.startsWith('application/x-www-form-urlencoded'))
            return generateUrlSearchParams(config.body);
        if (contentType.startsWith('multipart/form-data'))
            return generateFormData(config.body);
    }
    return config.body;
};
export const generateApplicationJson = (body) => {
    if (typeof body !== 'object')
        return body;
    return JSON.stringify(body);
};
export const generateUrlSearchParams = (params) => {
    if ((typeof params !== 'object') || (params.constructor === URLSearchParams))
        return params;
    return `&${new URLSearchParams(params).toString()}`;
};
export const generateFormData = (body) => {
    if ((typeof body !== 'object') || (body.constructor === FormData))
        return body;
    let formData = new FormData();
    for (var key in body)
        formData.append(key, body[key]);
    return formData;
};
