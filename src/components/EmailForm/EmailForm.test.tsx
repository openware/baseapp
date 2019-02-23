import * as React from 'react';
import { EmailForm, EmailFormProps } from './';

import { shallow } from 'enzyme';

const defaults: EmailFormProps = {
    OnSubmit: jest.fn(),
    email: '',
    emailError: '',
    message: '',
    emailFocused: false,
    validateForm: jest.fn(),
    handleInputEmail: jest.fn(),
    handleFieldFocus: jest.fn(),
    handleReturnBack: jest.fn(),
};

const setup = (props: Partial<EmailFormProps> = {}) =>
    shallow(<EmailForm {...{ ...defaults, ...props }} />);

describe('EmailForm component', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('renders without crashing', () => {
        const wrapper = setup();
        expect(wrapper).toBeDefined();
    });

    it('should render error block', () => {
        const wrapper = setup({emailError: 'error email'});
        expect(wrapper.find('.cr-email-form__error').text()).toBe('error email');
    });

    it('should send request', () => {
        const spyOnValidateForm = jest.fn();
        const spyOnSubmit = jest.fn();
        const wrapper = setup({
            email: 'email@email.com',
            validateForm: spyOnValidateForm,
            OnSubmit: spyOnSubmit,
        });
        const button = wrapper.find('.cr-email-form__button').last();
        button.simulate('click');
        expect(spyOnValidateForm).toHaveBeenCalledTimes(0);
        expect(spyOnSubmit).toHaveBeenCalled();
        expect(spyOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should validate form', () => {
        const spyOnValidateForm = jest.fn();
        const spyOnSubmit = jest.fn();
        const wrapper = setup({
            email: 'email',
            validateForm: spyOnValidateForm,
            OnSubmit: spyOnSubmit,
        });
        const button = wrapper.find('.cr-email-form__button').last();
        button.simulate('click');
        expect(spyOnValidateForm).toHaveBeenCalled();
        expect(spyOnValidateForm).toHaveBeenCalledTimes(1);
        expect(spyOnSubmit).toHaveBeenCalledTimes(0);
    });
});
