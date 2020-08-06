import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { Decimal, FilterInput } from '../../../components';
import { DEFAULT_CCY_PRECISION } from '../../../constants';
import { MarketsTable } from '../../../containers';
import { Market, selectCurrentMarket, selectMarkets, selectMarketTickers } from '../../../modules';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { Modal } from '../../components';

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
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const [isOpenMarketSelector, setOpenMarketSelector] = React.useState(false);
    const [filteredMarkets, setFilteredMarkets] = React.useState(markets);
    const [marketsSearchKey, setMarketsSearchKey] = React.useState('');

    const searchFilter = (row: Market, searchKey: string) => {
        setMarketsSearchKey(searchKey);

        return row ? (row.name as string).toLowerCase().includes(searchKey.toLowerCase()) : false;
    };

    const handleFilter = (result: object[]) => {
        setFilteredMarkets(result as Market[]);
    };

    const renderModalHeader = () => {
        return (
            <div className="cr-mobile-modal__header">
                <div className="cr-mobile-modal__header-search">
                    <FilterInput
                        data={markets}
                        onFilter={handleFilter}
                        filter={searchFilter}
                        placeholder={intl.formatMessage({id: 'page.body.currentMarketInfo.search.placeholder'})}
                    />
                </div>
                <div className="cr-mobile-modal__header-close" onClick={() => setOpenMarketSelector(false)}>
                    <CloseIcon />
                </div>
            </div>
        );
    };

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

    React.useEffect(() => {
        setOpenMarketSelector(false);
    }, [currentMarket]);

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
            <Modal
                header={renderModalHeader()}
                isOpen={isOpenMarketSelector}
                onClose={() => setOpenMarketSelector(!isOpenMarketSelector)}
                title={intl.formatMessage({ id: 'page.header.signUp.modal.header' })}>
                <MarketsTable
                    handleChangeCurrentMarket={() => setOpenMarketSelector(false)}
                    markets={marketsSearchKey && filteredMarkets}
                />
            </Modal>
        </div>
    );
};

export const CurrentMarketInfo = React.memo(CurrentMarketInfoComponent);
