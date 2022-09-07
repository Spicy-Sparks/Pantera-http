export const transformCredentials = (config) => {
    if (config.credentials === true)
        return 'include';
    if (config.credentials === false)
        return 'omit';
    return config.credentials;
};
