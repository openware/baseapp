export const randomSecureHex = (length: number) => {
    const maxlen = 8;
    const min = Math.pow(16, Math.min(length, maxlen) - 1);
    const max = Math.pow(16, Math.min(length, maxlen)) - 1;
    const numberResult = Math.floor(Math.random() * (max - min + 1)) + min;
    let result = numberResult.toString(16);

    while (result.length < length) {
        result = result + randomSecureHex(length - maxlen);
    }

    return result;
};
