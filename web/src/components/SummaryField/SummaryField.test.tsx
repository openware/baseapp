import { render, screen } from '@testing-library/react';
import React from 'react';
import { SummaryField, SummaryFieldProps } from './';

const defaultProps: SummaryFieldProps = {
    message: 'Message',
    content: <div>Content</div>,
};

const renderComponent = (props: Partial<SummaryFieldProps> = {}) =>
    render(<SummaryField {...{ ...defaultProps, ...props }} />);

describe('SummaryField', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(renderComponent().container.querySelector('.cr-summary-field')).toBeInTheDocument();
    });

    it('should pass along supplied className', () => {
        expect(renderComponent({ className: 'new-class' }).container.querySelector('.new-class')).toBeInTheDocument();
    });

    it('should render correct message', () => {
        const { container } = renderComponent();
        expect(screen.getByText('Message')).toBeInTheDocument();
        expect(renderComponent().container.querySelector('.cr-summary-field-message')).toBeInTheDocument();
    });
});
