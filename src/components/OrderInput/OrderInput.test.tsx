import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { Input } from '@openware/components';
import { OrderInput, OrderInputProps } from '.';

const defaultProps: OrderInputProps = {
    currency: 'eth',
    handleChangeValue: () => undefined,
    handleFocusInput: () => undefined,
    isFocused: false,
    value: '',
    onKeyPress: jest.fn(),
};

const setup = (props: Partial<OrderInputProps> = {}) =>
    shallow(<OrderInput {...{ ...defaultProps, ...props }} />);

describe('InputBlock', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        const wrapper = setup();
        expect(wrapper.hasClass('cr-order-input')).toBeTruthy();
    });

    it('should pass along supplied className', () => {
        const className = 'some-class';
        const wrapper = setup({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('should set correct currency code to the child components', () => {
        const wrapper = setup();
        const { children } = wrapper.find('CryptoIcon').props();
        expect(children).toContain('ETH');
    });

    it('inner Input component should render with correct type', () => {
        defaultProps.value = '0.02';
        const change = defaultProps.handleChangeValue;
        const keyPress = defaultProps.onKeyPress;
        const { value } = mount(
            (
                <Input
                    className="cr-input-block__input"
                    type="text"
                    value="0.02"
                    onChangeValue={change}
                    onKeyPress={keyPress}
                />
            )).props();
        expect(value).toContain(defaultProps.value);
    });
});
