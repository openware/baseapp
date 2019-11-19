// tslint:disable:no-any
export const buildQueryString = (action: any) => (Object.entries(action)
    .filter(w => w[1] !== '')
    .map((k: any) => (`${k[0]}=${encodeURIComponent(k[1])}`))
    .join('&'));
