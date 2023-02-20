import { render } from '@testing-library/react';
import React from 'react';
import { PasswordStrengthTip, PasswordStrengthTipProps } from './';

const defaults: PasswordStrengthTipProps = {
    passwordErrorFirstSolved: false,
    passwordErrorSecondSolved: false,
    passwordErrorThirdSolved: false,
    passwordPopUp: false,
    translate: jest.fn(),
};

const renderComponent = (props: Partial<PasswordStrengthTipProps> = {}) =>
    render(<PasswordStrengthTip {...{ ...defaults, ...props }} />);

describe('PasswordStrengthMeter component', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
