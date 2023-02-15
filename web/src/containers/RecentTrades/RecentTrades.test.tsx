import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { RecentTrades } from '..';
import { rootReducer } from '../../modules';

const defaultProps: {
    recentTrades: any[];
    currentMarket: undefined;
    userLoggedIn: boolean;
    currentPrice: undefined;
} = {
    recentTrades: [],
    currentMarket: undefined,
    currentPrice: undefined,
    userLoggedIn: true,
};

const store = createStore(rootReducer);
const RecentTradesComponent = connect()(RecentTrades);

const setup = () =>
    shallow(
        <Provider store={store}>
            <RecentTradesComponent {...{ ...defaultProps }} />
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
