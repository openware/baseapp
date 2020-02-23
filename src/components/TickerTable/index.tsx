import * as React from 'react';
import { Decimal } from '../../components';
import { Market } from '../../modules';

interface Props {
    currentBidUnit: string;
    currentBidUnitsList: string[];
    markets: Market[];
    redirectToTrading: (key: string) => void;
    setCurrentBidUnit: (key: string) => void;
    translate: (id: string) => string;
}

export class TickerTable extends React.Component<Props> {
    public renderHeader(currentBidUnit: string) {
        const {
            currentBidUnitsList,
            setCurrentBidUnit,
            translate,
        } = this.props;

        return (
            <ul className="navigation" role="tablist">
                {currentBidUnitsList.map((item, i) => (
                    <li
                        key={i}
                        className={`navigation__item ${item === currentBidUnit && 'navigation__item--active'}`}
                        onClick={() => setCurrentBidUnit(item)}
                    >
                        <span className="navigation__item__link">
                            {item ? item.toUpperCase() : translate('page.body.marketsTable.filter.all')}
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    public render() {
        const {
            currentBidUnit,
            markets,
            translate,
        } = this.props;

        return (
            <div className="pg-ticker-table">
                <div className="pg-ticker-table__filter">
                    {this.renderHeader(currentBidUnit)}
                </div>
                <div className="pg-ticker-table__table-wrap">
                    <table className="pg-ticker-table__table">
                        <thead>
                            <tr>
                                <th scope="col">{translate('page.body.marketsTable.header.pair')}</th>
                                <th scope="col">{translate('page.body.marketsTable.header.lastPrice')}</th>
                                <th scope="col">{translate('page.body.marketsTable.header.change')}</th>
                                <th scope="col">{translate('page.body.marketsTable.header.high')}</th>
                                <th scope="col">{translate('page.body.marketsTable.header.low')}</th>
                                <th scope="col">{translate('page.body.marketsTable.header.volume')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {markets[0] && markets.map(this.renderItem)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    private renderItem = (market, index: number) => {
        const { redirectToTrading } = this.props;
        const marketChangeColor = +(market.change || 0) < 0 ? 'negative' : 'positive';

        return (
            <tr key={index} onClick={() => redirectToTrading(market.id)}>
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
}
