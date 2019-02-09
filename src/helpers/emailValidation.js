export const ERROR_EMPTY_PASSWORD = 'Password is invalid';
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/u;
export const EMAIL_REGEX = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
export const ERROR_INVALID_PASSWORD = 'Password must contain at least 8 symbols, at least one capital letter and a digit';
export const ERROR_INVALID_EMAIL = 'Email is invalid';
export const ERROR_PASSWORD_CONFIRMATION = 'Passwords don\'t match';
