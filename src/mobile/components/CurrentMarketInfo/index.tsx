import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Decimal } from '../../../components/Decimal';
import { DEFAULT_CCY_PRECISION } from '../../../constants';
import { selectCurrentMarket, selectMarketTickers } from '../../../modules';

const defaultTicker = {
    amount: '0.0',
    last: '0.0',
    high: '0.0',
    open: '0.0',
    low: '0.0',
    price_change_percent: '+0.00%',
    volume: '0.0',
};

const CurrentMarketInfoComponent = () => {
    const intl = useIntl();
    const currentMarket = useSelector(selectCurrentMarket);
    const tickers = useSelector(selectMarketTickers);
    const currentMarketPricePrecision = currentMarket ? currentMarket.price_precision : DEFAULT_CCY_PRECISION;
    const currentMarketTicker = (currentMarket && tickers[currentMarket.id]) || defaultTicker;
    const currentMarketTickerChange = +(+currentMarketTicker.last - +currentMarketTicker.open).toFixed(currentMarketPricePrecision);
    const currentMarketChangeClass = classnames('', {
        'change-positive': (+currentMarketTickerChange || 0) >= 0,
        'change-negative': (+currentMarketTickerChange || 0) < 0,
    });

    return (
        <div className="pg-mobile-current-market-info">
            <div className="pg-mobile-current-market-info__left">
                <div className="pg-mobile-current-market-info__left__selector">
                    <span>{currentMarket ? currentMarket.name : ''}</span>
                </div>
                <div className="pg-mobile-current-market-info__left__item">
                    <span className={currentMarketChangeClass}>
                        {Decimal.format(currentMarketTicker.last, currentMarketPricePrecision, ',')}
                    </span>
                    <span className={currentMarketChangeClass}>{currentMarketTicker.price_change_percent}</span>
                </div>
            </div>
            <div className="pg-mobile-current-market-info__right">
                <div className="pg-mobile-current-market-info__right__item">
                    <span>{intl.formatMessage({id: 'page.body.currentMarketInfo.volume'})}</span>
                    <span className={currentMarketChangeClass}>
                        {Decimal.format(currentMarketTicker.volume, currentMarketPricePrecision, ',')}
                    </span>
                </div>
                <div className="pg-mobile-current-market-info__right__item">
                    <span>{intl.formatMessage({id: 'page.body.currentMarketInfo.high'})}</span>
                    <span className={currentMarketChangeClass}>
                        {Decimal.format(currentMarketTicker.high, currentMarketPricePrecision, ',')}
                    </span>
                </div>
                <div className="pg-mobile-current-market-info__right__item">
                    <span>{intl.formatMessage({id: 'page.body.currentMarketInfo.low'})}</span>
                    <span className={currentMarketChangeClass}>
                        {Decimal.format(currentMarketTicker.low, currentMarketPricePrecision, ',')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const CurrentMarketInfo = React.memo(CurrentMarketInfoComponent);
