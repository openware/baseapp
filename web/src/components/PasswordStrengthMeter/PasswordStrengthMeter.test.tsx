import { shallow } from 'enzyme';
import * as React from 'react';
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

const setup = (props: Partial<PasswordStrengthMeterProps> = {}) =>
    shallow(<PasswordStrengthMeter {...{ ...defaults, ...props }} />);

describe('PasswordStrengthMeter component', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('renders without crashing', () => {
        const wrapper = setup();
        expect(wrapper).toBeDefined();
    });
});
