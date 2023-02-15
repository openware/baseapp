import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Decimal } from '../../components/Decimal';
import { MarketDepths } from '../../components/MarketDepths';
import {
    selectChartRebuildState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectDepthAsks,
    selectDepthBids,
    selectOrderBookLoading,
} from '../../modules';

export const MarketDepthsComponent = () => {
    const asksItems = useSelector(selectDepthAsks);
    const bidsItems = useSelector(selectDepthBids);
    const chartRebuild = useSelector(selectChartRebuildState);
    const colorTheme = useSelector(selectCurrentColorTheme);
    const currentMarket = useSelector(selectCurrentMarket);
    const loading = useSelector(selectOrderBookLoading);

    const settings = React.useMemo(() => {
        return {
            tooltip: true,
            dataKeyX: 'price',
            dataKeyY: 'cumulativeVolume',
        };
    }, []);

    const tipLayout = React.useCallback(
        ({ volume, price, cumulativeVolume, cumulativePrice }) => {
            const [askCurrency, bidCurrency] = [
                currentMarket.base_unit.toUpperCase(),
                currentMarket.quote_unit.toUpperCase(),
            ];

            return (
                <span className="pg-market-depth__tooltip">
                    <span>
                        <FormattedMessage id="page.body.trade.header.marketDepths.content.price" /> :{' '}
                        {Decimal.format(price, currentMarket.price_precision)} {bidCurrency}
                    </span>
                    <span>
                        <FormattedMessage id="page.body.trade.header.marketDepths.content.volume" /> :{' '}
                        {Decimal.format(volume, currentMarket.amount_precision)} {askCurrency}
                    </span>
                    <span>
                        <FormattedMessage id="page.body.trade.header.marketDepths.content.cumulativeVolume" /> :{' '}
                        {Decimal.format(cumulativeVolume, currentMarket.amount_precision)} {askCurrency}
                    </span>
                    <span>
                        <FormattedMessage id="page.body.trade.header.marketDepths.content.cumulativeValue" /> :{' '}
                        {Decimal.format(cumulativePrice, currentMarket.price_precision)} {bidCurrency}
                    </span>
                </span>
            );
        },
        [currentMarket],
    );

    const cumulative = React.useCallback(
        (data, type) => {
            let cumulativeVolumeData = 0;
            let cumulativePriceData = 0;

            return data.map((item, index) => {
                const [price, volume] = item;
                const numberVolume = Decimal.format(volume, currentMarket.amount_precision);
                const numberPrice = Decimal.format(price, currentMarket.price_precision);

                cumulativeVolumeData = +numberVolume + cumulativeVolumeData;
                cumulativePriceData = cumulativePriceData + +numberPrice * +numberVolume;

                return {
                    [type]: Decimal.format(cumulativeVolumeData, currentMarket.amount_precision),
                    cumulativePrice: Decimal.format(cumulativePriceData, currentMarket.price_precision),
                    cumulativeVolume: +Decimal.format(cumulativeVolumeData, currentMarket.amount_precision),
                    volume: Decimal.format(+volume, currentMarket.amount_precision),
                    price: Decimal.format(+numberPrice, currentMarket.price_precision),
                    name: tipLayout({
                        volume,
                        price,
                        cumulativeVolume: cumulativeVolumeData,
                        cumulativePrice: cumulativePriceData,
                    }),
                };
            });
        },
        [currentMarket],
    );

    const convertToCumulative = React.useCallback((data, type) => {
        const cumulativeData = cumulative(data, type);

        return type === 'bid'
            ? cumulativeData.sort((a, b) => b.bid - a.bid)
            : cumulativeData.sort((a, b) => a.ask - b.ask);
    }, []);

    const convertToDepthFormat = React.useMemo(() => {
        const resultLength = asksItems.length > bidsItems.length ? bidsItems.length : asksItems.length;

        const asks = asksItems.slice(0, resultLength);
        const bids = bidsItems.slice(0, resultLength);

        const asksVolume = convertToCumulative(asks, 'ask');
        const bidsVolume = convertToCumulative(bids, 'bid');

        return [...bidsVolume, ...asksVolume];
    }, [asksItems, bidsItems]);

    const renderMarketDepths = React.useMemo(() => {
        return (
            <MarketDepths
                settings={settings}
                className="pg-market-depth"
                data={convertToDepthFormat}
                colorTheme={colorTheme}
            />
        );
    }, [settings, colorTheme, asksItems, bidsItems]);

    if (loading) {
        return null;
    }

    return <div className="cr-market-depth">{renderMarketDepths}</div>;
};
