import { CURRENCIES_DT, CURRENCIES_MEMO } from 'src/constants';

export const requiresDTTag = (currency: string) => {
    return CURRENCIES_DT.includes(currency);
};

export const requiresMemoTag = (currency: string) => {
    return CURRENCIES_MEMO.includes(currency);
};

export const getTag = (value?: string) => {
    if (value && (value.includes('?dt=') || value.includes('?memo='))) {
        return value.substr(value.lastIndexOf('=') + 1);
    }

    return '-';
};

export const getAddressWithoutTag = (value?: string) => {
    if (value && (value.includes('?dt=') || value.includes('?memo='))) {
        return value.slice(0, value.lastIndexOf('?'));
    }

    return value;
};
