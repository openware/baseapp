import { shallow } from 'enzyme';
import * as React from 'react';

import { PasswordStrengthTip, PasswordStrengthTipProps } from './';

const defaults: PasswordStrengthTipProps = {
    passwordErrorFirstSolved: false,
    passwordErrorSecondSolved: false,
    passwordErrorThirdSolved: false,
    passwordPopUp: false,
    translate: jest.fn(),
};

const setup = (props: Partial<PasswordStrengthTipProps> = {}) =>
    shallow(<PasswordStrengthTip {...{ ...defaults, ...props }} />);

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
