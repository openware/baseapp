export const depositColorMapping = {
    accepted: 'var(--rgb-system-green)',
    collected: 'var(--rgb-system-green)',
    submitted: '',
    canceled: 'var(--rgb-system-red)',
    rejected: 'var(--rgb-system-red)',
};

export const withdrawColorMapping = {
    prepared: '',
    submitted: '',
    canceled: 'var(--rgb-system-red)',
    accepted: 'var(--rgb-system-green)',
    suspected: '',
    rejected: 'var(--rgb-system-red)',
    processing: '',
    succeed: 'var(--rgb-system-green)',
    failed: 'var(--rgb-system-red)',
    errored: 'var(--rgb-system-red)',
    confirming: '',
};

export const tradesColorMapping = {
    sell: {
        color: 'var(--rgb-asks)',
        text: 'Sell',
    },
    buy: {
        color: 'var(--rgb-bids)',
        text: 'Buy',
    },
};

export const setDepositStatusColor = (status: string): string => depositColorMapping[status];

export const setWithdrawStatusColor = (status: string): string => withdrawColorMapping[status];

export const setTradesType = (type: string) => tradesColorMapping[type] || { color: '', text: '' };
