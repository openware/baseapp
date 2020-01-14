const tradesColorMapping = {
    buy: {
        color: 'var(--system-green)',
    },
    sell: {
        color: 'var(--system-red)',
    },
};

export const setTradeColor = (side: string) => tradesColorMapping[side] || { color: ''};
