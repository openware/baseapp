const cryptoRegExps = {
    btc: '((tb1|[2nm]|bcrt)[a-zA-HJ-NP-Z0-9]{25,40})',
};

const buildRegExp = (bodyExp: string, exact?: boolean) =>
    exact ? new RegExp(`^(${bodyExp})$`) : new RegExp(`\\b(?:${bodyExp})\\b`, 'g');

const cryptoAddress = (cryptoCurrency, exact?: boolean) => {
    return buildRegExp(cryptoRegExps[cryptoCurrency], exact);
};

cryptoAddress.cryptocurrency = (cryptoCurrency, exact) => {
    if (cryptoRegExps.hasOwnProperty(cryptoCurrency)) {
        const bodyExp = cryptoRegExps[cryptoCurrency];

        return buildRegExp(bodyExp, exact);
    } else {
        // throw new Error('Unsupported cryptocurrency');

        //TODO: will need to add more supported testnet addresses later
        return buildRegExp('', false);
    }
};

export const validateBeneficiaryTestnetAddress = cryptoAddress;
