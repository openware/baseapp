import { shallow } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';
import { SignInForm, SignInFormProps, SignInFormState } from './SignInForm';

const defaults: SignInFormProps = {
    onForgotPassword: jest.fn(),
    onSignIn: jest.fn(),
    onSignUp: jest.fn(),
};

const setup = (props: Partial<SignInFormProps> = {}) =>
    shallow(<SignInForm {...{ ...defaults, ...props }} />);

describe('Sign in form', () => {
    let wrapper = setup();

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(wrapper.hasClass('cr-sign-in-form'));
    });

    it('should handle forgot onClick', () => {
        const onClick = spy();
        wrapper = setup({ onForgotPassword: onClick });
        wrapper.setState({ email: 'potato@heliostech.fr' });
        wrapper.find('.cr-sign-in-form__bottom-section-password').simulate('click');
        expect((onClick as SinonSpy).calledOnceWith('potato@heliostech.fr')).toBeTruthy();
    });

    it('should handle SignIn onClick', () => {
        const onClick = spy();
        wrapper = setup({ onSignIn: onClick });
        wrapper.setState({ email: 'potato@heliostech.fr', password: 'Potato3322' });
        wrapper.find('.cr-sign-in-form__button').simulate('click');
        expect((onClick as SinonSpy).calledOnceWith({email: 'potato@heliostech.fr', password: 'Potato3322'})).toBeTruthy();
    });

    it('should handle SignUp onClick', () => {
        const onClick = spy();
        wrapper = setup({ onSignUp: onClick });
        wrapper.find('.cr-sign-in-form__tab-signup').simulate('click');
        expect((onClick as SinonSpy).calledOnce).toBeTruthy();
    });

    it('should handle input valid email value', () => {
        wrapper.props().children.props.children[1].props.children[1].props.children[1].props.onChangeValue('potato@heliostech.fr');
        // @ts-ignore
        const state: SignInFormState = wrapper.state();
        expect(state.email).toEqual('potato@heliostech.fr');
    });

    it('should handle input valid password value', () => {
        // tslint:disable-next-line:no-magic-numbers
        wrapper.props().children.props.children[1].props.children[2].props.children[1].props.onChangeValue('Potato3322');
        // @ts-ignore
        const state: SignInFormState = wrapper.state();
        expect(state.password).toEqual('Potato3322');
    });

    it('should handle input invalid email value', () => {
        wrapper.setState({ email: 'potato', password: 'Potato3322' });
        wrapper.find('.cr-sign-in-form__button').simulate('click');
        // @ts-ignore
        const state: SignInFormState = wrapper.state();
        expect(state.emailError).toEqual('Email is invalid');
    });

    it('should handle input empty password value', () => {
        wrapper.setState({ email: 'potato@heliostech.fr', password: '' });
        wrapper.find('.cr-sign-in-form__button').simulate('click');
        // @ts-ignore
        const state: SignInFormState = wrapper.state();
        expect(state.passwordError).toEqual('Password is invalid');
    });

    it('should render Loader', () => {
        // tslint:disable-next-line:no-magic-numbers
        expect(wrapper.props().children.props.children[1].props.children[3].props.children[1].props.children).toBeNull();
        // tslint:disable-next-line:no-magic-numbers
        expect(wrapper.props().children.props.children[1].props.children[3].props.children[2].props.label).toEqual('Sign in');
        wrapper = setup({ isLoading: true });
        // tslint:disable-next-line:no-magic-numbers
        expect(wrapper.props().children.props.children[1].props.children[3].props.children[1].props.children).not.toBeNull();
        // tslint:disable-next-line:no-magic-numbers
        expect(wrapper.props().children.props.children[1].props.children[3].props.children[2].props.label).toEqual('Loading...');
    });

    it('should render image', () => {
        wrapper = setup({ image: 'qwer' });
        expect(wrapper.props().children.props.children[1].props.children[0].props.children.props.src).toEqual('qwer');
    });
});
