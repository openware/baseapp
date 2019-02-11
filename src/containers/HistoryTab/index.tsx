import { TabPanel } from '@openware/components';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
} from 'react-redux';
import {
    fetchHistory,
    marketsFetch,
    resetHistory,
    walletsFetch,
} from '../../modules';
import { HistoryElement } from './HistoryElement';


interface DispatchProps {
    resetHistory: typeof resetHistory;
    fetchMarkets: typeof marketsFetch;
    fetchWallets: typeof walletsFetch;
    fetchHistory: typeof fetchHistory;
}

type Props = DispatchProps & InjectedIntlProps;

interface State {
    tab: string;
}

class History extends React.Component<Props, State> {
    //tslint:disable-next-line:no-any
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    public state = { tab: 'deposits' };

    public tabMapping = ['deposits', 'withdraws', 'trades'];

    public componentDidMount() {
        this.props.fetchMarkets();
        this.props.fetchWallets();
    }

    public componentWillUnmount() {
        this.props.resetHistory();
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
        if (this.state.tab === this.tabMapping[index]) {
            return;
        }
        this.props.resetHistory();
        this.setState({ tab: this.tabMapping[index] });
    };

    private renderTabs = () => {
        const { tab } = this.state;
        return [
            {
                content: tab === 'deposits' ? <HistoryElement type="deposits" /> : null,
                label: this.props.intl.formatMessage({id: 'page.body.history.deposit'}),
            },
            {
                content: tab === 'withdraws' ? <HistoryElement type="withdraws" /> : null,
                label: this.props.intl.formatMessage({id: 'page.body.history.withdraw'}),
            },
            {
                content: tab === 'trades' ? <HistoryElement type="trades" /> : null,
                label: this.props.intl.formatMessage({id: 'page.body.history.trade'}),
            },
        ];
    };
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchWallets: () => dispatch(walletsFetch()),
    fetchHistory: payload => dispatch(fetchHistory(payload)),
    resetHistory: () => dispatch(resetHistory()),
});

const HistoryTab = injectIntl(connect(null, mapDispatchToProps)(History));

export {
    HistoryTab,
};
