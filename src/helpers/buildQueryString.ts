// eslint-disable

const buildQueryArray = (data) => {
    let queryArray = '';

    if (data && data[0] && data[1]) {
        data[1].reduce((acc, cur) => {
            queryArray = `${queryArray}${data[0]}[]=${encodeURIComponent(cur)}&`;

            return acc;
        }, {});
        queryArray = queryArray.substring(0, queryArray.length - 1);
    }

    return queryArray;
};

// tslint:disable:no-any
export const buildQueryString = (action: any, key?: string) =>
    Object.entries(action)
        .filter((w) => w[1] !== '')
        .map((k: any) => {
            return Array.isArray(k[1]) ? buildQueryArray(k) : `${k[0]}=${encodeURIComponent(k[1])}`;
        })
        .join('&');
