import * as React from 'react';
import { SignUpForm, SignUpFormProps, SignUpFormState } from './SignUpForm';

import { shallow } from 'enzyme';
import { SinonSpy, spy } from 'sinon';

const defaults: SignUpFormProps = {
    onSignUp: jest.fn(),
    captchaType: 'none',
};

const setup = (props: Partial<SignUpFormProps> = {}) =>
    shallow(<SignUpForm {...{ ...defaults, ...props }} />);

describe('Sign in form', () => {
    let wrapper = setup();

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(wrapper.hasClass('cr-sign-up-form'));
    });

    it('should handle SignIn onClick', () => {
        const onClick = spy();
        wrapper = setup({ onSignIn: onClick });
        wrapper.find('.cr-sign-in-form__tab-signin').simulate('click');
        expect((onClick as SinonSpy).calledOnce).toBeTruthy();
    });

    it('should handle SignUp onClick when checkbox not confirmed', () => {
        const onClick = spy();
        wrapper = setup({ onSignUp: onClick });
        wrapper.find('.cr-sign-up-form__button').simulate('click');
        expect((onClick as SinonSpy).calledOnce).toBeFalsy();
    });

    it('should handle SignUp onClick when all checks confirmed', () => {
        const onClick = spy();
        wrapper = setup({ onSignUp: onClick });
        wrapper.setState({ hasConfirmed: true, email: 'potato@heliostech.fr', password: 'Potato322', confirmPassword: 'Potato322' });
        wrapper.find('.cr-sign-up-form__button').simulate('click');
        expect((onClick as SinonSpy).calledOnce).toBeTruthy();
    });

    it('should handle input valid email value', () => {
        wrapper.props().children.props.children[1].props.children[1].props.children[1].props.onChangeValue('potato@heliostech.fr');
        // @ts-ignore
        expect(wrapper.state().email).toEqual('potato@heliostech.fr');
    });

    it('should handle input valid password value', () => {
        // tslint:disable-next-line:no-magic-numbers
        wrapper.props().children.props.children[1].props.children[2].props.children[1].props.onChangeValue('Potato3322');
        // tslint:disable-next-line:no-magic-numbers
        wrapper.props().children.props.children[1].props.children[3].props.children[1].props.onChangeValue('Potato3322');
        // @ts-ignore
        const state: SignUpFormState = wrapper.state();
        expect(state.password).toEqual('Potato3322');
        expect(state.confirmPassword).toEqual('Potato3322');
    });

    it('should handle input invalid email value', () => {
        wrapper.setState({ hasConfirmed: true, email: 'potato', password: 'Potato322', confirmPassword: 'Potato322' });
        wrapper.find('.cr-sign-up-form__button').simulate('click');
        // @ts-ignore
        expect(wrapper.state().emailError).toEqual('Email is invalid');
    });

    it('should handle input invalid password value', () => {
        wrapper.setState({ hasConfirmed: true, email: 'potato@heliostech.fr', password: ' ', confirmPassword: ' ' });
        wrapper.find('.cr-sign-up-form__button').simulate('click');
        // @ts-ignore
        expect(wrapper.state().passwordError).toEqual('Password must contain at least 8 symbols, at least one capital letter and a digit');
    });

    it('should handle input different password values', () => {
        wrapper.setState({ hasConfirmed: true, email: 'potato@heliostech.fr', password: 'Potato123', confirmPassword: 'Potato456' });
        wrapper.find('.cr-sign-up-form__button').simulate('click');
        // @ts-ignore
        expect(wrapper.state().passwordError).toEqual('');
    });

    it('should handle checkbox event', () => {
        // tslint:disable-next-line:no-magic-numbers
        wrapper.props().children.props.children[1].props.children[5].props.onChange();
        // @ts-ignore
        expect(wrapper.state().hasConfirmed).toEqual(true);
    });
});
