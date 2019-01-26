// tslint:disable
import {MarketDepths} from '@openware/components';
import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import {
    Market,
    RootState,
    selectCurrentMarket,
    selectDepthAsks,
    selectDepthBids,
} from '../../modules';
import { preciseData } from '../../helpers';

interface ReduxProps {
    asksItems: string[][];
    bidsItems: string[][];
    currentMarket: Market | undefined;
}

type Props = ReduxProps;

const settings = {
    tooltip: true,
    dataKeyX: 'price',
    dataKeyY: 'cumulativeVolume',
    height: 200,
};

class MarketDepthContainer extends React.Component<Props> {
    public shouldComponentUpdate(prev, next) {
        const {asksItems, bidsItems} = prev;
        const ordersLength = Number(asksItems.length) + Number(bidsItems.length);

        return ordersLength !== (this.props.asksItems.length + this.props.bidsItems.length);
    }

    public render() {
        const {asksItems, bidsItems} = this.props;
        const colors = {
            fillAreaAsk: '#fa5252',
            fillAreaBid: '#12b886',
            gridBackgroundStart: '#1a243b',
            gridBackgroundEnd: '#1a243b',
            strokeAreaAsk: '#fa5252',
            strokeAreaBid: '#12b886',
            strokeGrid: ' #B8E9F5',
            strokeAxis: '#cccccc',
        };
        return (
            <div>
                <div className="cr-table-header__content">
                    <div className={'pg-market-depth__title'}>
                        Market Depth
                    </div>
                </div>
                {(asksItems.length || bidsItems.length) ? this.renderMarketDepth(colors) : null}
            </div>
        );
    }

    private renderMarketDepth(colors) {
        return (
            <MarketDepths
                settings={settings}
                className={'pg-market-depth'}
                colors={colors}
                data={this.convertToDepthFormat()}
            />);
    }

    private convertToCumulative = (data, type) => {
        if (!this.props.currentMarket) {
            return;
        }
        const { name } = this.props.currentMarket;
        const [first, second] = name.split('/');
        const tipLayout = ({volume, price, cumulativeVolume, cumulativePrice}) =>
            <span className={'pg-market-depth__tooltip'}>
                    <span>Price : {price} {second}</span>
                    <span>Volume : {volume} {first}</span>
                    <span>Cumulative Volume : {preciseData(cumulativeVolume, 2)} {second}</span>
                    <span>Cumulative Value : {preciseData(cumulativePrice, 2)} {first}</span>
                </span>;

        let cumulativeVolumeData = 0;
        let cumulativePriceData = 0;

        const cumulative = data.map((item, index) => {
            const [price, volume] = item;
            const numberVolume = Number(volume);
            const numberPrice = Number(price);
            cumulativeVolumeData = numberVolume + cumulativeVolumeData;
            cumulativePriceData = cumulativePriceData + (numberPrice * numberVolume);
            return {
                [type]: cumulativeVolumeData,
                cumulativePrice : preciseData(cumulativePriceData, 2),
                cumulativeVolume : preciseData(cumulativeVolumeData, 2),
                volume: Number(volume),
                price: Number(price),
                name: tipLayout({volume, price, cumulativeVolume: cumulativeVolumeData, cumulativePrice: cumulativePriceData}),
            };
        });

        return type === 'bid' ? cumulative
                .sort((a, b) => b.bid - a.bid) :
            cumulative.sort((a, b) => a.ask - b.ask);
    };

    private convertToDepthFormat() {
        const {asksItems, bidsItems} = this.props;
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

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    asksItems: selectDepthAsks(state),
    bidsItems: selectDepthBids(state),
    currentMarket: selectCurrentMarket(state),
});

export const MarketDepthsComponent = connect(mapStateToProps)(MarketDepthContainer);
