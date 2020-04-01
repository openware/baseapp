import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { TabPanel } from '../../components';
import { OrdersElement } from '../../containers/OrdersElement';
import { setDocumentTitle } from '../../helpers';
import {
    marketsFetch,
    ordersCancelAllFetch,
    resetOrdersHistory,
    RootState,
    selectOrdersHistory,
    selectUserLoggedIn,
} from '../../modules';
import {RangerConnectFetch, rangerConnectFetch} from '../../modules/public/ranger';
import {RangerState} from '../../modules/public/ranger/reducer';
import {selectRanger} from '../../modules/public/ranger/selectors';
import { OrderCommon } from '../../modules/types';

interface ReduxProps {
    list: OrderCommon[];
    rangerState: RangerState;
    userLoggedIn: boolean;
}

interface DispatchProps {
    marketsFetch: typeof marketsFetch;
    ordersCancelAll: typeof ordersCancelAllFetch;
    resetOrdersHistory: typeof resetOrdersHistory;
    rangerConnect: typeof rangerConnectFetch;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

interface State {
    tab: string;
    currentTabIndex: number;
}

class Orders extends React.PureComponent<Props, State> {
    public state = { tab: 'open', currentTabIndex: 0};

    public tabMapping = ['open', 'all'];

    public componentDidMount() {
        const {
            rangerState: {connected},
            userLoggedIn,
        } = this.props;

        setDocumentTitle('Orders');
        this.props.marketsFetch();

        if (!connected) {
            this.props.rangerConnect({withAuth: userLoggedIn});
        }
    }

    public componentWillUnmount() {
        this.props.resetOrdersHistory();
    }

    public render() {
        const cancelAll = this.props.list.length ? (
            <React.Fragment>
                <span onClick={this.handleCancelAll}>
                    <FormattedMessage id="page.body.openOrders.header.button.cancelAll" />
                    <span className="pg-orders-tab__close" />
                </span>
            </React.Fragment>
        ) : null;

        return (
            <div className="pg-orders-tab pg-container">
                <div className="pg-orders-tab__tabs-content">
                    <TabPanel
                        panels={this.renderTabs()}
                        onTabChange={this.handleMakeRequest}
                        optionalHead={cancelAll}
                        currentTabIndex={this.state.currentTabIndex}
                        onCurrentTabChange={this.onCurrentTabChange}
                    />
                </div>
            </div>
        );
    }

    private onCurrentTabChange = index => this.setState({ currentTabIndex: index });

    private handleMakeRequest = (index: number) => {
        this.renderTabs();
        if (this.state.tab === this.tabMapping[index]) {
            return;
        }
        this.props.resetOrdersHistory();
        this.setState({ tab: this.tabMapping[index] });
    };

    private renderTabs = () => {
        const { tab } = this.state;

        return [
            {
                content: tab === 'open' ? <OrdersElement type="open"/> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.openOrders.tab.open'}),
            },
            {
                content: tab === 'all' ? <OrdersElement type="all" /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.openOrders.tab.all'}),
            },
        ];
    };

    private handleCancelAll = () => this.props.ordersCancelAll();
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    list: selectOrdersHistory(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        marketsFetch: () => dispatch(marketsFetch()),
        ordersCancelAll: () => dispatch(ordersCancelAllFetch()),
        resetOrdersHistory: () => dispatch(resetOrdersHistory()),
        rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
    });

const OrdersTabScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(Orders));

export {
    OrdersTabScreen,
};
