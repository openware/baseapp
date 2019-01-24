import { shallow } from 'enzyme';
import * as React from 'react';
import {connect, Provider} from 'react-redux';
import { createStore } from 'redux';
import { VerificationScreen } from '..';
import { rootReducer } from '../../modules';
import { extractToken, RouterProps } from '../VerificationScreen';

const defaultProps: RouterProps = {
    location: {
        search: '',
    },
};

const store = createStore(rootReducer);
const Verification = connect()(VerificationScreen);

const setup = (props: Partial<RouterProps> = {}) =>
      shallow(<Provider store={store}><Verification  {...{ ...defaultProps, ...props }}/></Provider>);

describe('VerificationScreen test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    const tokenProps = {
        location: {
            search: 'confirmation_token=123123',
        },
    };
    it('should fetch token correctly', () => {
        const wrapper = setup(tokenProps);
        expect(wrapper.props().location.search).toEqual(tokenProps.location.search);
    });

    it('extract the token from search url', () => {
        expect(extractToken(tokenProps)).toEqual('123123');
    });
});
