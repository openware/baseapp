export const depositColorMapping = {
    accepted: 'var(--system-green)',
    collected: 'var(--system-green)',
    submitted: '',
    canceled: 'var(--system-red)',
    rejected: 'var(--system-red)',
};

export const withdrawColorMapping = {
    prepared: 'var(--system-yellow)',
    submitted: '',
    canceled: 'var(--system-red)',
    accepted: 'var(--system-green)',
    suspected: '',
    rejected: 'var(--system-red)',
    processing: 'var(--system-yellow)',
    succeed: 'var(--system-green)',
    failed: 'var(--system-red)',
    confirming: '',
};

export const tradesColorMapping = {
    sell: {
        color: 'var(--system-red)',
        text: 'Sell',
    },
    buy: {
        color: 'var(--system-green)',
        text: 'Buy',
    },
};

export const setDepositStatusColor = (status: string): string => depositColorMapping[status];

export const setWithdrawStatusColor = (status: string): string => withdrawColorMapping[status];

export const setTradesType = (type: string) => tradesColorMapping[type] || { color: '', text: '' };
