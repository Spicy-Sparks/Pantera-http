export const transformHeaders = (config) => {
    if (!config.headers)
        return;
    let headers = new Headers();
    for (var key in config.headers) {
        const value = config.headers[key];
        if (typeof value === 'undefined' || value === null)
            continue;
        headers.append(key, value.toString());
    }
    if (config.auth && !config.headers.Authorization) {
        const { username, password } = config.auth;
        const value = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
        headers.append('Authorization', value);
    }
    return headers;
};
