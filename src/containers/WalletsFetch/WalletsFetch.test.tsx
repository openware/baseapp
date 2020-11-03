import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

import { IntlProps } from '../../';
import { rootReducer } from '../../modules';
import { WalletsFetch } from './';

const store = createStore(rootReducer);
const Wallets = connect()(WalletsFetch);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <Wallets />
        </Provider>
    );

describe('WalletsFetch component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = setup();
    });
    it('should render', () => {
        expect(wrapper).toBeDefined();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
