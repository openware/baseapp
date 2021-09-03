export const is2faValid = (code2FA: string) => code2FA.match('^[0-9]{6}$');
