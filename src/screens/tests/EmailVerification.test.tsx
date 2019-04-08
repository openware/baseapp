import { shallow } from 'enzyme';
import * as React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from '../../modules';
import { EmailVerificationScreen } from '../EmailVerification';

const store = createStore(rootReducer);
const EmailVerification = connect()(EmailVerificationScreen);

const setup = (props: Partial<InjectedIntlProps> = {}) =>
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
