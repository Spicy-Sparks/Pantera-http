export const transformResponse = async (config, response) => {
    if (response.bodyUsed || response.status === 204)
        return;
    switch (config.responseType) {
        case 'json':
            return await response.json();
        case 'blob':
            return await response.blob();
        case 'arraybuffer':
            return await response.arrayBuffer();
        case 'text':
        default:
            return await response.text();
    }
};
