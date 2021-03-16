const buildQueryArray = data => {
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
export const buildQueryString = (action: any, key?: string) => (Object.entries(action)
    .filter(w => w[1] !== '')
    .map((k: any) => {
        const param = k[0] === 'page' ? Number(k[1]) + 1 : k[1];
        return (
            Array.isArray(param) ? buildQueryArray(k) : `${k[0]}=${encodeURIComponent(param)}`
        );
    })
    .join('&'));
