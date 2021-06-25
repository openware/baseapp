import { validateBeneficiaryAddress } from './validateBeneficiaryAddress';

describe('Beneficiary Address Validaity Test', () => {
    it('should pass BTC address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('btc', true);
        expect(coinAddressValidator.test('17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem')).toBeTruthy();
        expect(coinAddressValidator.test('38T68JavN2m1VHodiNsBq9vj8v5zA6QEsa')).toBeTruthy();
    });

    it('should pass BCH address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('bch', true);
        expect(coinAddressValidator.test('bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq')).toBeTruthy();
    });

    it('should pass ETH address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('eth', true);
        expect(coinAddressValidator.test('0x5dd46451d2cBD8103E649BC18742eb727D52A87A')).toBeTruthy();
    });

    it('should pass USDT address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('usdt', true);
        expect(coinAddressValidator.test('0x5dd46451d2cBD8103E649BC18742eb727D52A87A')).toBeTruthy();
    });

    it('should pass BNB address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('bnb', true);
        expect(coinAddressValidator.test('0x5dd46451d2cBD8103E649BC18742eb727D52A87A')).toBeTruthy();
    });

    it('should pass LTC address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('ltc', true);
        expect(coinAddressValidator.test('LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx')).toBeTruthy();
        expect(coinAddressValidator.test('M9ERwAZTwLEiWVtPkDYBNXFinmYXxHDcYL')).toBeTruthy();
    });

    it('should pass DASH address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('dash', true);
        expect(coinAddressValidator.test('XazKNoxZ7SF78i9VaMtJMPU5Ft91Y8HhiQ')).toBeTruthy();
    });

    it('should pass DOGE address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('doge', true);
        expect(coinAddressValidator.test('DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o')).toBeTruthy();
    });

    it('should pass XRP address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('xrp', true);
        expect(coinAddressValidator.test('rKLpjpCoXgLQQYQyj13zgay73rsgmzNH13')).toBeTruthy();
    });

    it('should pass XRP address with dt', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('xrp', true);
        expect(coinAddressValidator.test('rKLpjpCoXgLQQYQyj13zgay73rsgmzNH13?dt=108224924')).toBeTruthy();
    });

    it('should pass XMR address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('xmr', true);
        expect(coinAddressValidator.test('48xDQZ2VLBRDHNCncLJf4pNVQ2m5zTBayZq61uFuj5LEAkhC89TNU77Fs3cdNZRaMEXk9nh1VKpUc1hgND43itYAKGjqHNi')).toBeTruthy();
    });

    it('should pass NEO address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('neo', true);
        expect(coinAddressValidator.test('Ac2qG33i9Ppu6nyy5FAYNsYgEmwasRv9Vp')).toBeTruthy();
    });
});

describe('Wrong Address Format Test', () => {
    it('should not pass wrong BTC address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('btc', true);
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX ')).toBeFalsy();
        expect(coinAddressValidator.test(' 18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX ')).toBeFalsy();
        expect(coinAddressValidator.test(' 18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX .')).toBeFalsy();
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX.')).toBeFalsy();
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX+')).toBeFalsy();
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX-')).toBeFalsy();
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX/')).toBeFalsy();
        expect(coinAddressValidator.test('18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX,')).toBeFalsy();
        expect(coinAddressValidator.test('+18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX')).toBeFalsy();
        expect(coinAddressValidator.test('2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc')).toBeFalsy();
    });

    it('should not pass wrong BCH address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('bch', true);
        expect(coinAddressValidator.test('bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq ')).toBeFalsy();
        expect(coinAddressValidator.test('bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq.')).toBeFalsy();
        expect(coinAddressValidator.test(' bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq.')).toBeFalsy();
        expect(coinAddressValidator.test(' bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq')).toBeFalsy();
        expect(coinAddressValidator.test('+bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq')).toBeFalsy();
        expect(coinAddressValidator.test('-bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq')).toBeFalsy();
        expect(coinAddressValidator.test('bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq,')).toBeFalsy();
        expect(coinAddressValidator.test(',bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq')).toBeFalsy();
        expect(coinAddressValidator.test('bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq/')).toBeFalsy();
    });

    it('should not pass wrong ETH address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('eth', true);
        expect(coinAddressValidator.test(' 0x5dd46451d2cBD8103E649BC18742eb727D52A87A')).toBeFalsy();
        expect(coinAddressValidator.test(' 0x5dd46451d2cBD8103E649BC18742eb727D52A87A ')).toBeFalsy();
        expect(coinAddressValidator.test('0x5dd46451d2cBD8103E649BC18742eb727D52A87A ')).toBeFalsy();
        expect(coinAddressValidator.test('0x5dd46451d2cBD8103E649BC18742eb727D52A87A/')).toBeFalsy();
        expect(coinAddressValidator.test('0x5dd46451d2cBD8103E649BC18742eb727D52A87A+')).toBeFalsy();
        expect(coinAddressValidator.test('0x5dd46451d2cBD8103E649BC18742eb727D52A87A-')).toBeFalsy();
        expect(coinAddressValidator.test('0x5dd46451d2cBD8103E649BC18742eb727D52A87A,')).toBeFalsy();
        expect(coinAddressValidator.test(',0x5dd46451d2cBD8103E649BC18742eb727D52A87A')).toBeFalsy();
        expect(coinAddressValidator.test('+0x5dd46451d2cBD8103E649BC18742eb727D52A87A')).toBeFalsy();
    });

    it('should not pass wrong LTC address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('ltc', true);
        expect(coinAddressValidator.test(' LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx)')).toBeFalsy();
        expect(coinAddressValidator.test('LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx ')).toBeFalsy();
        expect(coinAddressValidator.test('(LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx . ')).toBeFalsy();
        expect(coinAddressValidator.test('(LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx)')).toBeFalsy();
        expect(coinAddressValidator.test('+LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx')).toBeFalsy();
        expect(coinAddressValidator.test('LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx-')).toBeFalsy();
        expect(coinAddressValidator.test('LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx_')).toBeFalsy();
        expect(coinAddressValidator.test('LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx,')).toBeFalsy();
        expect(coinAddressValidator.test('LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx<')).toBeFalsy();
    });

    it('should not pass wrong DASH address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('dash', true);
        expect(coinAddressValidator.test('XazKNoxZ7SF78i9VaMtJMPU5 Ft91Y8HhiQ')).toBeFalsy();
        expect(coinAddressValidator.test('XazKNoxZ7SF78i9VaMtJMPU5Ft91Y8HhiQ ')).toBeFalsy();
        expect(coinAddressValidator.test(' XazKNoxZ7SF78i9VaMtJMPU5Ft91Y8HhiQ')).toBeFalsy();
        expect(coinAddressValidator.test('XazKNoxZ7SF78i9VaMtJMPU5Ft91Y8HhiQ.')).toBeFalsy();
        expect(coinAddressValidator.test('XazKNoxZ7SF78i9VaMtJMPU5Ft91Y8HhiQ+')).toBeFalsy();
        expect(coinAddressValidator.test('XazKNoxZ7SF78i9VaMtJMPU5Ft91Y8HhiQ-')).toBeFalsy();
        expect(coinAddressValidator.test('XazKNoxZ7SF78i9VaMtJMPU5Ft91Y8HhiQ/')).toBeFalsy();
        expect(coinAddressValidator.test('XazKNoxZ7SF78i9VaMtJMPU5Ft91Y8HhiQ:')).toBeFalsy();
        expect(coinAddressValidator.test('XazKNoxZ7SF78i9VaMtJMPU5Ft91Y8HhiQ_')).toBeFalsy();
    });

    it('should not pass wrong DOGE address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('doge', true);
        expect(coinAddressValidator.test('DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o ')).toBeFalsy();
        expect(coinAddressValidator.test(' DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o')).toBeFalsy();
        expect(coinAddressValidator.test('DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o.')).toBeFalsy();
        expect(coinAddressValidator.test('DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o .')).toBeFalsy();
        expect(coinAddressValidator.test('+DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o')).toBeFalsy();
        expect(coinAddressValidator.test('-DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o')).toBeFalsy();
        expect(coinAddressValidator.test('/DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o')).toBeFalsy();
        expect(coinAddressValidator.test(',DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o')).toBeFalsy();
        expect(coinAddressValidator.test('DANHz6EQVoWyZ9r+ER56DwTXHWUxfkv9k2o')).toBeFalsy();
        expect(coinAddressValidator.test('DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o+')).toBeFalsy();
        expect(coinAddressValidator.test('DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o,')).toBeFalsy();
        expect(coinAddressValidator.test('DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2+')).toBeFalsy();
        expect(coinAddressValidator.test('DANHz6EQVoWyZ9rER56DwTXHWUxfkv9k2o]')).toBeFalsy();
    });

    it('should not pass wrong XMR address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('xmr', true);
        expect(coinAddressValidator.test('48xDQZ2VLBRDHNCncLJf4pNVQ2m5zTBayZq61uFuj5LEAkhC89TNU77Fs3cdNZRaMEXk9nh1VKpUc1hgND43itYAKGjqHNi ')).toBeFalsy();
        expect(coinAddressValidator.test(' 48xDQZ2VLBRDHNCncLJf4pNVQ2m5zTBayZq61uFuj5LEAkhC89TNU77Fs3cdNZRaMEXk9nh1VKpUc1hgND43itYAKGjqHNi')).toBeFalsy();
        expect(coinAddressValidator.test('48xDQZ2VLBRDHNCncLJf4pNVQ2m5zTBayZq61uFuj5LEAkhC89TNU77Fs3cdNZRaMEXk9nh1VKpUc1hgND43itYAKGjqHNi .')).toBeFalsy();
        expect(coinAddressValidator.test('48xDQZ2VLBRDHNCncLJf4pNVQ2m5zTBayZq61uFuj5LEAkhC89TNU77Fs3cdNZRaMEXk9nh1VKpUc1hgND43itYAKGjqHNi  ')).toBeFalsy();
        expect(coinAddressValidator.test('#48xDQZ2VLBRDHNCncLJf4pNVQ2m5zTBayZq61uFuj5LEAkhC89TNU77Fs3cdNZRaMEXk9nh1VKpUc1hgND43itYAKGjqHNi')).toBeFalsy();
        expect(coinAddressValidator.test('+48xDQZ2VLBRDHNCncLJf4pNVQ2m5zTBayZq61uFuj5LEAkhC89TNU77Fs3cdNZRaMEXk9nh1VKpUc1hgND43itYAKGjqHNi')).toBeFalsy();
        expect(coinAddressValidator.test('-48xDQZ2VLBRDHNCncLJf4pNVQ2m5zTBayZq61uFuj5LEAkhC89TNU77Fs3cdNZRaMEXk9nh1VKpUc1hgND43itYAKGjqHNi')).toBeFalsy();
        expect(coinAddressValidator.test('_48xDQZ2VLBRDHNCncLJf4pNVQ2m5zTBayZq61uFuj5LEAkhC89TNU77Fs3cdNZRaMEXk9nh1VKpUc1hgND43itYAKGjqHNi')).toBeFalsy();
        expect(coinAddressValidator.test('/48xDQZ2VLBRDHNCncLJf4pNVQ2m5zTBayZq61uFuj5LEAkhC89TNU77Fs3cdNZRaMEXk9nh1VKpUc1hgND43itYAKGjqHNi')).toBeFalsy();
    });

    it('should not pass wrong NEO address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('neo', true);
        expect(coinAddressValidator.test('Ac2qG33i9Ppu6nyy5FAYNsYgEmwasRv9Vp ')).toBeFalsy();
        expect(coinAddressValidator.test(' Ac2qG33i9Ppu6nyy5FAYNsYgEmwasRv9Vp')).toBeFalsy();
        expect(coinAddressValidator.test('Ac2qG33i9Ppu6nyy5FAYNsYgEmwasRv9Vp.')).toBeFalsy();
        expect(coinAddressValidator.test('Ac2qG33i9Ppu6nyy5FAYNsYgEmwasRv9Vp .')).toBeFalsy();
        expect(coinAddressValidator.test('Ac2qG33i9Ppu6nyy5FAYNsYgEmwasRv9Vp+')).toBeFalsy();
        expect(coinAddressValidator.test('Ac2qG33i9Ppu6nyy5FAYNsYgEmwasRv9Vp-')).toBeFalsy();
        expect(coinAddressValidator.test('Ac2qG33i9Ppu6nyy5FAYNsYgEmwasRv9Vp/')).toBeFalsy();
        expect(coinAddressValidator.test('Ac2qG33i9Ppu6nyy5FAYNsYgEmwasRv9Vp_')).toBeFalsy();
        expect(coinAddressValidator.test('-Ac2qG33i9Ppu6nyy5FAYNsYgEmwasRv9Vp')).toBeFalsy();
    });
});

describe('unsupported coin', () => {
    it('should detect unsupported coin XXX', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('xxx', true);
        expect(coinAddressValidator.test('XyzXXyyzZ')).toBeTruthy();
    });
});

describe('Not exact match', () => {
    it('validate not exact match address', () => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency('btc', false);
        expect(coinAddressValidator.test('38T68JavN2m1VHodiNsBq9vj8v5zA6QEsa 18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX')).toBeTruthy();
        expect(coinAddressValidator.test(`
            38T68JavN2m1VHodiNsBq9vj8v5zA6QEsa
            18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX
        `)).toBeTruthy();
    });
});
