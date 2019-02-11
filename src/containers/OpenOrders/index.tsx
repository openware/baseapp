import { Loader, OpenOrders } from '@openware/components';
import classnames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl, intlShape } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDate, preciseData } from '../../helpers';
import { RootState } from '../../modules';
import { Market, selectCurrentMarket } from '../../modules/markets';
import {
    Order,
    orderCancelFetch,
    selectOpenOrders,
    selectOrdersLoading,
    userOrdersFetch,
} from '../../modules/orders';

interface ReduxProps {
    currentMarket: Market | undefined;
    openOrdersData: Order[];
    openOrdersLoading?: boolean;
}

interface DispatchProps {
    orderHistory: typeof userOrdersFetch;
    orderCancel: typeof orderCancelFetch;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

export class OpenOrdersContainer extends React.Component<Props> {
    //tslint:disable-next-line:no-any
    public static propsTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };
    public componentDidMount() {
        if (this.props.currentMarket){
            this.props.orderHistory({market: [this.props.currentMarket], state: 'wait'});
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (next.currentMarket && this.props.currentMarket !== next.currentMarket) {
            this.props.orderHistory({market: [next.currentMarket], state: 'wait'});
        }
    }

    public render() {
        const { openOrdersData, openOrdersLoading } = this.props;
        const classNames = classnames('pg-open-orders', {
            'pg-open-orders--empty': !openOrdersData.length,
            'pg-open-orders--loading': openOrdersLoading,
        });
        return (
            <div className={classNames}>
                <div className="cr-table-header__content">
                    <div className="cr-title-component"><FormattedMessage id="page.body.trade.header.openOrders" /></div>
                </div>
                {openOrdersLoading ? <Loader /> : this.openOrders()}
            </div>
        );
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    private renderHeaders = () => {
       return [
           this.translate('page.body.trade.header.openOrders.content.date'),
           this.translate('page.body.trade.header.openOrders.content.action'),
           this.translate('page.body.trade.header.openOrders.content.price'),
           this.translate('page.body.trade.header.openOrders.content.amount'),
           this.translate('page.body.trade.header.openOrders.content.total'),
           this.translate('page.body.trade.header.openOrders.content.filled'),
           '',
         ];
     }

    private openOrders = () => (
        <OpenOrders
            headers={this.renderHeaders()}
            data={this.renderData(this.props.openOrdersData)}
            onCancel={this.handleCancel}
        />
    );


    private static getDate = (time: string) => {
        return localeDate(time);
    };

    private renderData = (data: Order[]) => {
        const renderRow = item => {
          const { price, created_at, remaining_volume, origin_volume, kind, side, executed_volume, volume } = item;
          const resultSide = this.getType(side, kind);
          const remaining = remaining_volume || origin_volume;
          const total = remaining * price;
          const executed = executed_volume || (volume - remaining_volume);
          const filled = (executed / volume * 100).toFixed(2);
          const priceFixed = this.props.currentMarket ? this.props.currentMarket.bid_precision : 0;
          const amountFixed = this.props.currentMarket ? this.props.currentMarket.ask_precision : 0;

          return [OpenOrdersContainer.getDate(created_at), resultSide, preciseData(price, priceFixed), preciseData(remaining, amountFixed), preciseData(total, amountFixed), `${filled}%`, ''];
        };

        return (data.length > 0)
            ? this.sortDataByDateTime(data).map(renderRow)
            : [[this.translate('page.noDataToShow')]];
    };

    private getType = (side: string, kind: string) => {
        if (kind) {
            return kind;
        }

        return side === 'sell' ? this.props.intl.formatMessage({id: `page.body.trade.header.openOrders.content.ask`})
                                : this.props.intl.formatMessage({id: `page.body.trade.header.openOrders.content.bid`});
    }

    private sortDataByDateTime(data: Order[]) {
        const sortByDateTime = (a: Order, b: Order) =>
            moment(a.created_at) < moment(b.created_at) ? 1 : -1;
        const dataToSort = [...data];

        dataToSort.sort(sortByDateTime);
        return dataToSort;
    }

    private handleCancel = (index: number) => {
        const { openOrdersData } = this.props;
        const orderToDelete = this.sortDataByDateTime(openOrdersData)[index];
        this.props.orderCancel({ id: orderToDelete.id });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    openOrdersData: selectOpenOrders(state),
    openOrdersLoading: selectOrdersLoading(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        orderHistory: payload => dispatch(userOrdersFetch(payload)),
        orderCancel: payload => dispatch(orderCancelFetch(payload)),
    });

export type OpenOrdersProps = ReduxProps;

export const OpenOrdersComponent =
    injectIntl(connect(mapStateToProps, mapDispatchToProps)(OpenOrdersContainer));
