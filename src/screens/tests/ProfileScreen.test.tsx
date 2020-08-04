import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { ProfileScreen } from '../';
import {IntlProps} from '../../index';
import { rootReducer } from '../../modules';

const store = createStore(rootReducer);
const ProfileTab = connect()(ProfileScreen);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <ProfileTab/>
        </Provider>,
    );

describe('ProfileScreen test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
