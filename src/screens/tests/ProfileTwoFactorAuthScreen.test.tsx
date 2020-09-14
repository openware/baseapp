import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { ProfileTwoFactorAuthScreen } from '../';
import { IntlProps } from '../../index';
import { rootReducer } from '../../modules';
import { PluginsManager } from '../../plugins/PluginsManager';

const Plugins = new PluginsManager();

const store = createStore(rootReducer(Plugins.getReduxReducer()));
const ProfileTwoFactorAuthTab = connect()(ProfileTwoFactorAuthScreen);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <ProfileTwoFactorAuthTab/>
        </Provider>,
    );

describe('ProfileTwoFactorAuthScreen test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
