import { render } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { CodeVerification, CodeVerificationProps } from '../';

const defaultProps: CodeVerificationProps = {
    placeholder: '',
    type: '',
    codeLength: 6,
    code: '',
    onChange: jest.fn(),
    onSubmit: jest.fn(),
};

const renderComponent = (props: Partial<CodeVerificationProps> = {}) =>
    render(
        <IntlProvider locale="en">
            <CodeVerification {...{ ...defaultProps, ...props }} />
        </IntlProvider>,
    );

describe('CodeVerification test', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
