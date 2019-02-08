import { shallow } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';
import { EmailForm, EmailFormProps } from './EmailForm';

const defaults: EmailFormProps = {
    OnSubmit: jest.fn(),
};

const setup = (props: Partial<EmailFormProps> = {}) =>
    shallow(<EmailForm {...{ ...defaults, ...props }} />);

describe('Email form', () => {
    let wrapper = setup();

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(wrapper.hasClass('cr-email-form'));
    });

    it('should handle Send button onClick', () => {
        const onClick = spy();
        wrapper = setup({ OnSubmit: onClick });
        wrapper.setState({ email: 'potato@heliostech.fr' });
        wrapper.find('.cr-email-form__button').simulate('click');
        expect((onClick as SinonSpy).calledOnceWith('potato@heliostech.fr')).toBeTruthy();
    });

    it('should handle input valid email value', () => {
        wrapper.props().children.props.children[1].props.children[0].props.children[1].props.onChangeValue('potato@heliostech.fr');
        // @ts-ignore
        const state: EmailFormState = wrapper.state();
        expect(state.email).toEqual('potato@heliostech.fr');
    });

    it('should handle input invalid email value', () => {
        wrapper.setState({ email: 'potato' });
        wrapper.find('.cr-email-form__button').simulate('click');
        // @ts-ignore
        const state: EmailFormState = wrapper.state();
        expect(state.emailError).toEqual('Email is invalid');
    });

    it('should render Loader', () => {
        // tslint:disable-next-line:no-magic-numbers
        expect(wrapper.props().children.props.children[1].props.children[1].props.children[1].props.children).toBeNull();
        wrapper = setup({ isLoading: true });
        // tslint:disable-next-line:no-magic-numbers
        expect(wrapper.props().children.props.children[1].props.children[1].props.children[1].props.children).not.toBeNull();
        // tslint:disable-next-line:no-magic-numbers
        expect(wrapper.props().children.props.children[1].props.children[1].props.children[2].props.label).toEqual('Loading...');
    });
});
