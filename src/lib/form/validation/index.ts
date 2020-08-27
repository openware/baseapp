import { format } from 'react-string-format';

import { LocalizationContainer } from 'src/units/localization/interfaces';

const required = (l: LocalizationContainer) => (value: React.ReactText): string => {
    if (Array.isArray(value)) {
        return value.length > 0 ? undefined : l.form.validation.required;
    }

    // if (typeof value === 'number') {
    //     // can be 0
    //     return undefined;
    // }

    return value ? undefined : l.form.validation.required;
};

const maxLength = (l: LocalizationContainer, max: number) => (value: string): string => {
    return value && value.length > max ? (format(l.form.validation.maxLength, max) as string) : undefined;
};

const minLength = (l: LocalizationContainer, min: number) => (value: string): string => {
    return value && value.length < min ? (format(l.form.validation.minLength, min) as string) : undefined;
};

const onlyNumber = (l: LocalizationContainer) => (value: string): string => {
    return value && isNaN(Number(value)) ? l.form.validation.number : undefined;
};

const email = (l: LocalizationContainer) => (value: string): string => {
    return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? l.form.validation.email : undefined;
};

const length = (l: LocalizationContainer, len: number) => (value: string): string => {
    return value && value.length !== len ? (format(l.form.validation.length, len) as string) : undefined;
};

const passwordsMustMatch = (l: LocalizationContainer) => (value: string, allValues: any): string | null =>
    value !== allValues.password ? l.form.validation.passwordMatch : null;

export { required, maxLength, minLength, onlyNumber, email, length, passwordsMustMatch };
