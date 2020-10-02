import classnames from 'classnames';
import * as React from 'react';
import {
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { compose } from 'redux';
import { TabPanel } from '../../components';
import { IntlProps } from '../../index';
import {
    Market,
    PublicTrade,
    resetHistory,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    selectMobileDeviceState,
    selectUserLoggedIn,
    setCurrentPrice,
} from '../../modules';
import { recentTradesFetch, selectRecentTradesOfCurrentMarket } from '../../modules/public/recentTrades';
import { RecentTradesMarket } from './Market';
import { RecentTradesYours } from './Yours';

interface ReduxProps {
    recentTrades: PublicTrade[];
    currentMarket: Market | undefined;
    currentPrice: number | undefined;
    userLoggedIn: boolean;
    isMobileDevice: boolean;
}

interface DispatchProps {
    resetHistory: typeof resetHistory;
    tradesFetch: typeof recentTradesFetch;
    setCurrentPrice: typeof setCurrentPrice;
}

interface State {
    tab: string;
    index: number;
    disable: boolean;
}

export type RecentTradesProps = DispatchProps & ReduxProps & IntlProps;

class RecentTradesComponent extends React.Component<RecentTradesProps, State> {
    public state = { tab: 'market', index: 0, disable: false };

    public tabMapping = ['market', 'yours'];

    public componentWillUnmount() {
        this.props.resetHistory();
    }

    public render() {
        const className = classnames({
            'cr-table__noData' : !this.props.recentTrades.length,
        });

        const cn = classnames('pg-recent-trades', {
            'pg-recent-trades-unlogged' : !this.props.userLoggedIn,
        });

        return (
          <div className={className}>
            <div className={cn}>
                {this.renderContent()}
            </div>
          </div>
        );
    }

    private renderContent = () => {
        const { isMobileDevice } = this.props;

        return this.props.userLoggedIn ?
        (
            <TabPanel
                panels={this.renderTabs()}
                onTabChange={this.handleMakeRequest}
                optionalHead={this.props.intl.formatMessage({ id: 'page.body.trade.header.recentTrades' })}
                currentTabIndex={this.state.index}
                isMobileDevice={isMobileDevice}
            />
        ) :
        (
            <div>
                <div className="cr-table-header__content">
                    <div className="cr-title-component">{this.props.intl.formatMessage({id: 'page.body.trade.header.recentTrades'})}</div>
                </div>
                <RecentTradesMarket />
            </div>
        );

    };

    private renderTabs = () => {
        const { tab, index } = this.state;

        return [
            {
                content: tab === 'market' && index === 0 ? <RecentTradesMarket /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.market' }),
            },
            {
                content: tab === 'yours' ? <RecentTradesYours /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.yours' }),
            },
        ];
    };

    private handleMakeRequest = (index: number) => {
        if (this.state.tab === this.tabMapping[index]) {
            return;
        }

        this.setState({
            tab: this.tabMapping[index],
            index: index,
        });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    recentTrades: selectRecentTradesOfCurrentMarket(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
    userLoggedIn: selectUserLoggedIn(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    tradesFetch: market => dispatch(recentTradesFetch(market)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    resetHistory: () => dispatch(resetHistory()),
});

export const RecentTrades = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(RecentTradesComponent) as any; // tslint:disable-line
