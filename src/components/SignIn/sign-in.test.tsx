import * as React from 'react';

import { shallow, ShallowWrapper } from 'enzyme';

import { Button } from 'react-bootstrap';

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
    let wrapper: ShallowWrapper;
    let rendered: cheerio.Cheerio;

    beforeAll(() => {
        wrapper = setup();
        rendered = wrapper.render();
    });

    it('should render', () => {
        expect(rendered).toMatchSnapshot();
    });

    it('render correct title', () => {
        expect(rendered.find('.__selected').text()).toBe('Sign In');
    });

    it('should render logo block', () => {
        const firstState = rendered.find('.cr-sign-in-form__form-content').children();
        expect(firstState).toHaveLength(4);
        rendered = setup({ image: 'image' }).render();
        const secondState = rendered.find('.cr-sign-in-form__form-content').children();
        expect(secondState).toHaveLength(5);
    });

    it('should have correct labels', () => {
        wrapper.setProps({ labelSignIn: 'label sign in', labelSignUp: 'label sign up' });
        rendered = wrapper.render();
        expect(rendered.find('.__selected').text()).toBe('label sign in');
        expect(rendered.find('.cr-sign-in-form__tab-signup').text()).toBe('label sign up');
    });

    it('should render error blocks', () => {
        wrapper.setProps({ emailError: 'error email', passwordError: 'error password' }).render();
        rendered = wrapper.render();
        expect(rendered.find('.cr-sign-in-form__error').first().text()).toBe('error email');
        expect(rendered.find('.cr-sign-in-form__error').last().text()).toBe('error password');
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
        const button = wrapper.find(Button);
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
        const button = wrapper.find(Button);
        button.simulate('click');
        expect(spyOnValidateForm).toHaveBeenCalled();
        expect(spyOnValidateForm).toHaveBeenCalledTimes(1);
        expect(spyOnRefreshError).toHaveBeenCalledTimes(0);
        expect(spyOnSignIn).toHaveBeenCalledTimes(0);
    });
});
