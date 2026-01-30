export function parseHeadersToObject(headersIterable) {
    const result = {};
    for (const [key, value] of headersIterable) {
        result[key] = value;
    }
    return result;
}
