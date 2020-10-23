import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { IntlProps } from '../../';
import { rootReducer } from '../../modules';
import { SignUpScreen } from '../SignUpScreen';

const store = createStore(rootReducer);
const SignUp = connect()(SignUpScreen);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <SignUp />
        </Provider>,
    );

describe('SignUpScreen', () => {
    const wrapper = setup();

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
