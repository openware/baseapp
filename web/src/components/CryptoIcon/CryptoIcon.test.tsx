import { render, screen } from '@testing-library/react';
import React from 'react';
import { CryptoIcon, CryptoIconProps } from '.';

const defaultProps: CryptoIconProps = {
    code: 'btc',
};

const renderComponent = (props: Partial<CryptoIconProps> = {}) =>
    render(<CryptoIcon {...{ ...defaultProps, ...props }} />);

describe('CryptoIcon', () => {
    let component;

    beforeEach(() => {
        component = renderComponent();
    });

    it('should render', () => {
        expect(component.container).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(component.container.querySelector('.cr-crypto-icon')).toBeInTheDocument();
    });

    it('should render children', () => {
        const amount = 123;
        renderComponent({ children: [amount] });
        expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('should pass along supplied className', () => {
        const className = 'some-class';
        const { container } = renderComponent({ className });
        expect(container.querySelector('.cr-crypto-icon')).toBeInTheDocument();
    });
});
