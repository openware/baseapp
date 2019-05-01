import axios from 'axios';
import { TradingChartComponent } from '.';
import { tradeUrl } from '../../api/config';
import { LibrarySymbolInfo } from '../../charting_library/datafeed-api';
import { klineArrayToObject, KlineState } from '../../modules';
import { Market } from '../../modules/public/markets';
import { periodMinutesToString } from '../../modules/public/ranger/helpers';

// tslint:disable-next-line no-console
export const print = (...x) => console.log.apply(null, ['>>>> TC', ...x]);
export interface CurrentKlineSubscription {
    marketId?: string;
    periodString?: string;
}

const makeHistoryUrl = (market: string, resolution: number, from: number, to: number) =>
    `${tradeUrl()}/public/markets/${market}/k-line?period=${resolution}&time_from=${from}&time_to=${to}`;

const resolutionToSeconds = (r: string): number => {
    const minutes = parseInt(r, 10);
    if (r === '1D') {
        return 1440;
    } else if (r === 'D') {
        return 4320;
    } else if (!isNaN(minutes)) {
        return minutes;
    } else {
        return 1;
    }
};

const config = {
    supports_time: false,
    supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', '360', '720', 'd', '3d'],
};

export const dataFeedObject = (tradingChart: TradingChartComponent, markets: Market[]) => {
    const dataFeed = {
        onReady: cb => {
            setTimeout(() => cb(config), 0);
        },
        searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
            const symbols = markets.map(m => ({
                symbol: m.id,
                full_name: m.name,
                description: m.name,
                exchange: 'Cryptobase',
                ticker: m.id,
                type: 'bitcoin',
            }));
            setTimeout(() => onResultReadyCallback(symbols), 0);
        },
        resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
            // expects a symbolInfo object in response
            const symbol = markets.find(m => m.id === symbolName || m.name === symbolName);
            if (!symbol) {
                return setTimeout(() => onResolveErrorCallback('Symbol not found'), 0);
            }

            const symbolStub = {
                name: symbol.name,
                description: '',
                type: 'bitcoin',
                session: '24x7',
                timezone: 'Etc/UTC',
                ticker: symbol.id,
                minmov: 1,
                pricescale: 10000,
                has_intraday: true,
                intraday_multipliers: ['1', '5', '15', '30', '60', '120', '240', '360', '720', 'd', '3d'],
                supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', '360', '720', 'd', '3d'],
                volume_precision: 8,
                data_status: 'streaming',
            };

            return setTimeout(() => onSymbolResolvedCallback(symbolStub), 0);
        },
        getBars: async (
            symbolInfo: LibrarySymbolInfo,
            resolution,
            from,
            to,
            onHistoryCallback,
            onErrorCallback,
            firstDataRequest,
        ) => {
            const url = makeHistoryUrl(
                symbolInfo.ticker || symbolInfo.name.toLowerCase(),
                resolutionToSeconds(resolution),
                from,
                to,
            );
            return axios
                .get(url)
                .then(({ data }) => {
                    if (data.length < 1) {
                        return onHistoryCallback([], { noData: true });
                    }
                    const bars = data.map(klineArrayToObject);
                    return onHistoryCallback(bars, { noData: false });
                })
                .catch(e => {
                    return onHistoryCallback([], { noData: true });
                });
        },
        subscribeBars: (
            symbolInfo: LibrarySymbolInfo,
            resolution,
            onRealtimeCallback,
            subscribeUID: string,
            onResetCacheNeededCallback,
        ) => {
            dataFeed.onRealtimeCallback = (kline: KlineState) => {
                if (
                    kline.last &&
                    kline.marketId === tradingChart.currentKlineSubscription.marketId &&
                    kline.period === tradingChart.currentKlineSubscription.periodString
                ) {
                    onRealtimeCallback(kline.last);
                }
            };
            const marketId: string = symbolInfo.ticker!;
            const periodString = periodMinutesToString(resolutionToSeconds(resolution));
            tradingChart.props.subscribeKline(marketId, periodString);
            tradingChart.currentKlineSubscription = {
                marketId,
                periodString,
            };
        },
        unsubscribeBars: (subscribeUID: string) => {
            const { marketId, periodString } = tradingChart.currentKlineSubscription;
            if (marketId && periodString) {
                tradingChart.props.unSubscribeKline(marketId, periodString);
            }
            tradingChart.currentKlineSubscription = {};
        },
        onRealtimeCallback: (kline: KlineState) => {
            // window.console.log(`default onRealtimeCallback called with ${JSON.stringify(bar)}`);
        },
    };
    return dataFeed;
};
