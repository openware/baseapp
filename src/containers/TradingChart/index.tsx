import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import {
    IChartingLibraryWidget,
    LanguageCode,
    widget,
} from '../../charting_library/charting_library.min';
import { stdTimezoneOffset } from '../../helpers';
import {
    KlineState,
    klineUpdatePeriod,
    klineUpdateTimeRange,
    Market,
    MarketsState,
    RootState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectKline,
    selectMarkets,
    selectMarketTickers,
} from '../../modules';
import {
    rangerSubscribeKlineMarket,
    rangerUnsubscribeKlineMarket,
} from '../../modules/public/ranger';
import {
    CurrentKlineSubscription,
    dataFeedObject,
    print,
} from './api';
import {
    widgetOptions,
    widgetParams,
} from './config';
import { getTradingChartTimezone } from './timezones';

interface ReduxProps {
    markets: Market[];
    colorTheme: string;
    currentMarket?: Market;
    tickers: MarketsState['tickers'];
    kline: KlineState;
    lang: string;
}

interface DispatchProps {
    subscribeKline: typeof rangerSubscribeKlineMarket;
    unSubscribeKline: typeof rangerUnsubscribeKlineMarket;
    klineUpdateTimeRange: typeof klineUpdateTimeRange;
    klineUpdatePeriod: typeof klineUpdatePeriod;
}

type Props = ReduxProps & DispatchProps;

export class TradingChartComponent extends React.PureComponent<Props> {
    public currentKlineSubscription: CurrentKlineSubscription = {};
    public tvWidget: IChartingLibraryWidget | null = null;

    private datafeed = dataFeedObject(this, this.props.markets);

    public componentWillReceiveProps(next: Props) {
        if (next.currentMarket && next.colorTheme && next.colorTheme !== this.props.colorTheme) {
            this.setChart(next.markets, next.currentMarket, next.colorTheme);
        }

        if (next.currentMarket && (!this.props.currentMarket || next.currentMarket.id !== this.props.currentMarket.id)) {
            if (this.props.currentMarket && (this.props.currentMarket.id && this.tvWidget)) {
                this.updateChart(next.currentMarket);
            } else {
                this.setChart(next.markets, next.currentMarket, next.colorTheme);
            }
        }

        if (next.kline && next.kline !== this.props.kline) {
            this.datafeed.onRealtimeCallback(next.kline);
        }
    }

    public componentDidMount() {
        const {
            colorTheme,
            currentMarket,
            markets,
        } = this.props;

        if (currentMarket) {
            this.setChart(markets, currentMarket, colorTheme);
        }
    }

    public componentWillUnmount() {
        if (this.tvWidget) {
            try {
                this.tvWidget.remove();
            } catch (error) {
                window.console.log(`TradingChart unmount failed: ${error}`);
            }
        }
    }

    public render() {
        return (
            <React.Fragment>
                <div className="cr-table-header__content">
                    {this.props.currentMarket ? this.props.currentMarket.name : ''}
                </div>
                <div id={widgetParams.containerId} className="pg-trading-chart" />
            </React.Fragment>
        );
    }

    private setChart = (markets: Market[], currentMarket: Market, colorTheme: string) => {
        const { kline } = this.props;
        this.datafeed = dataFeedObject(this, markets);
        const currentTimeOffset = new Date().getTimezoneOffset();
        const clockPeriod = currentTimeOffset === stdTimezoneOffset(new Date()) ? 'STD' : 'DST';

        if (this.props.kline.period) {
            widgetParams.interval = this.props.kline.period;
        }
        const defaultWidgetOptions = {
            symbol: currentMarket.id,
            datafeed: this.datafeed,
            interval: widgetParams.interval,
            container_id: widgetParams.containerId,
            locale: this.props.lang as LanguageCode,
            timezone: getTradingChartTimezone(currentTimeOffset, clockPeriod),
        };

        this.tvWidget = new widget({...defaultWidgetOptions, ...widgetOptions(colorTheme)});

        let previousRange = { from: 0, to: 0 };
        if (kline.range.from !== 0 && kline.range.to !== 0) {
            previousRange = this.props.kline.range;
        }

        let previousResolution = '';
        if (kline.period) {
            previousResolution = kline.period;
        }

        this.tvWidget.onChartReady(() => {
            this.tvWidget!.activeChart().setSymbol(currentMarket.id, () => {
                print('Symbol set', currentMarket.id);
            });

            if (previousRange.from !== 0 && previousRange.to !== 0) {
                this.tvWidget!.activeChart().setVisibleRange(previousRange, () => {
                    print('Range set', previousRange);
                });
            }

            if (previousResolution) {
                this.tvWidget!.activeChart().setResolution(previousResolution.toUpperCase(), () => {
                    print('Resolution set', previousResolution);
                });
            }
        });
    };

    private updateChart = (currentMarket: Market) => {
        if (this.tvWidget) {
            this.tvWidget.onChartReady(() => {
                this.tvWidget!.activeChart().setSymbol(currentMarket.id, () => {
                    print('Symbol set', currentMarket.id);
                });
            });
        }
    }
}

const reduxProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    markets: selectMarkets(state),
    colorTheme: selectCurrentColorTheme(state),
    currentMarket: selectCurrentMarket(state),
    tickers: selectMarketTickers(state),
    kline: selectKline(state),
    lang: selectCurrentLanguage(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    klineUpdateTimeRange: payload => dispatch(klineUpdateTimeRange(payload)),
    subscribeKline: (marketId: string, periodString: string) => dispatch(rangerSubscribeKlineMarket(marketId, periodString)),
    unSubscribeKline: (marketId: string, periodString: string) => dispatch(rangerUnsubscribeKlineMarket(marketId, periodString)),
    klineUpdatePeriod: payload => dispatch(klineUpdatePeriod(payload)),
});

export const TradingChart = connect<ReduxProps, DispatchProps, {}, RootState>(reduxProps, mapDispatchProps)(TradingChartComponent);
