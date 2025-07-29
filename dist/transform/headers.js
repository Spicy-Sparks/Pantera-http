export const transformHeaders = (config, body) => {
    if (!config.headers)
        return;
    const headers = {};
    for (const key in config.headers) {
        const value = config.headers[key];
        if (typeof value === 'undefined' || value === null)
            continue;
        // Skip multipart/form-data header if body is FormData
        if (key.toLowerCase() === 'content-type' &&
            value === 'multipart/form-data' &&
            body?.constructor === FormData) {
            continue;
        }
        headers[key] = value.toString();
    }
    // Add Basic Auth header if auth is provided and no Authorization header exists
    if (config.auth && !config.headers.Authorization) {
        const { username, password } = config.auth;
        const value = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
        headers['Authorization'] = value;
    }
    return headers;
};
