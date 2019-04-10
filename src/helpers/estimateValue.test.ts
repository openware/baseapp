import { WalletItemProps } from '../components/WalletItem';
import { Market } from '../modules/public/markets';
import { estimateValue, findPrecision, MarketTicker } from './estimateValue';

// tslint:disable no-object-literal-type-assertion
describe('estimateValue', () => {
    it('should return 0 if no data', () => {
        const targetCurrency = 'btc';
        const wallets = [] as WalletItemProps[];
        const markets = [] as Market[];
        const marketTickers = {} as MarketTicker;

        expect(estimateValue(targetCurrency, wallets, markets, marketTickers)).toEqual(0);
    });

    it('should return wallet total for target currency', () => {
        const targetCurrency = 'btc';
        const wallets = [{currency: 'btc', balance: '90', locked: '10.0'}] as unknown as WalletItemProps[];
        const markets = [] as Market[];
        const marketTickers = {} as MarketTicker;

        expect(estimateValue(targetCurrency, wallets, markets, marketTickers)).toEqual(100);
    });

    it('should convert using market ask unit', () => {
        const targetCurrency = 'btc';
        const wallets = [{currency: 'usd', balance: '900.0', locked: '100.0'}] as unknown as WalletItemProps[];
        const markets = [{id: 'btcusd', name: 'BTC/USD', ask_unit: 'btc', bid_unit: 'usd'}] as Market[];
        const marketTickers = {btcusd: {last: '1000'}} as unknown as MarketTicker;

        expect(estimateValue(targetCurrency, wallets, markets, marketTickers)).toEqual(1);
    });

    it('should convert using market bid unit', () => {
        const targetCurrency = 'btc';
        const wallets = [{currency: 'usd', balance: '900.0', locked: '100.0'}] as unknown as WalletItemProps[];
        const markets = [{id: 'usdbtc', name: 'USD/BTC', ask_unit: 'usd', bid_unit: 'btc'}] as Market[];
        const marketTickers = {usdbtc: {last: '0.001'}} as unknown as MarketTicker;

        expect(estimateValue(targetCurrency, wallets, markets, marketTickers)).toEqual(1);
    });

    it('should convert using secondary market #1', () => {
        const targetCurrency = 'btc';
        const wallets = [{currency: 'bch', balance: '900.0', locked: '100.0'}] as unknown as WalletItemProps[];
        const markets = [
            {id: 'btczar', name: 'BTC/ZAR', ask_unit: 'btc', bid_unit: 'zar'},
            {id: 'bchzar', name: 'BCH/ZAR', ask_unit: 'bch', bid_unit: 'zar'},
        ] as Market[];
        const marketTickers = {btczar: {last: '1'}, bchzar: {last: '1'}} as unknown as MarketTicker;

        expect(estimateValue(targetCurrency, wallets, markets, marketTickers)).toEqual(1000);
    });

    it('should convert using secondary market #2', () => {
        const targetCurrency = 'btc';
        const wallets = [{currency: 'bch', balance: '0.9', locked: '0.1'}] as unknown as WalletItemProps[];
        const markets = [
            {id: 'btczar', name: 'BTC/ZAR', ask_unit: 'btc', bid_unit: 'zar'},
            {id: 'bchzar', name: 'BCH/ZAR', ask_unit: 'bch', bid_unit: 'zar'},
        ] as Market[];
        const marketTickers = {btczar: {last: '10'}, bchzar: {last: '10'}} as unknown as MarketTicker;

        expect(estimateValue(targetCurrency, wallets, markets, marketTickers)).toEqual(1);
    });

    it('should convert using secondary market #3', () => {
        const targetCurrency = 'btc';
        const wallets = [{currency: 'bch', balance: '1.9', locked: '0.1'}] as unknown as WalletItemProps[];
        const markets = [
            {id: 'btczar', name: 'BTC/ZAR', ask_unit: 'btc', bid_unit: 'zar'},
            {id: 'bchzar', name: 'BCH/ZAR', ask_unit: 'bch', bid_unit: 'zar'},
        ] as Market[];
        const marketTickers = {btczar: {last: '10'}, bchzar: {last: '5'}} as unknown as MarketTicker;

        expect(estimateValue(targetCurrency, wallets, markets, marketTickers)).toEqual(1);
    });

    it('should NOT convert using tertiary market', () => {
        const targetCurrency = 'btc';
        const wallets = [{currency: 'bch', balance: '1.9', locked: '0.1'}] as unknown as WalletItemProps[];
        const markets = [
            {id: 'btczar', name: 'BTC/ZAR', ask_unit: 'btc', bid_unit: 'zar'},
            {id: 'ltczar', name: 'LTC/ZAR', ask_unit: 'ltc', bid_unit: 'zar'},
            {id: 'bchltc', name: 'BCH/LTC', ask_unit: 'bch', bid_unit: 'ltc'},
        ] as Market[];
        const marketTickers = {
            btczar: {last: '1'},
            ltczar: {last: '1'},
            bchltc: {last: '1'},
        } as unknown as MarketTicker;

        expect(estimateValue(targetCurrency, wallets, markets, marketTickers)).toEqual(0);
    });

    it('should find precision using market ask unit', () => {
        const unit = 'btc';
        const markets = [
            {id: 'btczar', name: 'BTC/ZAR', ask_unit: 'btc', bid_unit: 'zar', ask_precision: 3},
        ] as Market[];

        expect(findPrecision(unit, markets)).toEqual(3);
    });

    it('should find precision using market bid unit', () => {
        const unit = 'btc';
        const markets = [
            {id: 'zarbtc', name: 'ZAR/BTC', ask_unit: 'zar', bid_unit: 'btc', bid_precision: 5},
        ] as Market[];

        expect(findPrecision(unit, markets)).toEqual(5);
    });

    it('should return 4 as a default precision', () => {
        const unit = 'btc';
        const markets = [] as Market[];

        expect(findPrecision(unit, markets)).toEqual(4);
    });
});
