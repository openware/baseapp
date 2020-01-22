export const depositColorMapping = {
    accepted: 'var(--color-green)',
    collected: 'var(--color-green)',
    submitted: '',
    canceled: 'var(--color-red)',
    rejected: 'var(--color-red)',
};

export const withdrawColorMapping = {
    prepared: '',
    submitted: '',
    canceled: 'var(--color-red)',
    accepted: 'var(--color-green)',
    suspected: '',
    rejected: 'var(--color-red)',
    processing: '',
    succeed: 'var(--color-green)',
    failed: 'var(--color-red)',
    errored: 'var(--color-red)',
    confirming: '',
};

export const tradesColorMapping = {
    sell: {
        color: 'var(--color-red)',
        text: 'Sell',
    },
    buy: {
        color: 'var(--color-green)',
        text: 'Buy',
    },
};

export const setDepositStatusColor = (status: string): string => depositColorMapping[status];

export const setWithdrawStatusColor = (status: string): string => withdrawColorMapping[status];

export const setTradesType = (type: string) => tradesColorMapping[type] || { color: '', text: '' };
