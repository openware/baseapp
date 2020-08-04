import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { OrdersTabScreen } from '../';
import {IntlProps} from '../../index';
import { rootReducer } from '../../modules';

const store = createStore(rootReducer);
const OrdersTab = connect()(OrdersTabScreen);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <OrdersTab />
        </Provider>,
    );

describe('OrdersTabScreen test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
