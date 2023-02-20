import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { captchaLogin } from 'src/api';
import { TestComponentWrapper } from 'src/lib/test';
import { SignInComponent, SignInProps } from './';

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

const renderComponent = (props: Partial<SignInProps> = {}) =>
    render(
        <TestComponentWrapper>
            <SignInComponent {...{ ...defaults, ...props }} />
        </TestComponentWrapper>,
    );

describe('SignIn component', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('render correct title', () => {
        renderComponent();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('should render logo block', () => {
        const { rerender, container } = renderComponent();
        const firstState = container.querySelector('.cr-sign-in-form__form-content');
        expect(firstState.childElementCount).toEqual(4);

        rerender(
            <TestComponentWrapper>
                <SignInComponent {...{ ...defaults, image: 'image' }} />
            </TestComponentWrapper>,
        );
        const secondState = container.querySelector('.cr-sign-in-form__form-content');
        expect(secondState.childElementCount).toEqual(5);
    });

    it('should have correct labels', () => {
        renderComponent({
            labelSignIn: 'label sign in',
            labelSignUp: 'label sign up',
        });

        expect(screen.getAllByText('label sign in')).toBeDefined();
        expect(screen.getByText('label sign up')).toBeInTheDocument();
    });

    it('should render error blocks', () => {
        renderComponent({
            emailError: 'error email',
            passwordError: 'error password',
        });

        expect(screen.getByText('error email')).toBeInTheDocument();
        expect(screen.getByText('error password')).toBeInTheDocument();
    });

    it('should send request', () => {
        const spyOnValidateForm = jest.fn();
        const spyOnRefreshError = jest.fn();
        const spyOnSignIn = jest.fn();

        renderComponent({
            email: 'email@email.com',
            password: 'Qwerty123',
            isFormValid: spyOnValidateForm,
            refreshError: spyOnRefreshError,
            onSignIn: spyOnSignIn,
        });

        fireEvent.click(screen.getByRole('button'));
        expect(spyOnValidateForm).toHaveBeenCalledTimes(0);
        expect(spyOnRefreshError).toHaveBeenCalled();
        expect(spyOnSignIn).toHaveBeenCalled();
        expect(spyOnRefreshError).toHaveBeenCalledTimes(1);
        expect(spyOnSignIn).toHaveBeenCalledTimes(1);
    });

    it('should have correct labels for input fields', () => {
        const { rerender } = renderComponent();
        expect(screen.getByText('Forgot your password?')).toBeInTheDocument();

        rerender(
            <TestComponentWrapper>
                <SignInComponent {...{ ...defaults, forgotPasswordLabel: 'label forgot password' }} />
            </TestComponentWrapper>,
        );
        expect(screen.getByText('label forgot password')).toBeInTheDocument();
    });

    it('should render captcha block', () => {
        const { container, rerender } = renderComponent({
            captchaType: 'recaptcha',
            renderCaptcha: <div className="cr-sign-in-form__recaptcha">Content</div>,
        });
        captchaLogin()
            ? expect(container.querySelector('.cr-sign-in-form__recaptcha')).toBeInTheDocument()
            : expect(container.querySelector('.cr-sign-in-form__recaptcha')).not.toBeInTheDocument();

        rerender(
            <TestComponentWrapper>
                <SignInComponent
                    {...{
                        ...defaults,
                        captchaType: 'none',
                        renderCaptcha: <div className="cr-sign-in-form__recaptcha">Content</div>,
                    }}
                />
            </TestComponentWrapper>,
        );
        expect(container.querySelector('.cr-sign-in-form__recaptcha')).not.toBeInTheDocument();
    });
});
