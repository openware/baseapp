import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import {IntlProps} from '../../index';
import { rootReducer } from '../../modules';
import { ConfirmScreen } from '../ConfirmScreen';


const store = createStore(rootReducer);
const ConfirmTab = connect()(ConfirmScreen);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <ConfirmTab/>
        </Provider>,
    );

describe('ConfirmScreen test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
