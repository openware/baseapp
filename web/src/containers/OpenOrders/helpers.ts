export const getTriggerSign = (ordType: string, ordSide: string) => {
    if (ordType.includes('stop')) {
        if (ordSide === 'buy') {
            return '≥';
        } else {
            return '≤';
        }
    }

    if (ordType.includes('take')) {
        if (ordSide === 'buy') {
            return '≤';
        } else {
            return '≥';
        }
    }
};
