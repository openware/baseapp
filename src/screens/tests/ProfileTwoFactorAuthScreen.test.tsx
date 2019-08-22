import { shallow } from 'enzyme';
import * as React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { ProfileTwoFactorAuthScreen } from '../';
import { rootReducer } from '../../modules';

const store = createStore(rootReducer);
const ProfileTwoFactorAuthTab = connect()(ProfileTwoFactorAuthScreen);

const setup = (props: Partial<InjectedIntlProps> = {}) =>
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
