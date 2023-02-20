import { render, screen } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { EmailForm, EmailFormProps } from './index';

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

const renderComponent = (props: Partial<EmailFormProps> = {}) =>
    render(
        <TestComponentWrapper>
            <EmailForm {...defaults} {...props} />
        </TestComponentWrapper>,
    );

describe('EmailForm component', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should render error block', () => {
        renderComponent({ emailError: 'error email' });
        expect(screen.getByText('error email')).toBeInTheDocument();
    });
});
