export const setStatusColor = (status: string): string => {
    const colorMapping = {
        accepted: 'var(--color-green)',
        collected: 'var(--color-green)',
        submitted: '',
        canceled: 'var(--color-red)',
        rejected: 'var(--color-red)',
    };

    return colorMapping[status];
};
