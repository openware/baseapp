import * as helpers from './';

describe('Constants regexps', () => {
  it('should validate correct passwords', () => {
    expect('1azeRTY@'.match(helpers.PASSWORD_REGEX)).toBeTruthy();
    expect('1aze@RTY'.match(helpers.PASSWORD_REGEX)).toBeTruthy();
    expect('azeRTY@2'.match(helpers.PASSWORD_REGEX)).toBeTruthy();
    expect('azeRTY@222222222'.match(helpers.PASSWORD_REGEX)).toBeTruthy();
  });

  it('should validate correct passwords in non latin languages', () => {
    expect('йцукRTY@2'.match(helpers.PASSWORD_REGEX)).toBeTruthy();
    expect('azeЙЦУК@3'.match(helpers.PASSWORD_REGEX)).toBeTruthy();
  });

  it('should not validate incorrect passwords', () => {
    expect(''.match(helpers.PASSWORD_REGEX)).toBeNull();
    expect('1234568'.match(helpers.PASSWORD_REGEX)).toBeNull();
    expect('abcdegh'.match(helpers.PASSWORD_REGEX)).toBeNull();
    expect('ABCDFGH'.match(helpers.PASSWORD_REGEX)).toBeNull();
    expect('aaaBBBB'.match(helpers.PASSWORD_REGEX)).toBeNull();
    expect('aZ1@'.match(helpers.PASSWORD_REGEX)).toBeNull();
    expect('1az@RTY'.match(helpers.PASSWORD_REGEX)).toBeNull();
  });
});

describe('Helpers', () => {
    const wallet = {
        currency: 'btc',
        name: 'BTC',
        balance: 0,
        type: 'coin',
        fee: 0,
        fixed: 0,
    };

    const depositColors = {
        accepted: 'var(--color-green)',
        collected: 'var(--color-green)',
        submitted: '',
        canceled: 'var(--color-red)',
        rejected: 'var(--color-red)',
    };

    const withdrawColors = {
        prepared: '',
        submitted: '',
        canceled: 'var(--color-red)',
        accepted: 'var(--color-green)',
        suspected: '',
        rejected: 'var(--color-red)',
        processing: '',
        succeed: 'var(--color-green)',
        failed: 'var(--color-red)',
        confirming: '',
    };

    const tradesColors = {
        ask: {
            color: 'var(--color-red)',
            text: 'Sell',
        },
        bid: {
            color: 'var(--color-green)',
            text: 'Buy',
        },
    };

    const defaultTradeType = {
        color: '',
        text: '',
    };

    const tradesColorsMapping = {
        sell: {
            color: 'var(--color-red)',
        },
        buy: {
            color: 'var(--color-green)',
        },
    };

    const asks: string[][] = [
        ['0.6', '0.1'],
        ['0.8', '1'],
        ['0.99', '1'],
        ['0.96', '1'],
        ['0.75', '1'],
        ['0.98', '20'],
        ['0.7', '1'],
    ];

    const bids: string[][] = [
        ['0.5', '0.04'],
        ['0.48', '0.2'],
        ['0.27', '5'],
        ['0.28', '2'],
        ['0.47', '0.1'],
        ['0.3', '10'],
        ['0.26', '25'],
        ['0.49', '0.5'],
    ];

    const proposals: string[][] = [
        ['12', '20'],
        ['12.5', '11'],
        ['12.7', '5'],
        ['12.8', '13'],
        ['13', '50'],
        ['13.1', '10'],
    ];

    // emailValidation.js
    it('Rendering correct regular expression for email validation', () => {
        expect(helpers.EMAIL_REGEX).toEqual(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
    });

    // filterData.js
    it('Filter data should work correctly', () => {
        expect(helpers.handleFilter(wallet, '')).toBe(true);
        expect(helpers.handleFilter(wallet, 'b')).toBe(true);
        expect(helpers.handleFilter(wallet, 'bt')).toBe(true);
        expect(helpers.handleFilter(wallet, 'btc')).toBe(true);
        expect(helpers.handleFilter(wallet, 'c')).toBe(true);
    });

    // historyTableUtils.js
    it('Should render correct depositColorMapping, withdrawColorMapping and tradesColorMapping', () => {
        expect(helpers.depositColorMapping).toEqual(depositColors);
        expect(helpers.withdrawColorMapping).toEqual(withdrawColors);
        expect(helpers.tradesColorMapping).toEqual(tradesColors);
    });

    it('Should return correct deposit status color', () => {
        expect(helpers.setDepositStatusColor('accepted')).toEqual('var(--color-green)');
        expect(helpers.setDepositStatusColor('collected')).toEqual('var(--color-green)');
        expect(helpers.setDepositStatusColor('submitted')).toEqual('');
        expect(helpers.setDepositStatusColor('canceled')).toEqual('var(--color-red)');
        expect(helpers.setDepositStatusColor('rejected')).toEqual('var(--color-red)');
    });

    it('Should return correct withdraw status color', () => {
        expect(helpers.setWithdrawStatusColor('prepared')).toEqual('');
        expect(helpers.setWithdrawStatusColor('submitted')).toEqual('');
        expect(helpers.setWithdrawStatusColor('canceled')).toEqual('var(--color-red)');
        expect(helpers.setWithdrawStatusColor('accepted')).toEqual('var(--color-green)');
        expect(helpers.setWithdrawStatusColor('suspected')).toEqual('');
        expect(helpers.setWithdrawStatusColor('rejected')).toEqual('var(--color-red)');
        expect(helpers.setWithdrawStatusColor('processing')).toEqual('');
        expect(helpers.setWithdrawStatusColor('succeed')).toEqual('var(--color-green)');
        expect(helpers.setWithdrawStatusColor('failed')).toEqual('var(--color-red)');
        expect(helpers.setWithdrawStatusColor('confirming')).toEqual('');
    });

    it('Should return correct trade type', () => {
        expect(helpers.setTradesType('ask')).toEqual(tradesColors.ask);
        expect(helpers.setTradesType('bid')).toEqual(tradesColors.bid);
        expect(helpers.setTradesType('')).toEqual(defaultTradeType);
    });

    // localeDate.ts
    it('Should return correct locale date', () => {
        expect(helpers.localeDate('2018-11-29T16:54:46+01:00', 'Europe/Kiev')).toBe('29/11 17:54');
        expect(helpers.localeDate('2018-11-12T16:55:12-01:00', 'Europe/Kiev')).toBe('12/11 19:55');
    });

    // localeDateSec.ts
    it('Should return correct locale date with seconds', () => {
        expect(helpers.localeDateSec('2018-11-29T16:54:46+01:00', 'Europe/Kiev')).toBe('29/11 17:54:46');
        expect(helpers.localeDateSec('2018-11-12T16:55:12-01:00', 'Europe/Kiev')).toBe('12/11 19:55:12');
    });

    // localeFullDate.ts
    it('Should return correct locale full date', () => {
        expect(helpers.localeFullDate('2018-11-29T16:54:46+01:00', 'Europe/Kiev')).toBe('2018-29-11 17:54:46');
        expect(helpers.localeFullDate('2018-11-12T16:55:12-01:00', 'Europe/Kiev')).toBe('2018-12-11 19:55:12');
    });

    // preciseNumber.js
    it('Should return correctly precised numbers', () => {
        expect(helpers.preciseData(3.141592, 4)).toBe('3.1416');
        expect(helpers.preciseData(3.141592, 0)).toBe('3');
        expect(helpers.preciseData(3.141592, 8)).toBe('3.14159200');
        expect(helpers.preciseData(3.141592)).toBe('3');
    });

    // setTradeColor.ts
    it('Should return correct trade color', () => {
        expect(helpers.setTradeColor('buy')).toEqual(tradesColorsMapping.buy);
        expect(helpers.setTradeColor('sell')).toEqual(tradesColorsMapping.sell);
        expect(helpers.setTradeColor('')).toEqual({ color: ''});
    });

    // sliceString.ts
    it('Should correctly slice string', () => {
        expect(helpers.sliceString('some string', 3)).toEqual('som...');
        expect(helpers.sliceString('some string', 5)).toEqual('some ...');
        expect(helpers.sliceString('some string', 0)).toEqual('...');
    });

    // timezone.ts
    it('Should correctly set and get timezone', () => {
        helpers.setTimezone('Europe/Paris');
        expect(helpers.getTimezone()).toEqual('Europe/Paris');
    });

    // uppercase.js
    it('Should correctly convert to uppercase', () => {
        expect(helpers.uppercase('Helios')).toEqual('HELIOS');
        expect(helpers.uppercase('')).toEqual('');
        expect(helpers.uppercase(' ')).toEqual(' ');
    });

    // accumulateVolume.ts
    it('should accumulate volume of asks properly', () => {
        const expectedResult = [0.1, 1.1, 2.1, 3.1, 4.1, 24.1, 25.1];
        const result = helpers.accumulateVolume(asks);
        expect(result).toEqual(expectedResult);
    });

    // calcMaxVolume.ts
    it('sholud calculate max volume between asks and bids correctly', () => {
        const expectedMax = 42.84;
        const result = helpers.calcMaxVolume(asks, bids);
        expect(result).toEqual(expectedMax);
    });

    // sortByPrice.ts
    it('should sort ask ascendingly by price', () => {
        const sortedArray = [
            ['0.6', '0.1'],
            ['0.7', '1'],
            ['0.75', '1'],
            ['0.8', '1'],
            ['0.96', '1'],
            ['0.98', '20'],
            ['0.99', '1'],
        ];

        const result = helpers.sortAsks(asks);
        expect(result).toEqual(sortedArray);
    });

    it('should sort bids descendingly by price', () => {
        const sortedArray = [
            ['0.5', '0.04'],
            ['0.49', '0.5'],
            ['0.48', '0.2'],
            ['0.47', '0.1'],
            ['0.3', '10'],
            ['0.28', '2'],
            ['0.27', '5'],
            ['0.26', '25'],
        ];

        const result = helpers.sortBids(bids);
        expect(result).toEqual(sortedArray);
    });

    // getLanguageByCode.ts
    it('should return correct language name', () => {
        expect(helpers.getLanguageName('en')).toEqual('English');
        expect(helpers.getLanguageName('ru')).toEqual('Русский');
        expect(helpers.getLanguageName('asd')).toEqual('English');
    });

    // checkDate.ts
    it('should check current date', () => {
        expect(helpers.isDateInFuture('22/12/3333')).toEqual(true);
        expect(helpers.isDateInFuture('22/12/1333')).toEqual(false);
    });

    // getUrlPart.ts
    it('should extract a segment part of a url', () => {
        expect(helpers.getUrlPart(2, '/trading')).toEqual('');
        expect(helpers.getUrlPart(2, '/trading/')).toEqual('');
        expect(helpers.getUrlPart(2, '/trading/btcusd')).toEqual('btcusd');
        expect(helpers.getUrlPart(2, '/trading/BTCUSD')).toEqual('BTCUSD');
        expect(helpers.getUrlPart(2, '/trading/btcusd/something')).toEqual('btcusd');
        expect(helpers.getUrlPart(2, '/trading/btcusd#something')).toEqual('btcusd');
        expect(helpers.getUrlPart(2, '/trading/btcusd?something')).toEqual('btcusd');
    });

    // getTotalPrice.ts
    it('should return correct total price', () => {
        expect(helpers.getTotalPrice('0', [['0','0']])).toEqual(0);
        expect(helpers.getTotalPrice('2', [['0','0']])).toEqual(0);
        expect(helpers.getTotalPrice('0', [['2','10']])).toEqual(0);
        expect(helpers.getTotalPrice('2', [['2','10']])).toEqual(4);
        expect(helpers.getTotalPrice('10', proposals)).toEqual(120);
    });

    it('should return correct total price if amount more then orderBook amount', () => {
        expect(helpers.getTotalPrice('1000', proposals)).toEqual(13060.5);
    });

    it('should return correct total amount for percent', () => {
        expect(helpers.getAmount(1000, proposals, 0.25)).toEqual(20.8);
        expect(helpers.getAmount(500, proposals, 0.5)).toEqual(20.8);
        expect(helpers.getAmount(500, proposals, 0.75)).toEqual(30.8);
        expect(helpers.getAmount(1000, proposals, 1)).toEqual(79.2);
    });

    // capitalize.ts
    it('Should correctly convert to capitalized string', () => {
        expect(helpers.capitalize('helios')).toEqual('Helios');
        expect(helpers.capitalize('')).toEqual('');
        expect(helpers.capitalize(' ')).toEqual(' ');
    });

    //  timeConvert.js
    it('Should correctly convert date', () => {
        expect(helpers.dateTo12HFormat('2019-01-22T15:18:33.000Z')).toBe('Jan 22, 2019 3:18 PM');
        expect(helpers.dateTo12HFormat('2019-01-22T08:08:36.000Z')).toBe('Jan 22, 2019 8:08 AM');
    });

    it('Should correctly convert time', () => {
        expect(helpers.timeTo12HFormat('15:18:33')).toBe('3:18 PM');
        expect(helpers.timeTo12HFormat('08:08:36')).toBe('8:08 AM');
    });

    // checkDate.ts
    describe('monthNameToNumber', () => {
        it('return month number from name', () => {
            expect(helpers.monthNameToNumber('January')).toBe('01');
            expect(helpers.monthNameToNumber('February')).toBe('02');
            expect(helpers.monthNameToNumber('March')).toBe('03');
            expect(helpers.monthNameToNumber('April')).toBe('04');
            expect(helpers.monthNameToNumber('May')).toBe('05');
            expect(helpers.monthNameToNumber('June')).toBe('06');
            expect(helpers.monthNameToNumber('July')).toBe('07');
            expect(helpers.monthNameToNumber('August')).toBe('08');
            expect(helpers.monthNameToNumber('September')).toBe('09');
            expect(helpers.monthNameToNumber('October')).toBe('10');
            expect(helpers.monthNameToNumber('November')).toBe('11');
            expect(helpers.monthNameToNumber('December')).toBe('12');
        });
    });
});
