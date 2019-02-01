import {
  TabPanel,
} from '@openware/components';
import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
} from 'react-redux';
import {
    depositsFetch,
    marketsFetch,
    tradesFetch,
    walletsFetch,
    withdrawsFetch,
} from '../../modules';
import { HistoryElement } from './component';

interface DispatchProps {
    fetchMarkets: typeof marketsFetch;
    fetchWallets: typeof walletsFetch;
    getDeposit: typeof depositsFetch;
    getTrade: typeof tradesFetch;
    getWithdraw: typeof withdrawsFetch;
}

type Props = DispatchProps;

class History extends React.Component<Props> {
    public componentDidMount() {
        this.props.fetchMarkets();
        this.props.fetchWallets();
        this.props.getDeposit();
    }

    public render() {
        return (
            <div className="pg-history-tab pg-container">
                <div className="pg-history-tab__tabs-content">
                    <TabPanel
                        panels={this.renderTabs()}
                        onTabChange={this.handleMakeRequest}
                    />
                </div>
            </div>
        );
    }

    private handleMakeRequest = (index: number) => {
        const tabs = this.renderTabs();
        tabs[index].loadData();
    };

    private renderTabs = () => {
        return [
            {
                content: <HistoryElement type="deposit" />,
                label: 'Deposit History',
                loadData: this.props.getDeposit,
            },
            {
                content: <HistoryElement type="withdraw"/>,
                label: 'Withdraw History',
                loadData: this.props.getWithdraw,
            },
            {
                content: <HistoryElement type="trade" />,
                label: 'Trade History',
                loadData: this.props.getTrade,
            },
        ];
    };

}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchWallets: () => dispatch(walletsFetch()),
    getDeposit: () => dispatch(depositsFetch()),
    getTrade: () => dispatch(tradesFetch()),
    getWithdraw: () => dispatch(withdrawsFetch()),
});

const HistoryTab = connect(null, mapDispatchToProps)(History);

export {
    HistoryTab,
};
