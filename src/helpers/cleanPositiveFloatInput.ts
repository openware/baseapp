export const cleanPositiveFloatInput = (text: string) => {
    let cleanInput = text
        .replace(',', '.')
        .replace(/-+/, '')
        .replace(/^0+/, '0')
        .replace(/\.+/, '.')
        .replace(/^0+([1-9])/, '$1');

    if (cleanInput[0] === '.') {
        cleanInput = `0${cleanInput}`;
    }
    return cleanInput;
};
