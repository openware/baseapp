const tradesColorMapping = {
    buy: {
        color: 'var(--bids)',
    },
    sell: {
        color: 'var(--asks)',
    },
};

export const setTradeColor = (side: string) => tradesColorMapping[side] || { color: ''};
