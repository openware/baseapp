import axios from 'axios';
import { gatewayUrl } from '../../api/config';
import { SubscribeBarsCallback } from '../../charting_library/charting_library.min';
import { LibrarySymbolInfo } from '../../charting_library/datafeed-api';
import { Market } from '../../modules/markets';

// tslint:disable-next-line no-console
export const print = (...x) => console.log.apply(null, ['>>>> TC', ...x]);

const makeHistoryUrl = (
    market: string, resolution: number, from: number, to: number,
) => `${gatewayUrl()}/peatio/public/markets/${market}/k-line?period=${resolution}&time_from=${from}&time_to=${to}`;

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

export interface TickSubscriptions {
    [id: string]: {
        cb: SubscribeBarsCallback;
        ticker: string;
    };
}

export const dataFeedObject = (
    markets: Market[], subscriptions: TickSubscriptions,
) => ({
    onReady: cb => {
        setTimeout(() => cb(config), 0);

    },
    searchSymbols: (
        userInput, exchange, symbolType, onResultReadyCallback,
    ) => {
        const symbols = markets.map(m => (
            {
                symbol: m.id,
                full_name: m.name,
                description: m.name,
                exchange: 'Cryptobase',
                ticker: m.id,
                type: 'bitcoin',
            }
        ));
        setTimeout(() => onResultReadyCallback(symbols), 0);
    },
    resolveSymbol: (
        symbolName, onSymbolResolvedCallback, onResolveErrorCallback,
    ) => {
        // expects a symbolInfo object in response
        const symbol = markets.find(m => m.id === symbolName);
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
            exchange: 'Cryptobase',
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
        symbolInfo: LibrarySymbolInfo, resolution, from, to, onHistoryCallback,
        onErrorCallback,
        firstDataRequest,
    ) => {
        const url = makeHistoryUrl(
            symbolInfo.ticker || symbolInfo.name.toLowerCase(),
            resolutionToSeconds(resolution),
            from,
            to,
        );
        return axios.get(url).then(({ data }) => {
            if (data.length < 1) {
                return onHistoryCallback([], { noData: true });
            }
            const bars = data
                .map(el => {
                    const [time, open, high, low, close, volume] = el;
                    return {
                        time: time * 1e3,
                        open,
                        high,
                        low,
                        close,
                        volume,
                    };
                });
            return onHistoryCallback(bars, { noData: false });
        }).catch(e => {
            return onHistoryCallback([], { noData: true });
        });
    },
    subscribeBars: (
        symbolInfo: LibrarySymbolInfo, resolution, onRealtimeCallback,
        subscribeUID: string,
        onResetCacheNeededCallback,
    ) => {
        subscriptions[subscribeUID] = {
            cb: onRealtimeCallback,
            ticker: symbolInfo.ticker!,
        };
    },
    unsubscribeBars: subscribeUID => {
        // tslint:disable-next-line
        delete subscriptions[subscribeUID];
    },
});
