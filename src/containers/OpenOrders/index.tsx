import { Loader, OpenOrders } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeFullDate, preciseData, setTradeColor } from '../../helpers';
import {
    Market,
    openOrdersCancelFetch,
    RootState,
    selectCancelOpenOrdersFetching,
    selectCurrentMarket,
    selectOpenOrdersFetching,
    selectOpenOrdersList,
    selectUserLoggedIn,
    userOpenOrdersFetch,
} from '../../modules';
import { OrderCommon } from '../../modules/types';

interface ReduxProps {
    currentMarket: Market | undefined;
    list: OrderCommon[];
    fetching: boolean;
    cancelFetching: boolean;
    userLoggedIn: boolean;
}

interface DispatchProps {
    userOpenOrdersFetch: typeof userOpenOrdersFetch;
    openOrdersCancelFetch: typeof openOrdersCancelFetch;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

export class OpenOrdersContainer extends React.Component<Props> {
    public componentDidMount() {
        const { currentMarket, userLoggedIn } = this.props;
        if (userLoggedIn && currentMarket) {
            this.props.userOpenOrdersFetch({ market: currentMarket });
        }
    }

    public componentWillReceiveProps(next: Props) {
        const { userLoggedIn, currentMarket } = next;
        const { userLoggedIn: prevUserLoggedIn, currentMarket: prevCurrentMarket } = this.props;

        if (!prevUserLoggedIn && userLoggedIn && currentMarket) {
            this.props.userOpenOrdersFetch({ market: currentMarket });
        } else if (userLoggedIn && currentMarket && prevCurrentMarket !== currentMarket) {
            this.props.userOpenOrdersFetch({ market: currentMarket });
        }
    }

    public render() {
        const { list, fetching } = this.props;
        const classNames = classnames('pg-open-orders', {
            'pg-open-orders--empty': !list.length,
            'pg-open-orders--loading': fetching,
        });
        return (
            <div className={classNames}>
                <div className="cr-table-header__content">
                    <div className="cr-title-component">
                        <FormattedMessage id="page.body.trade.header.openOrders" />
                    </div>
                </div>
                {fetching ? <Loader /> : this.openOrders()}
            </div>
        );
    }

    private renderHeadersKeys = () => {
        return [
            'Date',
            'Price',
            'Amount',
            'Total',
            'Filled',
            '',
        ];
    };

    private renderHeaders = () => {
        const currentAskUnit = this.props.currentMarket ? ` (${this.props.currentMarket.ask_unit.toUpperCase()})` : null;
        const currentBidUnit = this.props.currentMarket ? ` (${this.props.currentMarket.bid_unit.toUpperCase()})` : null;
        return [
            this.translate('page.body.trade.header.openOrders.content.date'),
            this.translate('page.body.trade.header.openOrders.content.price').concat(currentBidUnit),
            this.translate('page.body.trade.header.openOrders.content.amount').concat(currentAskUnit),
            this.translate('page.body.trade.header.openOrders.content.total').concat(currentBidUnit),
            this.translate('page.body.trade.header.openOrders.content.filled'),
            '',
        ];
    };

    private openOrders = () => {
        return (
            <OpenOrders
                headersKeys={this.renderHeadersKeys()}
                headers={this.renderHeaders()}
                data={this.renderData()}
                onCancel={this.handleCancel}
            />
        );
    };

    private renderData = () => {
        const { list, currentMarket } = this.props;

        if (list.length === 0) {
            return [[this.translate('page.noDataToShow')]];
        }

        return list.map((item: OrderCommon) => {
            const { id, price, created_at, remaining_volume, origin_volume, side } = item;
            const executedVolume = Number(origin_volume) - Number(remaining_volume);
            const remainingAmount = Number(remaining_volume);
            const total = Number(origin_volume) * Number(price);
            const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
            const priceFixed = currentMarket ? currentMarket.bid_precision : 0;
            const amountFixed = currentMarket ? currentMarket.ask_precision : 0;

            return [
                localeFullDate(created_at),
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(price, priceFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(remainingAmount, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(total, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{filled}%</span>,
                side,
            ];
        });
    };

    private translate = (e: string) => this.props.intl.formatMessage({ id: e });

    private handleCancel = (index: number) => {
        const { list, cancelFetching } = this.props;
        if (cancelFetching) {
            return;
        }
        const orderToDelete = list[index];
        this.props.openOrdersCancelFetch({ id: orderToDelete.id, list });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    list: selectOpenOrdersList(state),
    fetching: selectOpenOrdersFetching(state),
    cancelFetching: selectCancelOpenOrdersFetching(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    userOpenOrdersFetch: payload => dispatch(userOpenOrdersFetch(payload)),
    openOrdersCancelFetch: payload => dispatch(openOrdersCancelFetch(payload)),
});

export type OpenOrdersProps = ReduxProps;

export const OpenOrdersComponent = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(OpenOrdersContainer),
);
