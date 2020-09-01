import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Decimal } from '../../components/Decimal';
import { IntlProps } from '../../index';
import {
    Market,
    RootState,
    selectCurrentMarket,
    selectMarkets,
    selectMarketTickers, Ticker,
} from '../../modules';


interface ReduxProps {
    currentMarket?: Market;
    markets: Market[];
    marketTickers: {
        [key: string]: Ticker,
    };
}

type Props = IntlProps & ReduxProps;

// tslint:disable no-any jsx-no-multiline-js
class HeaderToolbarContainer extends React.Component<Props> {
    public render() {
        const { marketTickers, currentMarket } = this.props;
        const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, price_change_percent: '+0.00%' };

        const isPositive = currentMarket && /\+/.test(this.getTickerValue('price_change_percent'));
        const cls = isPositive ? 'positive' : 'negative';

        const bidUnit = currentMarket && currentMarket.quote_unit.toUpperCase();

        return (
            <div className="pg-header__toolbar">
                <div className="pg-header__toolbar-item">
                    <p className="pg-header__toolbar-item-value pg-header__toolbar-item-value-positive">
                        {currentMarket && Decimal.format(Number(this.getTickerValue('low')), currentMarket.price_precision, ',')} {bidUnit}
                    </p>
                    <p className="pg-header__toolbar-item-text">
                        {this.translate('page.body.trade.toolBar.lowest')}
                    </p>
                </div>
                <div className="pg-header__toolbar-item">
                    <p className="pg-header__toolbar-item-value pg-header__toolbar-item-value-negative">
                        {currentMarket && Decimal.format(Number(this.getTickerValue('last')), currentMarket.price_precision, ',')} {bidUnit}
                    </p>
                    <p className="pg-header__toolbar-item-text">
                        {this.translate('page.body.trade.toolBar.lastPrice')}
                    </p>
                </div>
                <div className="pg-header__toolbar-item">
                    <p className="pg-header__toolbar-item-value pg-header__toolbar-item-value-negative">
                        {currentMarket && Decimal.format(Number(this.getTickerValue('high')), currentMarket.price_precision, ',')} {bidUnit}
                    </p>
                    <p className="pg-header__toolbar-item-text">
                        {this.translate('page.body.trade.toolBar.highest')}
                    </p>
                </div>
                <div className="pg-header__toolbar-item">
                    <p className="pg-header__toolbar-item-value pg-header__toolbar-item-value-positive">
                        {currentMarket && Decimal.format(Number(this.getTickerValue('volume')), currentMarket.price_precision, ',')} {bidUnit}
                    </p>
                    <p className="pg-header__toolbar-item-text">
                        {this.translate('page.body.trade.toolBar.volume')}
                    </p>
                </div>
                <div className="pg-header__toolbar-item">
                    <p className={`pg-header__toolbar-item-value pg-header__toolbar-item-value-${cls}`}>
                        {currentMarket && (marketTickers[currentMarket.id] || defaultTicker).price_change_percent}
                    </p>
                    <p className="pg-header__toolbar-item-text">
                        {this.translate('page.body.trade.toolBar.change')}
                    </p>
                </div>
            </div>
        );
    }

    private getTickerValue = (value: string) => {
        const { marketTickers, currentMarket } = this.props;
        const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, price_change_percent: '+0.00%'};

        return currentMarket && (marketTickers[currentMarket.id] || defaultTicker)[value];
    };

    private translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    markets: selectMarkets(state),
    marketTickers: selectMarketTickers(state),
});


const HeaderToolbar = injectIntl(withRouter(connect(mapStateToProps, {})(HeaderToolbarContainer) as any) as any);

export {
    HeaderToolbar,
};
