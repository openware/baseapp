import * as React from 'react';
import { useIntl } from 'react-intl';
import { Decimal } from '../../components';
import { Market } from '../../modules';

interface Props {
    currentBidUnit: string;
    currentBidUnitsList: string[];
    markets: Market[];
    redirectToTrading: (key: string) => void;
    setCurrentBidUnit: (key: string) => void;
}

export const TickerTable = (props: Props) => {
    const { currentBidUnit, markets } = props;
    const intl = useIntl();

    const renderHeader = () => (
        <ul className="navigation" role="tablist">
            {props.currentBidUnitsList.map((item, i) => (
                <li
                    key={i}
                    className={`navigation__item ${item === currentBidUnit && 'navigation__item--active'}`}
                    onClick={() => props.setCurrentBidUnit(item)}
                >
                    <span className="navigation__item__link">
                        {item ? item.toUpperCase() : intl.formatMessage({id: 'page.body.marketsTable.filter.all'})}
                    </span>
                </li>
            ))}
        </ul>
    );

    const renderItem = (market, index: number) => {
        const marketChangeColor = +(market.change || 0) < 0 ? 'negative' : 'positive';

        return (
            <tr key={index} onClick={() => props.redirectToTrading(market.id)}>
                <td>
                    <div>
                        {market && market.name}
                    </div>
                </td>
                <td>
                    <span>
                        <Decimal fixed={market.amount_precision} thousSep=",">
                            {market.last}
                        </Decimal>
                    </span>
                </td>
                <td>
                    <span className={marketChangeColor}>{market.price_change_percent}</span>
                </td>
                <td>
                    <span>
                        <Decimal fixed={market.amount_precision} thousSep=",">
                            {market.high}
                        </Decimal>
                    </span>
                </td>
                <td>
                    <span>
                        <Decimal fixed={market.amount_precision} thousSep=",">
                            {market.low}
                        </Decimal>
                    </span>
                </td>
                <td>
                    <span>
                        <Decimal fixed={market.amount_precision} thousSep=",">
                            {market.volume}
                        </Decimal>
                    </span>
                </td>
            </tr>
        );
    };

    return (
        <div className="pg-ticker-table">
            <div className="pg-ticker-table__filter">
                {renderHeader()}
            </div>
            <div className="pg-ticker-table__table-wrap">
                <table className="pg-ticker-table__table">
                    <thead>
                        <tr>
                            <th scope="col">{intl.formatMessage({id: 'page.body.marketsTable.header.pair'})}</th>
                            <th scope="col">{intl.formatMessage({id: 'page.body.marketsTable.header.lastPrice'})}</th>
                            <th scope="col">{intl.formatMessage({id: 'page.body.marketsTable.header.change'})}</th>
                            <th scope="col">{intl.formatMessage({id: 'page.body.marketsTable.header.high'})}</th>
                            <th scope="col">{intl.formatMessage({id: 'page.body.marketsTable.header.low'})}</th>
                            <th scope="col">{intl.formatMessage({id: 'page.body.marketsTable.header.volume'})}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {markets[0] ? (
                            markets.map(renderItem)
                        ) : (
                            <tr><td><span className="no-data">{intl.formatMessage({id: 'page.noDataToShow'})}</span></td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
