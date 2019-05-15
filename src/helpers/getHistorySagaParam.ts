import { HistoryFetchPayload } from '../modules/user/history';

export const getHistorySagaParam = (action: HistoryFetchPayload) => (Object.entries(action)
    .filter(w => w[1] !== undefined && w[0] !== 'type')
    .map(k => {
        const param = k[0] === 'page' ? Number(k[1]) + 1 : k[1];
        return `${k[0]}=${encodeURIComponent(param)}`;
    })
    .join('&'));
