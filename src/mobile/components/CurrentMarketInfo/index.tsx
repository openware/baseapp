import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Decimal } from '../../../components/Decimal';
import { DEFAULT_CCY_PRECISION } from '../../../constants';
import { selectCurrentMarket, selectMarketTickers } from '../../../modules';
import { ChevronIcon } from '../../assets/images/ChevronIcon';

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
    const [isOpenMarketSelector, setOpenMarketSelector] = React.useState(false);

    const currentMarketPricePrecision = currentMarket ? currentMarket.price_precision : DEFAULT_CCY_PRECISION;
    const currentMarketTicker = (currentMarket && tickers[currentMarket.id]) || defaultTicker;
    const currentMarketTickerChange = +(+currentMarketTicker.last - +currentMarketTicker.open).toFixed(currentMarketPricePrecision);
    const currentMarketChangeClass = classnames('', {
        'change-positive': (+currentMarketTickerChange || 0) >= 0,
        'change-negative': (+currentMarketTickerChange || 0) < 0,
    });
    const isOpenMarketSelectorClass = classnames('pg-mobile-current-market-info__left__selector__chevron', {
        'pg-mobile-current-market-info__left__selector__chevron--open': isOpenMarketSelector,
    });

    return (
        <div className="pg-mobile-current-market-info">
            <div className="pg-mobile-current-market-info__left">
                <div className="pg-mobile-current-market-info__left__selector" onClick={() => setOpenMarketSelector(!isOpenMarketSelector)}>
                    <span>{currentMarket ? currentMarket.name : ''}</span>
                    <div className={isOpenMarketSelectorClass}>
                        <ChevronIcon />
                    </div>
                </div>
                <div className="pg-mobile-current-market-info__left__price-change">
                    <span className={currentMarketChangeClass}>
                        {Decimal.format(currentMarketTicker.last, currentMarketPricePrecision, ',')}
                    </span>
                    <span className={currentMarketChangeClass}>{currentMarketTicker.price_change_percent}</span>
                </div>
            </div>
            <div className="pg-mobile-current-market-info__right">
                <div className="pg-mobile-current-market-info__right__col">
                    <span>{intl.formatMessage({id: 'page.body.currentMarketInfo.volume'})}</span>
                    <span>{intl.formatMessage({id: 'page.body.currentMarketInfo.high'})}</span>
                    <span>{intl.formatMessage({id: 'page.body.currentMarketInfo.low'})}</span>
                </div>
                <div className="pg-mobile-current-market-info__right__col">
                    <span className={currentMarketChangeClass}>
                        {Decimal.format(currentMarketTicker.volume, currentMarketPricePrecision, ',')}
                    </span>
                    <span className={currentMarketChangeClass}>
                        {Decimal.format(currentMarketTicker.high, currentMarketPricePrecision, ',')}
                    </span>
                    <span className={currentMarketChangeClass}>
                        {Decimal.format(currentMarketTicker.low, currentMarketPricePrecision, ',')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const CurrentMarketInfo = React.memo(CurrentMarketInfoComponent);
