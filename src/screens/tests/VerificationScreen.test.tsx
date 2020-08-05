import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { VerificationScreen } from '..';
import { IntlProps } from '../../index';
import { rootReducer } from '../../modules';
import { extractToken } from '../VerificationScreen';

const store = createStore(rootReducer);
const Verification = connect()(VerificationScreen);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <Verification />
        </Provider>,
    );


describe('ChangeForgottenPasswordScreen test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    const tokenProps = {
        location: {
            search: 'confirmation_token=123123',
        },
    };

    it('extract the token from search url', () => {
        expect(extractToken(tokenProps)).toEqual('123123');
    });
});
