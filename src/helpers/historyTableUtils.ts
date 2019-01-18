export const setDepositStatusColor = (status: string): string => {
    const colorMapping = {
        accepted: 'var(--color-green)',
        collected: 'var(--color-green)',
        submitted: '',
        canceled: 'var(--color-red)',
        rejected: 'var(--color-red)',
    };

    return colorMapping[status];
};

export const setwithdrawStatusColor = (status: string): string => {
    const colorMapping = {
        prepared: '',
        submitted: '',
        canceled: 'var(--color-red)',
        accepted: 'var(--color-green)',
        suspected: '',
        rejected: 'var(--color-red)',
        processing: '',
        succeed: 'var(--color-green)',
        failed: 'var(--color-red)',
        confirming: '',
    };

    return colorMapping[status];
};
