import { Spinner } from 'react-bootstrap';
import classnames from 'classnames';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Decimal, Table } from '../../components';
import { localeDate, setTradesType } from '../../helpers';
import {
    fetchHistory,
    Market,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    selectFullHistory,
    selectHistory,
    selectHistoryLoading,
    selectMarkets,
    setCurrentPrice,
    WalletHistoryList,
} from '../../modules';
import { handleHighlightValue } from './Market';

interface ReduxProps {
    marketsData: Market[];
    list: WalletHistoryList;
    fetching: boolean;
    fullHistory: number;
    currentMarket: Market | undefined;
    currentPrice: number | undefined;
}

interface DispatchProps {
    fetchHistory: typeof fetchHistory;
    setCurrentPrice: typeof setCurrentPrice;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

const timeFrom = Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000);

class YoursComponent extends React.Component<Props> {

    public componentDidMount() {
        const { currentMarket } = this.props;
        if (currentMarket) {
            this.props.fetchHistory({ type: 'trades', page: 0, time_from: timeFrom, market: currentMarket.id});
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (next.currentMarket && this.props.currentMarket !== next.currentMarket) {
            this.props.fetchHistory({ type: 'trades', page: 0, time_from: timeFrom, market: next.currentMarket.id });
        }
    }

    public render() {
        const { fetching } = this.props;
        const className = classnames({
            'cr-tab-content__noData': this.retrieveData()[0][1] === this.props.intl.formatMessage({ id: 'page.noDataToShow' }),
        });

        return (
            <div className={className}>
                {fetching ? <div className="cr-tab-content-loading"><Spinner animation="border" variant="primary" /></div> : this.renderContent()}
            </div>
        );
    }

    public renderContent = () => {
        return (
            <React.Fragment>
                <Table
                    header={this.getHeaders()}
                    data={this.retrieveData()}
                    onSelect={this.handleOnSelect}
                />
            </React.Fragment>
        );
    };

    private getHeaders = () => {
        return [
            this.props.intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.time' }),
            this.props.intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' }),
            this.props.intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' }),
        ];
    };

    private retrieveData = () => {
        const { list } = this.props;
        return [...list].length > 0
            ? [...list].map(this.renderRow)
            : [[[''], this.props.intl.formatMessage({ id: 'page.noDataToShow' })]];
    };

    private renderRow = (item, i) => {
        const { currentMarket, list } = this.props;
        const { id, created_at, price, amount, side } = item;
        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed = currentMarket ? currentMarket.amount_precision : 0;
        const orderSide = side === 'sell' ?  'sell' : 'buy';
        const higlightedDate = handleHighlightValue(String(localeDate([...list][i - 1] ? [...list][i - 1].created_at : '', 'time')), String(localeDate(created_at, 'time')));

        return [
            <span style={{ color: setTradesType(orderSide).color }} key={id}>{higlightedDate}</span>,
            <span style={{ color: setTradesType(orderSide).color }} key={id}><Decimal key={id} fixed={amountFixed}>{amount}</Decimal></span>,
            <span style={{ color: setTradesType(orderSide).color }} key={id}><Decimal key={id} fixed={priceFixed} prevValue={[...list][i - 1] ? [...list][i - 1].price : 0}>{price}</Decimal></span>,
        ];
    };

    private handleOnSelect = (index: string) => {
        const { list, currentPrice } = this.props;
        const priceToSet = list[Number(index)] ? list[Number(index)].price : '';

        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    marketsData: selectMarkets(state),
    list: selectHistory(state),
    fetching: selectHistoryLoading(state),
    fullHistory: selectFullHistory(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchHistory: params => dispatch(fetchHistory(params)),
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    });

const YoursTab = injectIntl(connect(mapStateToProps, mapDispatchToProps)(YoursComponent));

export {
    YoursTab,
};
