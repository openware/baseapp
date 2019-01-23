const tradesColorMapping = {
    buy: {
        color: 'var(--color-red)',
    },
    sell: {
        color: 'var(--color-green)',
    },
};

export const setTradeColor = (side: string) => tradesColorMapping[side] || { color: ''};
