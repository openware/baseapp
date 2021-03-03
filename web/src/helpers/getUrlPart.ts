/* eslint-disable */
export const getUrlPart = (index: number, url: string): string => {
    const part = url.split(/[\/#?]/)[index];

    return part ? part : '';
};
