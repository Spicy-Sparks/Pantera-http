import { mergeUrl } from '../utils/config';
export const transformUrl = (config) => {
    const finalUrl = mergeUrl(config.url || '', config.baseUrl);
    if (config.params && config.method?.toLocaleLowerCase()?.match(/get|head/)) {
        // @ts-ignore
        const urlSearchParams = new URLSearchParams(config.params).toString();
        return `${finalUrl}?${urlSearchParams}`;
    }
    return finalUrl;
};
