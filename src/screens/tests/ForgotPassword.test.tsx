import { shallow } from 'enzyme';
import * as React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from '../../modules';
import { ForgotPasswordScreen } from '../ForgotPassword';

const store = createStore(rootReducer);
const ForgotPassword = connect()(ForgotPasswordScreen);

const setup = (props: Partial<InjectedIntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <ForgotPassword />
        </Provider>,
    );

describe('ForgotPasswordScreen', () => {
    const wrapper = setup();

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
