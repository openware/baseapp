import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import {IntlProps} from '../../index';
import { rootReducer } from '../../modules';
import { ChangeForgottenPasswordScreen } from '../ChangeForgottenPasswordScreen';

const store = createStore(rootReducer);
const ChangeForgottenPasswordTab = connect()(ChangeForgottenPasswordScreen);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <ChangeForgottenPasswordTab/>
        </Provider>,
    );

describe('ChangeForgottenPasswordScreen test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
