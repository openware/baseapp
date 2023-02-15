/* eslint-disable */
export const PASSWORD_REGEX = /^(?=.{8,})/;
export const EMAIL_REGEX =
    /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
export const ERROR_INVALID_PASSWORD = 'page.header.signUp.password.message.error';
export const ERROR_INVALID_EMAIL = 'page.header.signUp.email.message.error';
export const ERROR_PASSWORD_CONFIRMATION = 'page.header.signUp.confirmPassword.message.error';
export const ERROR_EMPTY_PASSWORD = 'page.header.signIn.password.message.error';

export const DOMAIN_REGEX =
    /^(?:(?:(?:[a-zA-z\-]+)\:\/\/{1,3})(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/;
export const EXCHANGE_NAME_REGEX = /^[0-9A-Za-z]*$/;
