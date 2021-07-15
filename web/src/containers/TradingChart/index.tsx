// tslint:disable
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
    selectChartRebuildState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectKline,
    selectMarkets,
    selectMarketTickers,
    selectMobileDeviceState,
} from '../../modules';
import {
    rangerSubscribeKlineMarket,
    rangerUnsubscribeKlineMarket,
} from '../../modules/public/ranger';
import { periodStringToMinutes } from '../../modules/public/ranger/helpers';
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
    chartRebuild: boolean;
    currentMarket?: Market;
    tickers: MarketsState['tickers'];
    kline: KlineState;
    lang: string;
    isMobileDevice: boolean;
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

        if (next.chartRebuild !== this.props.chartRebuild) {
            this.handleRebuildChart();
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
            <div id={widgetParams.containerId} className="pg-trading-chart" />
        );
    }

    private setChart = (markets: Market[], currentMarket: Market, colorTheme: string) => {
        const { kline, lang, isMobileDevice } = this.props;
        this.datafeed = dataFeedObject(this, markets);
        const currentTimeOffset = new Date().getTimezoneOffset();
        const clockPeriod = currentTimeOffset === stdTimezoneOffset(new Date()) ? 'STD' : 'DST';

        if (this.props.kline.period) {
            widgetParams.interval = String(periodStringToMinutes(this.props.kline.period));
        }

        const disabledFeatures = {
            disabled_features: isMobileDevice ?
            [
                'border_around_the_chart',
                'chart_property_page_background',
                'chart_property_page_scales',
                'chart_property_page_style',
                'chart_property_page_timezone_sessions',
                'chart_property_page_trading',
                'compare_symbol',
                'control_bar',
                'countdown',
                'create_volume_indicator_by_default',
                'display_market_status',
                'edit_buttons_in_legend',
                'go_to_date',
                'header_chart_type',
                'header_compare',
                'header_indicators',
                'header_saveload',
                'header_screenshot',
                'header_symbol_search',
                'header_undo_redo',
                'header_widget_dom_node',
                'hide_last_na_study_output',
                'hide_left_toolbar_by_default',
                'left_toolbar',
                'legend_context_menu',
                'main_series_scale_menu',
                'pane_context_menu',
                'show_chart_property_page',
                'study_dialog_search_control',
                'symbol_info',
                'timeframes_toolbar',
                'timezone_menu',
                'volume_force_overlay',
            ] : [
                'header_symbol_search',
                'use_localstorage_for_settings',
            ]
        };

        const defaultWidgetOptions = {
            symbol: currentMarket.id,
            datafeed: this.datafeed,
            interval: widgetParams.interval,
            container_id: widgetParams.containerId,
            locale: this.languageIncluded(lang) ? lang as LanguageCode : 'en' as LanguageCode,
            timezone: getTradingChartTimezone(currentTimeOffset, clockPeriod),
        };

        this.tvWidget = new widget({...defaultWidgetOptions, ...widgetOptions(colorTheme), ...disabledFeatures});

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
                this.tvWidget!.activeChart().setVisibleRange(previousRange);
            }

            if (previousResolution) {
                this.tvWidget!.activeChart().setResolution(String(periodStringToMinutes(previousResolution)), () => {
                    print('Resolution set', previousResolution);
                });
            }
        });
    };

    private updateChart = (currentMarket: Market) => {
        if (this.tvWidget) {
            let symbolSet = false;
            const UPDATE_TIMEOUT = 3000;

            const callUpdateChart = () => {
                return new Promise((resolve, reject) => {
                    this.tvWidget.onChartReady(() => {
                        this.tvWidget!.activeChart().setSymbol(currentMarket.id, () => {
                            symbolSet = true;
                            resolve('Symbol set');
                        });
                    });

                    setTimeout(() => {
                        resolve('Symbol failed to set');
                    }, UPDATE_TIMEOUT);
                });
            };

            callUpdateChart().then(res => {
                print(res, currentMarket.id);

                if  (!symbolSet) {
                    print('Rebuild chart', currentMarket.id);
                    this.handleRebuildChart(currentMarket);
                }
            });
        }
    };

    private handleRebuildChart = (nextMarket?: Market) => {
        const {
            colorTheme,
            currentMarket,
            markets,
        } = this.props;

        if (this.tvWidget && currentMarket) {
            try {
                this.tvWidget.remove();
            } catch (error) {
                window.console.log(`TradingChart unmount failed (Rebuild chart): ${error}`);
            }

            this.setChart(markets, nextMarket || currentMarket, colorTheme);
        }
    };

    private languageIncluded = (lang: string) => {
        return ['ar', 'zh', 'cs', 'da_DK', 'nl_NL', 'en', 'et_EE', 'fr', 'de', 'el', 'he_IL', 'hu_HU', 'id_ID', 'it', 'ja', 'ko', 'fa', 'pl', 'pt', 'ro', 'ru', 'sk_SK', 'es', 'sv', 'th', 'tr', 'vi'].includes(lang)
    };
}

const reduxProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    markets: selectMarkets(state),
    colorTheme: selectCurrentColorTheme(state),
    chartRebuild: selectChartRebuildState(state),
    currentMarket: selectCurrentMarket(state),
    tickers: selectMarketTickers(state),
    kline: selectKline(state),
    lang: selectCurrentLanguage(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    klineUpdateTimeRange: payload => dispatch(klineUpdateTimeRange(payload)),
    subscribeKline: (marketId: string, periodString: string) => dispatch(rangerSubscribeKlineMarket(marketId, periodString)),
    unSubscribeKline: (marketId: string, periodString: string) => dispatch(rangerUnsubscribeKlineMarket(marketId, periodString)),
    klineUpdatePeriod: payload => dispatch(klineUpdatePeriod(payload)),
});

export const TradingChart = connect<ReduxProps, DispatchProps, {}, RootState>(reduxProps, mapDispatchProps)(TradingChartComponent);
