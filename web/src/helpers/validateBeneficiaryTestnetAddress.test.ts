import { validateBeneficiaryTestnetAddress } from './validateBeneficiaryTestnetAddress';

describe('Testnet Beneficiary Address Validaity Test', () => {
    it('should pass TestNet BTC address', () => {
        const coinAddressValidator = validateBeneficiaryTestnetAddress.cryptocurrency('btc', true);
        expect(coinAddressValidator.test('tb1qnjf0v63jyryrkqdml29f2hdz9m0n6l5ypkq7x5m')).toBeTruthy();
        expect(coinAddressValidator.test('2MyhTqkLXs4K9PhRN4HeRuZJNZTYYCvJpNw')).toBeTruthy();
        expect(coinAddressValidator.test('mkkJGguo6Yu3oh1RMGxJF5JDmU58Tew5jy')).toBeTruthy();
        expect(coinAddressValidator.test('2N4Sworbnqv1Ug4fnmukBeAqWPMx8nNNwHH')).toBeTruthy();
        expect(coinAddressValidator.test('mfWxJ45yp2SFn7UciZyNpvDKrzbhyfKrY8')).toBeTruthy();
    });
});

describe('Address with Wrong Format Test', () => {
    it('should not pass wrong BTC address', () => {
        const coinAddressValidator = validateBeneficiaryTestnetAddress.cryptocurrency('btc', true);
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX ')).toBeFalsy();
        expect(coinAddressValidator.test(' 18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX ')).toBeFalsy();
        expect(coinAddressValidator.test(' 18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX .')).toBeFalsy();
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX.')).toBeFalsy();
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX+')).toBeFalsy();
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX-')).toBeFalsy();
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX/')).toBeFalsy();
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX,')).toBeFalsy();
        expect(coinAddressValidator.test('+18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX')).toBeFalsy();
    });

    it('should not pass MainNet BTC address', () => {
        const coinAddressValidator = validateBeneficiaryTestnetAddress.cryptocurrency('btc', true);
        expect(coinAddressValidator.test('17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem')).toBeFalsy();
        expect(coinAddressValidator.test('38T68JavN2m1VHodiNsBq9vj8v5zA6QEsa')).toBeFalsy();
        expect(coinAddressValidator.test('bc1qtql9qte2350ftjl5gfalplqg69e5efr9cd0v8nh06a7hvs7s5u9snsd38g')).toBeFalsy();
        expect(coinAddressValidator.test('3Eb56XPpL3nh8Jjx2KGrYm1qob2Rz14p13')).toBeFalsy();
        expect(coinAddressValidator.test('1qKBM6soCLKDe7mC6Vee6hJcBM45jB6kS')).toBeFalsy();
    });
});

describe('Unsported Coin', () => {
    it('should detect unsupported coin XXX', () => {
        const coinAddressValidator = validateBeneficiaryTestnetAddress.cryptocurrency('xxx', true);
        expect(coinAddressValidator.test('XyzXXyyzZ')).toBeTruthy();
    });
});

describe('Not Exact Match Test', () => {
    it('validate not exact match address', () => {
        const coinAddressValidator = validateBeneficiaryTestnetAddress.cryptocurrency('btc', false);
        expect(coinAddressValidator.test('tb1qnjf0v63jyryrkqdml29f2hdz9m0n6l5ypkq7x5m 2MyhTqkLXs4K9PhRN4HeRuZJNZTYYCvJpNw')).toBeTruthy();
        expect(coinAddressValidator.test(`
            mfWxJ45yp2SFn7UciZyNpvDKrzbhyfKrY8
            mkkJGguo6Yu3oh1RMGxJF5JDmU58Tew5jy
        `)).toBeTruthy();
    });
});
