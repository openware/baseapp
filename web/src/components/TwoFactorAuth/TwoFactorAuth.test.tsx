import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { TwoFactorAuth, TwoFactorAuthProps } from './';

import { render } from '@testing-library/react';

const defaults: TwoFactorAuthProps = {
    onSubmit: jest.fn(),
    title: '',
    buttonLabel: '',
    message: '',
    otpCode: '',
    handleOtpCodeChange: jest.fn(),
    handleClose2fa: jest.fn(),
};

const renderComponent = (props: Partial<TwoFactorAuthProps> = {}) =>
    render(
        <TestComponentWrapper>
            <TwoFactorAuth {...{ ...defaults, ...props }} />
        </TestComponentWrapper>,
    );

describe('TwoFactorAuth component', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
