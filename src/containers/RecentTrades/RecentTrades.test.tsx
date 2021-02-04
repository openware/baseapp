import { shallow } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { RecentTrades } from '.';
import { rootReducer } from '../../modules';

const store = createStore(rootReducer);

const setup = () =>
    shallow(
        <Provider store={store}>
            <RecentTrades />
        </Provider>
    );

describe.skip('RecentTradesComponent', () => {
    let wrapper = setup();

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
