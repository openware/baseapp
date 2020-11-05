import * as React from 'react';

import { shallow } from 'enzyme';

import { SignInComponent, SignInProps } from '.';

const defaults: SignInProps = {
    onForgotPassword: jest.fn(),
    onSignUp: jest.fn(),
    onSignIn: jest.fn(),
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    emailFocused: false,
    emailPlaceholder: '',
    passwordFocused: false,
    passwordPlaceholder: '',
    isFormValid: jest.fn(),
    refreshError: jest.fn(),
    handleChangeFocusField: jest.fn(),
    changePassword: jest.fn(),
    changeEmail: jest.fn(),
};

const setup = (props: Partial<SignInProps> = {}) => shallow(<SignInComponent {...{ ...defaults, ...props }} />);

// TODO: We need to rewrite tests in order to test hooks
describe('<SignInComponent />', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper.render()).toMatchSnapshot();
    });
});
