export const StringUtil = {
    isEqual: (first: string, second: string): boolean => {
        return (first || '').toLowerCase().trim() === (second || '').toLowerCase().trim();
    },
};
