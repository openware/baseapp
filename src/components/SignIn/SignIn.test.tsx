import * as React from 'react';
import { SignInComponent, SignInProps } from './';

import { shallow } from 'enzyme';

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

const setup = (props: Partial<SignInProps> = {}) =>
    shallow(<SignInComponent {...{...defaults, ...props }} />);

describe('SignIn component', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('renders without crashing', () => {
        const wrapper = setup();
        expect(wrapper).toBeDefined();
    });

    it('render correct title', () => {
        const wrapper = setup();
        expect(wrapper.find('.__selected').text()).toBe('Sign In');
    });

    it('should render logo block', () => {
        let wrapper = setup();
        const firstState = wrapper.find('.cr-sign-in-form__form-content').children();
        expect(firstState).toHaveLength(4);
        wrapper = setup({ image: 'image'});
        const secondState  = wrapper.find('.cr-sign-in-form__form-content').children();
        expect(secondState).toHaveLength(5);
    });

    it('should have correct labels', () => {
        const wrapper = setup({ labelSignIn: 'label sign in', labelSignUp: 'label sign up'});
        expect(wrapper.find('.__selected').text()).toBe('label sign in');
        expect(wrapper.find('.cr-sign-in-form__tab-signup').text()).toBe('label sign up');
    });

    it('should have correct labels for input fields', () => {
        const wrapper = setup({emailLabel: 'label email', passwordLabel: 'label password'});
        expect(wrapper.find('.cr-sign-in-form__label').first().text()).toBe('label email');
        expect(wrapper.find('.cr-sign-in-form__label').last().text()).toBe('label password');
    });

    it('should render error blocks', () => {
        const wrapper = setup({emailError: 'error email', passwordError: 'error password'});
        expect(wrapper.find('.cr-sign-in-form__error').first().text()).toBe('error email');
        expect(wrapper.find('.cr-sign-in-form__error').last().text()).toBe('error password');
    });

    it('should render loading', () => {
        const wrapper = setup({ isLoading: true });
        expect(wrapper.find('.cr-sign-in-form__loader').children()).toHaveLength(1);
    });

    it('should stay focused', () => {
        const spyOnHandleFocusField = jest.fn();
        const wrapper = setup({handleChangeFocusField: spyOnHandleFocusField});
        wrapper.find('.cr-sign-in-form__input').first().simulate('focus');
        expect(spyOnHandleFocusField).toHaveBeenCalled();
        expect(spyOnHandleFocusField).toHaveBeenCalledTimes(1);
        let args = 'email';
        expect(spyOnHandleFocusField).toHaveBeenCalledWith(args);
        wrapper.find('.cr-sign-in-form__input').last().simulate('focus');
        expect(spyOnHandleFocusField).toHaveBeenCalled();
        expect(spyOnHandleFocusField).toHaveBeenCalledTimes(2);
        args = 'password';
        expect(spyOnHandleFocusField).toHaveBeenCalledWith(args);
    });

    it('should handle blur event', () => {
        const spyOnHandleFocusField = jest.fn();
        const wrapper = setup({handleChangeFocusField: spyOnHandleFocusField});
        wrapper.find('.cr-sign-in-form__input').first().simulate('blur');
        expect(spyOnHandleFocusField).toHaveBeenCalled();
        expect(spyOnHandleFocusField).toHaveBeenCalledTimes(1);
        let args = 'email';
        expect(spyOnHandleFocusField).toHaveBeenCalledWith(args);
        wrapper.find('.cr-sign-in-form__input').last().simulate('blur');
        expect(spyOnHandleFocusField).toHaveBeenCalled();
        expect(spyOnHandleFocusField).toHaveBeenCalledTimes(2);
        args = 'password';
        expect(spyOnHandleFocusField).toHaveBeenCalledWith(args);
    });

    it('should send request', () => {
        const spyOnValidateForm = jest.fn();
        const spyOnRefreshError = jest.fn();
        const spyOnSignIn = jest.fn();
        const wrapper = setup({
            email: 'email@email.com',
            password: 'Qwerty123',
            isFormValid: spyOnValidateForm,
            refreshError: spyOnRefreshError,
            onSignIn: spyOnSignIn,
        });
        const button = wrapper.find('.cr-sign-in-form__button').last();
        button.simulate('click');
        expect(spyOnValidateForm).toHaveBeenCalledTimes(0);
        expect(spyOnRefreshError).toHaveBeenCalled();
        expect(spyOnSignIn).toHaveBeenCalled();
        expect(spyOnRefreshError).toHaveBeenCalledTimes(1);
        expect(spyOnSignIn).toHaveBeenCalledTimes(1);
    });

    it('should validate form', () => {
        const spyOnValidateForm = jest.fn();
        const spyOnRefreshError = jest.fn();
        const spyOnSignIn = jest.fn();
        const wrapper = setup({
            email: 'email',
            password: 'Qwerty123',
            refreshError: spyOnRefreshError,
            onSignIn: spyOnSignIn,
            isFormValid: spyOnValidateForm,
        });
        const button = wrapper.find('.cr-sign-in-form__button').last();
        button.simulate('click');
        expect(spyOnValidateForm).toHaveBeenCalled();
        expect(spyOnValidateForm).toHaveBeenCalledTimes(1);
        expect(spyOnRefreshError).toHaveBeenCalledTimes(0);
        expect(spyOnSignIn).toHaveBeenCalledTimes(0);
    });

    it('should have correct labels for input fields', () => {
        let wrapper = setup();
        expect(wrapper.find('.cr-sign-in-form__bottom-section-password').text()).toBe('Forgot your password?');
        wrapper = setup({forgotPasswordLabel: 'label forgot password'});
        expect(wrapper.find('.cr-sign-in-form__bottom-section-password').text()).toBe('label forgot password');
    });
});
