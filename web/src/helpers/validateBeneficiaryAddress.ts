const cryptoRegExps = {
    btc: '([13][a-km-zA-HJ-NP-Z1-9]{25,34})|((?=bc1[a-km-zA-HJ-NP-Z1-9]*)(?:.{42}|.{62}))',
    eth: '0x[a-fA-F0-9]{40}',
    etc: '0x[a-fA-F0-9]{40}',
    bch: '((bitcoincash|bchreg|bchtest):)?(q|p)[a-z0-9]{41}',
    xrp: 'r[0-9a-zA-Z]{24,34}?.{1,}',
    dash: 'X[1-9A-HJ-NP-Za-km-z]{33}',
    ltc: '(ltc1|[LM])[a-zA-HJ-NP-Z0-9]{26,40}',
    eos: '[0-9a-zA-Z]{12}?.{1,}',
    bnb: '(bnb)[a-z0-9]?.{1,}',
    doge: 'D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}',
    // qtum: '',
    // iota: '',
    zec: '(zs|zc|t)[a-zA-Z0-9]{1,}',
    dot: '(1)[a-zA-Z0-9]{1,}',
    // zrx: '',
    // algo: '',
    // tron: '',
    // xlm: '',
    // btg: '',
    // ark: '',
    // nxt: '',
    neo: 'A[0-9a-zA-Z]{33}',
    // xrm: '',
    // nem: '',
    // sia: '',
    // ardor: '',
    // ada: '',
    // telos: '',
    // atom: '',
    xmr: '4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}',
};

const chainTokens = {
    eth: [
        'usdt',
        'bnb',
        'mesg',
        'und',
        'bdp',
        'taas',
    ],
};

const buildRegExp = (bodyExp: string, exact?: boolean) =>
    exact ? new RegExp(`^(${bodyExp})$`) : new RegExp(`\\b(?:${bodyExp})\\b`, 'g');

const cryptoAddress = (cryptoCurrency, exact?: boolean) => {
    return buildRegExp(cryptoRegExps[cryptoCurrency], exact);
};

const chainTokenMap = (tokenName: string) => {
    for (const [chain, tokens] of Object.entries(chainTokens)) {
        if (tokens.includes(tokenName)) {
            return chain;
        }
    }

    return '';
};

cryptoAddress.cryptocurrency = (cryptoCurrency, exact) => {
    if (cryptoRegExps.hasOwnProperty(cryptoCurrency)) {
        const bodyExp = cryptoRegExps[cryptoCurrency];

        return buildRegExp(bodyExp, exact);
    } else if (chainTokenMap(cryptoCurrency)) {
        const bodyExp = cryptoRegExps[chainTokenMap(cryptoCurrency)];

        return buildRegExp(bodyExp, exact);
    } else {
        // throw new Error('Unsupported cryptocurrency');

        //TODO: will need to add more supported crypto coin later
        return buildRegExp('', false);
    }
};

export const validateBeneficiaryAddress = cryptoAddress;



