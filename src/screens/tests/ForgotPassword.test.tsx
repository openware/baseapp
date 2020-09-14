import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { IntlProps } from '../../index';
import { rootReducer } from '../../modules';
import { PluginsManager } from '../../plugins/PluginsManager';
import { ForgotPasswordScreen } from '../ForgotPassword';

const Plugins = new PluginsManager();

const store = createStore(rootReducer(Plugins.getReduxReducer()));
const ForgotPassword = connect()(ForgotPasswordScreen);

const setup = (props: Partial<IntlProps> = {}) =>
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
