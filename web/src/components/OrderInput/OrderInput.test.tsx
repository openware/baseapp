import { render } from '@testing-library/react';
import React from 'react';
import { OrderInput, OrderInputProps } from '.';

const defaultProps: OrderInputProps = {
    currency: 'eth',
    handleChangeValue: () => undefined,
    handleFocusInput: () => undefined,
    isFocused: false,
    value: '',
    onKeyPress: jest.fn(),
};

const renderComponent = (props: Partial<OrderInputProps> = {}) =>
    render(<OrderInput {...{ ...defaultProps, ...props }} />);

describe('InputBlock', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(renderComponent().container.querySelector('.cr-order-input')).toBeInTheDocument();
    });

    it('should pass along supplied className', () => {
        expect(renderComponent({ className: 'new-class' }).container.querySelector('.new-class')).toBeInTheDocument();
    });
});
