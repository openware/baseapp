import { Cryptobase, defaultConfig } from '../../../api';
import { DEFAULT_TRADING_VIEW_INTERVAL } from '../../../constants';
import { Market, Ticker, TickerEvent } from '../markets';
import {
    formatTicker,
    generateSocketURI,
    marketKlineStreams,
    periodMinutesToString,
    periodStringToMinutes,
    streamsBuilder,
} from './helpers';

describe('ranger helpers', () => {
    describe('generateSocketURI', () => {
        it('build docker URI with streams', () => {
            expect(generateSocketURI('ws://example.com/public', ['aaa', 'bbb'])).toEqual(
                'ws://example.com/public/?stream=aaa&stream=bbb'
            );
        });
    });

    describe('formatTicker', () => {
        const tickerEvents: { [pair: string]: TickerEvent } = {
            ethzar: {
                amount: '4.0',
                name: 'ETH/ZAR',
                base_unit: 'eth',
                quote_unit: 'zar',
                low: '0.001',
                high: '0.145',
                last: '0.134',
                open: 0.134,
                volume: '8.0',
                at: 1547625102601,
                avg_price: '69.5',
                price_change_percent: '+10.05%',
            },
            xrpbtc: {
                amount: '3.3',
                name: 'XRP/BTC',
                base_unit: 'xrp',
                quote_unit: 'btc',
                low: '0.001',
                high: '0.145',
                last: '0.134',
                open: 0.134,
                volume: '9.0',
                at: 1547625102601,
                avg_price: '69.5',
                price_change_percent: '+10.05%',
            },
            ltcbtc: {
                amount: '5.0',
                name: 'LTC/BTC',
                base_unit: 'ltc',
                quote_unit: 'btc',
                low: '0.001',
                high: '0.145',
                last: '0.134',
                open: 0.134,
                volume: '10.0',
                at: 1547625102601,
                avg_price: '69.5',
                price_change_percent: '+10.05%',
            },
        };
        const tickers: { [pair: string]: Ticker } = {
            ethzar: {
                amount: '4.0',
                low: '0.001',
                high: '0.145',
                last: '0.134',
                open: 0.134,
                volume: '8.0',
                avg_price: '69.5',
                price_change_percent: '+10.05%',
            },
            xrpbtc: {
                amount: '3.3',
                low: '0.001',
                high: '0.145',
                last: '0.134',
                open: 0.134,
                volume: '9.0',
                avg_price: '69.5',
                price_change_percent: '+10.05%',
            },
            ltcbtc: {
                amount: '5.0',
                low: '0.001',
                high: '0.145',
                last: '0.134',
                open: 0.134,
                volume: '10.0',
                avg_price: '69.5',
                price_change_percent: '+10.05%',
            },
        };

        it('formats tickers info from events', () => {
            expect(formatTicker(tickerEvents)).toEqual(tickers);
        });
    });

    describe('streamsBuilder', () => {
        const marketExample: Market = {
            id: 'abcdefg',
            name: 'ABCD/EFG',
            base_unit: 'abcd',
            quote_unit: 'efg',
            min_price: '0.015',
            max_price: '0.016',
            min_amount: '0.00001',
            amount_precision: 6,
            price_precision: 6,
        };

        it('returns public streams without market', () => {
            expect(streamsBuilder(false, [], undefined)).toEqual(['global.tickers']);
        });

        it('returns public streams with market', () => {
            expect(streamsBuilder(false, [], marketExample)).toEqual([
                'global.tickers',
                'abcdefg.trades',
                'abcdefg.update',
            ]);
        });

        it('includes private streams', () => {
            expect(streamsBuilder(true, [], undefined)).toEqual([
                'global.tickers',
                'order',
                'trade',
                'deposit_address',
            ]);
        });

        it('includes public/privates streams with market', () => {
            expect(streamsBuilder(true, [], marketExample)).toEqual([
                'global.tickers',
                'order',
                'trade',
                'deposit_address',
                'abcdefg.trades',
                'abcdefg.update',
            ]);
        });

        it('includes previous subscriptions in the list', () => {
            expect(streamsBuilder(true, ['some subscription'], marketExample)).toEqual([
                'global.tickers',
                'order',
                'trade',
                'deposit_address',
                'abcdefg.trades',
                'abcdefg.update',
                'some subscription',
            ]);
        });

        it('do not duplicates previous subscriptions', () => {
            expect(streamsBuilder(true, ['global.tickers'], marketExample)).toEqual([
                'global.tickers',
                'order',
                'trade',
                'deposit_address',
                'abcdefg.trades',
                'abcdefg.update',
            ]);
        });

        it('finex enabled private streams', () => {
            Cryptobase.config = {
                ...defaultConfig,
                finex: true,
            };

            expect(streamsBuilder(true, [], undefined)).toEqual([
                'global.tickers',
                'order',
                'trade',
                'deposit_address',
                'balances',
            ]);
        });
    });

    describe('periodMinutesToString', () => {
        const periods = [1, 5, 15, 30, 60, 120, 240, 360, 720, 1440, 4320, 10080, 666, 0, 100500];

        const expectedResult = [
            '1m',
            '5m',
            '15m',
            '30m',
            '1h',
            '2h',
            '4h',
            '6h',
            '12h',
            '1d',
            '3d',
            '1w',
            periodMinutesToString(+DEFAULT_TRADING_VIEW_INTERVAL),
            periodMinutesToString(+DEFAULT_TRADING_VIEW_INTERVAL),
            periodMinutesToString(+DEFAULT_TRADING_VIEW_INTERVAL),
        ];

        periods.map((period, index) => {
            it(`map period ${period} minute(s)`, () => {
                expect(periodMinutesToString(period)).toEqual(expectedResult[index]);
            });
        });
    });

    describe('periodStringToMinutes', () => {
        const periods = ['1m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '3d', '1w', '', 'hello', 'D'];

        const expectedResult = [
            1,
            5,
            15,
            30,
            60,
            120,
            240,
            360,
            720,
            1440,
            4320,
            10080,
            +DEFAULT_TRADING_VIEW_INTERVAL,
            +DEFAULT_TRADING_VIEW_INTERVAL,
            +DEFAULT_TRADING_VIEW_INTERVAL,
        ];

        periods.map((period, index) => {
            it(`map period ${period} minute(s)`, () => {
                expect(periodStringToMinutes(period)).toEqual(expectedResult[index]);
            });
        });
    });

    describe('marketKlineStreams', () => {
        it('', () => {
            expect(marketKlineStreams('abc', '18m')).toEqual({
                channels: ['abc.kline-18m'],
            });
        });
    });
});
