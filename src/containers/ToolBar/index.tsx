import {
    Decimal,
} from '@openware/components';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import {
    Market,
    RootState,
    selectCurrentMarket,
    selectMarkets,
    selectMarketTickers,
    Ticker,
} from '../../modules';
import { resetLayouts } from '../../modules/public/gridLayout';
import {
    MarketSelector,
} from './MarketSelector';
import { PriceBar } from './PriceBar';
import {
    ProgressLabel,
} from './ProgressLabel';

interface ReduxProps {
    currentMarket?: Market;
    markets: Market[];
    marketTickers: {
        [key: string]: Ticker,
    };
}

interface State {
    isOpen: boolean;
}

interface DispatchProps {
    resetLayouts: typeof resetLayouts;
}

type Props = DispatchProps & ReduxProps & InjectedIntlProps;

class ToolBarComponent extends React.Component<Props, State> {
    public readonly state = {
        isOpen: false,
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    public render() {
        const {marketTickers, currentMarket} = this.props;
        const defaultTicker = {low: 0, last: 0, high: 0, vol: 0, price_change_percent: '+0.00%'};

        const isPositive = currentMarket && /\+/.test(this.getTickerValue('price_change_percent'));
        const last = this.getTickerValue('last');
        const high = this.getTickerValue('high');
        const low = this.getTickerValue('low');
        const percentage = ((last - low) / ((high - low) / 100)) || 0;

        const bidUnit = currentMarket && currentMarket.quote_unit.toUpperCase();
        const askUnit = currentMarket && currentMarket.base_unit.toUpperCase();

        return (
            <div className="pg-trading-header-container">
                <div className="pg-trading-header-container-selector">
                    <MarketSelector/>
                </div>
                <div className="pg-trading-header-container-stats">
                    <div className="pg-trading-header-container-daily">
                        <ProgressLabel
                            progress={currentMarket && Decimal.format(Number(this.getTickerValue('low')), currentMarket.price_precision)}
                            isPositive={true}
                            additional={this.translate('page.body.trade.toolBar.lowest')}
                            bidUnit={bidUnit}
                        />
                        <div className="pg-trading-header-container-daily-last">
                            <ProgressLabel
                                progress={currentMarket && Decimal.format(Number(this.getTickerValue('last')), currentMarket.price_precision)}
                                isPositive={true}
                                additional={this.translate('page.body.trade.toolBar.lastPrice')}
                                bidUnit={bidUnit}
                            />
                        </div>
                        <PriceBar
                            percentage={percentage}
                            lastPrice={currentMarket && Decimal.format(Number(this.getTickerValue('last')), currentMarket.price_precision)}
                            bidUnit={bidUnit}
                        />
                        <ProgressLabel
                            progress={currentMarket && Decimal.format(Number(this.getTickerValue('high')), currentMarket.price_precision)}
                            isPositive={false}
                            additional={this.translate('page.body.trade.toolBar.highest')}
                            bidUnit={bidUnit}
                        />
                    </div>
                    <div className="pg-trading-header-container-total">
                        <ProgressLabel
                            progress={currentMarket && Decimal.format(Number(this.getTickerValue('vol')), currentMarket.amount_precision)}
                            isPositive={true}
                            additional={this.translate('page.body.trade.toolBar.volume')}
                            bidUnit={askUnit}
                        />
                        <ProgressLabel
                            progress={currentMarket && (marketTickers[currentMarket.id] || defaultTicker).price_change_percent}
                            isPositive={isPositive}
                            additional={this.translate('page.body.trade.toolBar.change')}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private getTickerValue = (value: string) => {
        const {marketTickers, currentMarket} = this.props;
        const defaultTicker = {low: 0, last: 0, high: 0, vol: 0, price_change_percent: '+0.00%'};

        return currentMarket && (marketTickers[currentMarket.id] || defaultTicker)[value];
    };
}

const reduxProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    markets: selectMarkets(state),
    currentMarket: selectCurrentMarket(state),
    marketTickers: selectMarketTickers(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    resetLayouts: payload => dispatch(resetLayouts(payload)),
});

export const ToolBar = injectIntl(connect(reduxProps, mapDispatchToProps)(ToolBarComponent));
