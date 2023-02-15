import * as React from 'react';
import { captchaLogin } from '../../api';
import { SignInComponent, SignInProps } from './';

import { shallow } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import { Button } from 'react-bootstrap';

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
    renderCaptcha: null,
    reCaptchaSuccess: false,
    geetestCaptchaSuccess: false,
    captcha_response: '',
};

const setup = (props: Partial<SignInProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <SignInComponent {...{ ...defaults, ...props }} />
        </TestComponentWrapper>,
    );

// TODO: We need to rewrite tests in order to test hooks
describe('SignIn component', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper.render()).toMatchSnapshot();
    });

    it('render correct title', () => {
        const wrapper = setup().render();
        expect(wrapper.find('.__selected').text()).toBe('Sign In');
    });

    it('should render logo block', () => {
        let wrapper = setup().render();
        const firstState = wrapper.find('.cr-sign-in-form__form-content').children();
        expect(firstState).toHaveLength(4);
        wrapper = setup({ image: 'image' }).render();
        const secondState = wrapper.find('.cr-sign-in-form__form-content').children();
        expect(secondState).toHaveLength(5);
    });

    it('should have correct labels', () => {
        const wrapper = setup({
            labelSignIn: 'label sign in',
            labelSignUp: 'label sign up',
        }).render();
        expect(wrapper.find('.__selected').text()).toBe('label sign in');
        expect(wrapper.find('.cr-sign-in-form__tab-signup').text()).toBe('label sign up');
    });

    it('should render error blocks', () => {
        const wrapper = setup({
            emailError: 'error email',
            passwordError: 'error password',
        }).render();
        expect(wrapper.find('.cr-sign-in-form__error').first().text()).toBe('error email');
        expect(wrapper.find('.cr-sign-in-form__error').last().text()).toBe('error password');
    });

    it.skip('should send request', () => {
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
        const button = wrapper.find(Button);
        button.simulate('click');
        expect(spyOnValidateForm).toHaveBeenCalledTimes(0);
        expect(spyOnRefreshError).toHaveBeenCalled();
        expect(spyOnSignIn).toHaveBeenCalled();
        expect(spyOnRefreshError).toHaveBeenCalledTimes(1);
        expect(spyOnSignIn).toHaveBeenCalledTimes(1);
    });

    it.skip('should validate form', () => {
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
        const button = wrapper.find(Button);
        button.simulate('click');
        expect(spyOnValidateForm).toHaveBeenCalled();
        expect(spyOnValidateForm).toHaveBeenCalledTimes(1);
        expect(spyOnRefreshError).toHaveBeenCalledTimes(0);
        expect(spyOnSignIn).toHaveBeenCalledTimes(0);
    });

    it('should have correct labels for input fields', () => {
        let wrapper = setup().render();
        expect(wrapper.find('.cr-sign-in-form__bottom-section-password').text()).toBe('Forgot your password?');
        wrapper = setup({ forgotPasswordLabel: 'label forgot password' }).render();
        expect(wrapper.find('.cr-sign-in-form__bottom-section-password').text()).toBe('label forgot password');
    });

    it('should render captcha block', () => {
        let wrapper = setup({
            captchaType: 'recaptcha',
            renderCaptcha: <div className="cr-sign-in-form__recaptcha">Content</div>,
        });
        captchaLogin()
            ? expect(wrapper.find('.cr-sign-in-form__recaptcha').exists()).toBe(true)
            : expect(wrapper.find('.cr-sign-in-form__recaptcha').exists()).toBe(false);
        wrapper = setup({
            captchaType: 'none',
            renderCaptcha: <div className="cr-sign-in-form__recaptcha">Content</div>,
        });
        expect(wrapper.find('.cr-sign-in-form__recaptcha').exists()).toBe(false);
    });
});
