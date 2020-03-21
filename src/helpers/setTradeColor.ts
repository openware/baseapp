const tradesColorMapping = {
    buy: {
        color: 'var(--rgb-bids)',
    },
    sell: {
        color: 'var(--rgb-asks)',
    },
};

export const setTradeColor = (side: string) => tradesColorMapping[side] || { color: ''};
