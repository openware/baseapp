import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { IntlProps } from '../../';
import { ForgotPasswordScreen } from '../ForgotPassword';

const renderComponent = (props: Partial<IntlProps> = {}) =>
    render(
        <TestComponentWrapper>
            <ForgotPasswordScreen />
        </TestComponentWrapper>,
    );

describe('ForgotPasswordScreen', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
