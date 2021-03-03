import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Decimal } from '../../components/Decimal';
import { MarketDepths } from '../../components/MarketDepths';
import {
    Market,
    RootState,
    selectChartRebuildState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectDepthAsks,
    selectDepthBids,
} from '../../modules';

interface ReduxProps {
    asksItems: string[][];
    bidsItems: string[][];
    chartRebuild: boolean;
    colorTheme: string;
    currentMarket: Market | undefined;
}

type Props = ReduxProps;

const settings = {
    tooltip: true,
    dataKeyX: 'price',
    dataKeyY: 'cumulativeVolume',
};

class MarketDepthContainer extends React.Component<Props> {
    public shouldComponentUpdate(nextProps: Props) {
        const {
            asksItems,
            bidsItems,
            chartRebuild,
            colorTheme,
            currentMarket,
        } = this.props;
        const colorThemeChanged = nextProps.colorTheme !== colorTheme;
        const currentMarketChanged = nextProps.currentMarket ? nextProps.currentMarket !== currentMarket : false;
        const chartRebuildTriggered = nextProps.chartRebuild !== chartRebuild;
        const ordersChanged = JSON.stringify(nextProps.asksItems) !== JSON.stringify(asksItems) ||
            JSON.stringify(nextProps.bidsItems) !== JSON.stringify(bidsItems);

        return ordersChanged || currentMarketChanged || chartRebuildTriggered || colorThemeChanged;
    }

    public render() {
        const { asksItems, bidsItems } = this.props;

        return (
            <div className="cr-market-depth">
                <div className="cr-table-header__content">
                    <div className={'pg-market-depth__title'}>
                        <FormattedMessage id="page.body.trade.header.marketDepths" />
                    </div>
                </div>
                {(asksItems.length || bidsItems.length) ? this.renderMarketDepth() : null}
            </div>
        );
    }

    private renderMarketDepth() {
        const { colorTheme } = this.props;

        return (
            <MarketDepths
                settings={settings}
                className={'pg-market-depth'}
                data={this.convertToDepthFormat()}
                colorTheme={colorTheme}
            />);
    }

    private convertToCumulative = (data, type) => {
        const { currentMarket } = this.props;

        if (!currentMarket) {
            return;
        }

        const [askCurrency, bidCurrency] = [currentMarket.base_unit.toUpperCase(), currentMarket.quote_unit.toUpperCase()];
        const tipLayout = ({ volume, price, cumulativeVolume, cumulativePrice }) => (
            <span className={'pg-market-depth__tooltip'}>
                <span><FormattedMessage id="page.body.trade.header.marketDepths.content.price" /> : {Decimal.format(price, currentMarket.price_precision)} {bidCurrency}</span>
                <span><FormattedMessage id="page.body.trade.header.marketDepths.content.volume" /> : {Decimal.format(volume, currentMarket.amount_precision)} {askCurrency}</span>
                <span><FormattedMessage id="page.body.trade.header.marketDepths.content.cumulativeVolume" /> : {Decimal.format(cumulativeVolume, currentMarket.amount_precision)} {askCurrency}</span>
                <span><FormattedMessage id="page.body.trade.header.marketDepths.content.cumulativeValue" /> : {Decimal.format(cumulativePrice, currentMarket.price_precision)} {bidCurrency}</span>
            </span>
        );

        let cumulativeVolumeData = 0;
        let cumulativePriceData = 0;

        const cumulative = data.map((item, index) => {
            const [price, volume] = item;
            const numberVolume = Decimal.format(volume, currentMarket.amount_precision);
            const numberPrice = Decimal.format(price, currentMarket.price_precision);
            cumulativeVolumeData = +numberVolume + cumulativeVolumeData;
            cumulativePriceData = cumulativePriceData + (+numberPrice * +numberVolume);

            return {
                [type]: Decimal.format(cumulativeVolumeData, currentMarket.amount_precision),
                cumulativePrice: Decimal.format(cumulativePriceData, currentMarket.price_precision),
                cumulativeVolume: +Decimal.format(cumulativeVolumeData, currentMarket.amount_precision),
                volume: Decimal.format(+volume, currentMarket.amount_precision),
                price: Decimal.format(+numberPrice, currentMarket.price_precision),
                name: tipLayout({ volume, price, cumulativeVolume: cumulativeVolumeData, cumulativePrice: cumulativePriceData }),
            };
        });

        return type === 'bid' ? cumulative
            .sort((a, b) => b.bid - a.bid) :
            cumulative.sort((a, b) => a.ask - b.ask);
    };

    private convertToDepthFormat() {
        const { asksItems, bidsItems } = this.props;
        const asksItemsLength = asksItems.length;
        const bidsItemsLength = bidsItems.length;


        const resultLength = asksItemsLength > bidsItemsLength ? bidsItemsLength : asksItemsLength;
        const asks = asksItems.slice(0, resultLength);
        const bids = bidsItems.slice(0, resultLength);

        const asksVolume = this.convertToCumulative(asks, 'ask');
        const bidsVolume = this.convertToCumulative(bids, 'bid');

        return [...bidsVolume, ...asksVolume];
    }
}

const mapStateToProps = (state: RootState) => ({
    asksItems: selectDepthAsks(state),
    bidsItems: selectDepthBids(state),
    chartRebuild: selectChartRebuildState(state),
    colorTheme: selectCurrentColorTheme(state),
    currentMarket: selectCurrentMarket(state),
});

export const MarketDepthsComponent = connect(mapStateToProps)(MarketDepthContainer);
