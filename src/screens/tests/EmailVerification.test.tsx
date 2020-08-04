import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { IntlProps } from '../../index';
import { rootReducer } from '../../modules';
import { EmailVerificationScreen } from '../EmailVerification';

const store = createStore(rootReducer);
const EmailVerification = connect()(EmailVerificationScreen);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <EmailVerification />
        </Provider>,
    );

describe('EmailVerificationScreen', () => {
    const wrapper = setup();

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
