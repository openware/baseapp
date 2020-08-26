import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { IntlProps } from '../../index';
import { rootReducer } from '../../modules';
import { SignInScreen } from '../SignInScreen';

const store = createStore(rootReducer);
const Identity = connect()(SignInScreen);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <Identity />
        </Provider>,
    );

describe('SignInScreen', () => {
    const wrapper = setup();

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
