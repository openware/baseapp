import * as React from 'react';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import {
    IChartingLibraryWidget,
    LanguageCode,
    ThemeName,
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
    selectCurrentLanguage,
    selectCurrentMarket,
    selectKline,
    selectMarkets,
    selectMarketTickers,
} from '../../modules';
import { rangerSubscribeKlineMarket, rangerUnsubscribeKlineMarket } from '../../modules/public/ranger';
import { CurrentKlineSubscription, dataFeedObject, print } from './api';
import { getTradingChartTimezone } from './timezones';

interface ReduxProps {
    markets: Market[];
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

    private params = {
        interval: '15',
        containerId: 'tv_chart_container',
        libraryPath: '/charting_library/',
        clientId: 'tradingview.com',
        userId: 'public_user_id',
        fullscreen: false,
        autosize: true,
        studiesOverrides: {},
    };

    private datafeed = dataFeedObject(this, this.props.markets);

    public componentWillReceiveProps(next: Props) {
        if (next.currentMarket && (!this.props.currentMarket || next.currentMarket.id !== this.props.currentMarket.id)) {
            if (this.props.currentMarket && (this.props.currentMarket.id && this.tvWidget)) {
                this.updateChart(next.currentMarket);
            } else {
                this.setChart(next.markets, next.currentMarket);
            }
        }

        if (next.kline && next.kline !== this.props.kline) {
            this.datafeed.onRealtimeCallback(next.kline);
        }
    }

    public componentDidMount() {
        if (this.props.currentMarket) {
            this.setChart(this.props.markets, this.props.currentMarket);
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
                <div id={this.params.containerId} className="pg-trading-chart" />
            </React.Fragment>
        );
    }

    private setChart = (markets: Market[], currentMarket: Market) => {
        const { kline } = this.props;
        this.datafeed = dataFeedObject(this, markets);
        const currentTimeOffset = new Date().getTimezoneOffset();
        const clockPeriod = currentTimeOffset === stdTimezoneOffset(new Date()) ? 'STD' : 'DST';
        const timeframe = '1D';

        if (this.props.kline.period) {
            this.params.interval = this.props.kline.period;
        }
        const widgetOptions = {
            debug: false,
            symbol: currentMarket.id,
            toolbar_bg: '#1E2841',
            datafeed: this.datafeed,
            interval: this.params.interval,
            container_id: this.params.containerId,
            library_path: this.params.libraryPath,
            locale: this.props.lang as LanguageCode,
            disabled_features: ['use_localstorage_for_settings', 'header_symbol_search'],
            enabled_features: ['show_animated_logo'],
            client_id: this.params.clientId,
            user_id: this.params.userId,
            fullscreen: this.params.fullscreen,
            autosize: this.params.autosize,
            studies_overrides: this.params.studiesOverrides,
            overrides: {
                ['symbolWatermarkProperties.color']: '#1E2841',
                ['volumePaneSize']: 'iny',
                ['mainSeriesProperties.candleStyle.upColor']: '#54B489',
                ['mainSeriesProperties.candleStyle.downColor']: '#E85E59',
                ['mainSeriesProperties.candleStyle.borderUpColor']: '#54B489',
                ['mainSeriesProperties.candleStyle.borderDownColor']: '#E85E59',
                ['mainSeriesProperties.candleStyle.wickUpColor']: '#54B489',
                ['mainSeriesProperties.candleStyle.wickDownColor']: '#E85E59',
                ['paneProperties.background']: '#1E2841',
                ['paneProperties.vertGridProperties.color']: '#1E2841',
                ['paneProperties.vertGridProperties.style']: 1,
                ['paneProperties.horzGridProperties.color']: '#1E2841',
                ['paneProperties.horzGridProperties.style']: 1,
                ['paneProperties.crossHairProperties.color']: '#1E2841',
                ['paneProperties.crossHairProperties.width']: 1,
                ['paneProperties.crossHairProperties.style']: 1,
                ['scalesProperties.backgroundColor']: '#1E2841',
            },
            loading_screen: {
                backgroundColor: '#1E2841',
            },
            timezone: getTradingChartTimezone(currentTimeOffset, clockPeriod),
            popup_width: '000',
            enable_publishing: false,
            withdateranges: false,
            hide_side_toolbar: false,
            theme: 'Dark' as ThemeName,
            custom_css_url: '/css/tradingview.css',
            allow_symbol_change: false,
            details: true,
            hotlist: true,
            calendar: true,
            show_popup_button: true,
            popup_height: '50',
            height: 610,
            timeframe: timeframe,
        };

        this.tvWidget = new widget(widgetOptions);

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
