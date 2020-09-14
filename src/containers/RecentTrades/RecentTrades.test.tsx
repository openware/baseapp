import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { RecentTrades, RecentTradesProps } from '..';
import { rootReducer } from '../../modules';
import { PluginsManager } from '../../plugins/PluginsManager';

const defaultProps: { recentTrades: any[]; currentMarket: undefined; userLoggedIn: boolean; currentPrice: undefined } = {
    recentTrades: [],
    currentMarket: undefined,
    currentPrice: undefined,
    userLoggedIn: true,
};

const Plugins = new PluginsManager();

const store = createStore(rootReducer(Plugins.getReduxReducer()));
const RecentTradesComponent = connect()(RecentTrades);

const setup = (props: Partial<RecentTradesProps> = {}) =>
    shallow(
        <Provider store={store}>
            <RecentTradesComponent {...{ ...defaultProps, ...props }} />
        </Provider>,
    );

describe('RecentTradesComponent', () => {
    let wrapper = setup();

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
