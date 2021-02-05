export const requiredValidator = (errorText: string) => (value: React.ReactText): string => {
    if (Array.isArray(value)) {
        return value.length > 0 ? undefined : errorText;
    }

    return value ? undefined : errorText;
};
