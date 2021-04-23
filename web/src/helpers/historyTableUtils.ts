export const depositColorMapping = {
    accepted: 'var(--system-green)',
    collected: 'var(--system-green)',
    submitted: '',
    canceled: 'var(--system-red)',
    rejected: 'var(--system-red)',
};

export const withdrawColorMapping = {
    prepared: '',
    submitted: '',
    canceled: 'var(--system-red)',
    accepted: 'var(--system-green)',
    suspected: '',
    rejected: 'var(--system-red)',
    processing: '',
    succeed: 'var(--system-green)',
    failed: 'var(--system-red)',
    errored: 'var(--system-red)',
    confirming: '',
};

export const offersColorMapping = {
    wait: 'var(--system-yellow)',
    cancelled: 'var(--system-red)',
    done: 'var(--system-green)',
};

export const tradesColorMapping = {
    sell: {
        color: 'var(--asks)',
        text: 'Sell',
    },
    buy: {
        color: 'var(--bids)',
        text: 'Buy',
    },
};

export const transferColorMapping = {
    completed: 'var(--system-green)',
};

export const stateColorMapping = {
    dispute: {
        color: 'var(--system-yellow)',
        text: 'Dispute',
    },
    done: {
        color: 'var(--bids)',
        text: 'Completed',
    },
    cancelled: {
        color: 'var(--asks)',
        text: 'Cancelled',
    },
    autocancelled: {
        color: 'var(--asks)',
        text: 'Auto Cancelled',
    },
    wait: {
        color: 'var(--system-yellow)',
        text: 'Wait',
    },
    prepared: {
        color: 'var(--system-yellow)',
        text: 'Prepared',
    },
}

export const setDepositStatusColor = (status: string): string => depositColorMapping[status];

export const setWithdrawStatusColor = (status: string): string => withdrawColorMapping[status];

export const setTradesType = (type: string) => tradesColorMapping[type] || { color: '', text: '' };

export const setTransferStatusColor = (status: string): string => transferColorMapping[status];

export const setOfferStatusColor = (status: string): string => offersColorMapping[status];

export const setStateType = (status: string) => stateColorMapping[status] || {color: '', text: ''};
