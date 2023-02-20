import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { IntlProps } from '../../';
import { EmailVerificationScreen } from '../EmailVerification';

const renderComponent = (props: Partial<IntlProps> = {}) =>
    render(
        <TestComponentWrapper>
            <EmailVerificationScreen />
        </TestComponentWrapper>,
    );

describe('EmailVerificationScreen', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
