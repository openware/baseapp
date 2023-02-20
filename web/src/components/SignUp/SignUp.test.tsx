import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { SignUpForm, SignUpFormProps } from './';

const defaults: SignUpFormProps = {
    onSignUp: jest.fn(),
    refId: '',
    password: '',
    email: '',
    username: '',
    confirmPassword: '',
    handleChangeUsername: jest.fn(),
    handleChangeEmail: jest.fn(),
    handleChangePassword: jest.fn(),
    handleChangeConfirmPassword: jest.fn(),
    handleChangeRefId: jest.fn(),
    hasConfirmed: false,
    clickCheckBox: jest.fn(),
    validateForm: jest.fn(),
    emailError: '',
    passwordError: '',
    confirmationError: '',
    handleFocusEmail: jest.fn(),
    handleFocusPassword: jest.fn(),
    handleFocusUsername: jest.fn(),
    handleFocusConfirmPassword: jest.fn(),
    handleFocusRefId: jest.fn(),
    confirmPasswordFocused: false,
    refIdFocused: false,
    usernameFocused: false,
    emailFocused: false,
    passwordFocused: false,
    renderCaptcha: null,
    reCaptchaSuccess: false,
    geetestCaptchaSuccess: false,
    captcha_response: '',
    currentPasswordEntropy: 0,
    passwordErrorFirstSolved: false,
    passwordErrorSecondSolved: false,
    passwordErrorThirdSolved: false,
    passwordPopUp: false,
    myRef: null,
    passwordWrapper: null,
    translate: jest.fn(),
};

const renderComponent = (props: Partial<SignUpFormProps> = {}) =>
    render(
        <TestComponentWrapper>
            <SignUpForm {...{ ...defaults, ...props }} />
        </TestComponentWrapper>,
    );

describe('SignUp component', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should render logo block', () => {
        const { rerender, container } = renderComponent();
        const firstState = container.querySelector('.cr-sign-up-form__form-content');
        expect(firstState.childElementCount).toEqual(6);

        rerender(
            <TestComponentWrapper>
                <SignUpForm {...{ ...defaults, image: 'image' }} />
            </TestComponentWrapper>,
        );
        const secondState = container.querySelector('.cr-sign-up-form__form-content');
        expect(secondState.childElementCount).toEqual(7);
    });

    it('should render captcha block', () => {
        expect(renderComponent().container.querySelector('.cr-sign-up-form__recaptcha')).not.toBeInTheDocument();
    });

    it('should have correct labels', () => {
        renderComponent({
            labelSignIn: 'label sign in',
            labelSignUp: 'label sign up',
        });

        expect(screen.getAllByText('label sign in')).toBeDefined();
        expect(screen.getAllByText('label sign up')).toBeDefined();
    });

    it('should render error blocks', () => {
        renderComponent({
            emailError: 'error email',
            confirmationError: 'error refid',
        });

        expect(screen.getByText('error email')).toBeInTheDocument();
        expect(screen.getByText('error refid')).toBeInTheDocument();
    });

    it('should send request', () => {
        const spyOnValidateForm = jest.fn();
        const spyOnSignUp = jest.fn();

        renderComponent({
            email: 'email@email.com',
            password: 'Qwerty123',
            confirmPassword: 'Qwerty123',
            hasConfirmed: true,
            validateForm: spyOnValidateForm,
            onSignUp: spyOnSignUp,
        });

        fireEvent.click(screen.getByRole('button'));
        expect(spyOnValidateForm).toHaveBeenCalledTimes(0);
        expect(spyOnSignUp).toHaveBeenCalled();
        expect(spyOnSignUp).toHaveBeenCalledTimes(1);
    });
});
