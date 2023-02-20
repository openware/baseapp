import { render } from '@testing-library/react';
import React from 'react';
import { PasswordStrengthMeter, PasswordStrengthMeterProps } from './';

const defaults: PasswordStrengthMeterProps = {
    currentPasswordEntropy: 0,
    minPasswordEntropy: 0,
    passwordExist: false,
    passwordErrorFirstSolved: false,
    passwordErrorSecondSolved: false,
    passwordErrorThirdSolved: false,
    passwordPopUp: false,
    translate: jest.fn(),
};

const renderComponent = (props: Partial<PasswordStrengthMeterProps> = {}) =>
    render(<PasswordStrengthMeter {...{ ...defaults, ...props }} />);

describe('PasswordStrengthMeter component', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
