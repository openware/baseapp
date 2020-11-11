import { WalletItemProps } from '../screens/WalletsScreen/item';
import { Currency } from '../modules/public/currencies';
import { Market } from '../modules/public/markets';
import { estimateUnitValue, estimateValue, findPrecision, MarketTicker } from './estimateValue';

// tslint:disable no-object-literal-type-assertion
describe('estimateValue', () => {
    const currencies = [
        { id: 'eth', precision: 5 },
        { id: 'usd', precision: 4 },
        { id: 'btc', precision: 3 },
        { id: 'zar', precision: 8 },
    ] as Currency[];

    it('should return 0 if no data', () => {
        const targetCurrency = 'btc';
        const wallets = [] as WalletItemProps[];
        const markets = [] as Market[];
        const marketTickers = {} as MarketTicker;

        expect(estimateValue(targetCurrency, currencies, wallets, markets, marketTickers)).toEqual('0.000');
    });

    it('should return wallet total for target currency', () => {
        const targetCurrency = 'btc';
        const wallets = ([{ currency: 'btc', balance: '95.1001', locked: '10.1234' }] as unknown) as WalletItemProps[];
        const markets = [] as Market[];
        const marketTickers = {} as MarketTicker;

        expect(estimateValue(targetCurrency, currencies, wallets, markets, marketTickers)).toEqual('105.223');
    });

    it('should convert using market ask unit', () => {
        const targetCurrency = 'btc';
        const wallets = ([
            { currency: 'usd', balance: '903.0008', locked: '100.12345' },
        ] as unknown) as WalletItemProps[];
        const markets = [{ id: 'btcusd', name: 'BTC/USD', base_unit: 'btc', quote_unit: 'usd' }] as Market[];
        const marketTickers = ({ btcusd: { last: '1.0001' } } as unknown) as MarketTicker;

        expect(estimateValue(targetCurrency, currencies, wallets, markets, marketTickers)).toEqual('1003.023');
    });

    it('should convert using market bid unit', () => {
        const targetCurrency = 'btc';
        const wallets = ([
            { currency: 'usd', balance: '903.0008', locked: '100.12345' },
        ] as unknown) as WalletItemProps[];
        const markets = [{ id: 'usdbtc', name: 'USD/BTC', base_unit: 'usd', quote_unit: 'btc' }] as Market[];
        const marketTickers = ({ usdbtc: { last: '0.9999' } } as unknown) as MarketTicker;

        expect(estimateValue(targetCurrency, currencies, wallets, markets, marketTickers)).toEqual('1003.023');
    });

    it('should convert using secondary market #1', () => {
        const targetCurrency = 'btc';
        const wallets = ([{ currency: 'bch', balance: '900.0', locked: '100.0' }] as unknown) as WalletItemProps[];
        const markets = [
            { id: 'btczar', name: 'BTC/ZAR', base_unit: 'btc', quote_unit: 'zar' },
            { id: 'bchzar', name: 'BCH/ZAR', base_unit: 'bch', quote_unit: 'zar' },
        ] as Market[];
        const marketTickers = ({ btczar: { last: '0.1' }, bchzar: { last: '10' } } as unknown) as MarketTicker;

        expect(estimateValue(targetCurrency, currencies, wallets, markets, marketTickers)).toEqual('100000.000');
    });

    it('should convert using secondary market #2', () => {
        const targetCurrency = 'btc';
        const wallets = ([{ currency: 'bch', balance: '0.9', locked: '0.1' }] as unknown) as WalletItemProps[];
        const markets = [
            { id: 'btczar', name: 'BTC/ZAR', base_unit: 'btc', quote_unit: 'zar' },
            { id: 'bchzar', name: 'BCH/ZAR', base_unit: 'bch', quote_unit: 'zar' },
        ] as Market[];
        const marketTickers = ({ btczar: { last: '10' }, bchzar: { last: '10' } } as unknown) as MarketTicker;

        expect(estimateValue(targetCurrency, currencies, wallets, markets, marketTickers)).toEqual('1.000');
    });

    it('should convert using secondary market #3', () => {
        const targetCurrency = 'btc';
        const wallets = ([{ currency: 'bch', balance: '2.004', locked: '0.001' }] as unknown) as WalletItemProps[];
        const markets = [
            { id: 'btczar', name: 'BTC/ZAR', base_unit: 'btc', quote_unit: 'zar' },
            { id: 'bchzar', name: 'BCH/ZAR', base_unit: 'bch', quote_unit: 'zar' },
        ] as Market[];
        const marketTickers = ({ btczar: { last: '9.995' }, bchzar: { last: '5.005' } } as unknown) as MarketTicker;

        expect(estimateValue(targetCurrency, currencies, wallets, markets, marketTickers)).toEqual('1.004');
    });

    it('should NOT convert using tertiary market', () => {
        const targetCurrency = 'btc';
        const wallets = ([{ currency: 'bch', balance: '1.9', locked: '0.1' }] as unknown) as WalletItemProps[];
        const markets = [
            { id: 'btczar', name: 'BTC/ZAR', base_unit: 'btc', quote_unit: 'zar' },
            { id: 'ltczar', name: 'LTC/ZAR', base_unit: 'ltc', quote_unit: 'zar' },
            { id: 'bchltc', name: 'BCH/LTC', base_unit: 'bch', quote_unit: 'ltc' },
        ] as Market[];
        const marketTickers = ({
            btczar: { last: '1' },
            ltczar: { last: '1' },
            bchltc: { last: '1' },
        } as unknown) as MarketTicker;

        expect(estimateValue(targetCurrency, currencies, wallets, markets, marketTickers)).toEqual('0.000');
    });

    it('should convert single value', () => {
        const targetCurrency = 'btc';
        const currentCurrency = 'bch';
        const total = 1;
        const markets = [
            { id: 'btczar', name: 'BTC/ZAR', base_unit: 'btc', quote_unit: 'zar' },
            { id: 'bchzar', name: 'BCH/ZAR', base_unit: 'bch', quote_unit: 'zar' },
        ] as Market[];
        const marketTickers = ({
            btczar: { last: '0.1' },
            bchzar: { last: '0.2' },
        } as unknown) as MarketTicker;

        expect(estimateUnitValue(targetCurrency, currentCurrency, total, currencies, markets, marketTickers)).toEqual(
            '2.000'
        );
    });

    it('should convert with small ticker value', () => {
        const targetCurrency = 'btc';
        const currentCurrency = 'bch';
        const total = 1;
        const markets = [
            { id: 'btczar', name: 'BTC/ZAR', base_unit: 'btc', quote_unit: 'zar' },
            { id: 'bchzar', name: 'BCH/ZAR', base_unit: 'bch', quote_unit: 'zar' },
        ] as Market[];
        const marketTickers = ({
            btczar: { last: '0.00000001' },
            bchzar: { last: '0.00000002' },
        } as unknown) as MarketTicker;

        expect(estimateUnitValue(targetCurrency, currentCurrency, total, currencies, markets, marketTickers)).toEqual(
            '2.000'
        );
    });

    it('should convert from small value', () => {
        const targetCurrency = 'btc';
        const currentCurrency = 'bch';
        const total = 0.00000001;
        const markets = [
            { id: 'btczar', name: 'BTC/ZAR', base_unit: 'btc', quote_unit: 'zar' },
            { id: 'bchzar', name: 'BCH/ZAR', base_unit: 'bch', quote_unit: 'zar' },
        ] as Market[];
        const marketTickers = ({
            btczar: { last: '0.0001' },
            bchzar: { last: '20' },
        } as unknown) as MarketTicker;

        expect(estimateUnitValue(targetCurrency, currentCurrency, total, currencies, markets, marketTickers)).toEqual(
            '0.002'
        );
    });

    it('should convert to small value', () => {
        const targetCurrency = 'zar';
        const currentCurrency = 'btc';
        const total = 1;
        const markets = [{ id: 'btczar', name: 'BTC/ZAR', base_unit: 'btc', quote_unit: 'zar' }] as Market[];
        const marketTickers = ({
            btczar: { last: '0.00000001' },
        } as unknown) as MarketTicker;

        expect(estimateUnitValue(targetCurrency, currentCurrency, total, currencies, markets, marketTickers)).toEqual(
            '0.00000001'
        );
    });

    it('should find precision using market ask unit', () => {
        const unit = 'btc';
        const markets = [
            { id: 'btczar', name: 'BTC/ZAR', base_unit: 'btc', quote_unit: 'zar', amount_precision: 3 },
        ] as Market[];

        expect(findPrecision(unit, markets)).toEqual(3);
    });

    it('should find precision using market bid unit', () => {
        const unit = 'btc';
        const markets = [
            { id: 'zarbtc', name: 'ZAR/BTC', base_unit: 'zar', quote_unit: 'btc', price_precision: 5 },
        ] as Market[];

        expect(findPrecision(unit, markets)).toEqual(5);
    });

    it('should return 4 as a default precision', () => {
        const unit = 'btc';
        const markets = [] as Market[];

        expect(findPrecision(unit, markets)).toEqual(4);
    });
});
