export const buildQueryStringArray = (array: string[], key: string) => (array
    .filter(w => w[1] !== '')
    .map(k => (`${key}[]=${encodeURIComponent(k)}`))
    .join('&'));
