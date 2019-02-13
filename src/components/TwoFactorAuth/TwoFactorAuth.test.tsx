import * as React from 'react';
import { TwoFactorAuth, TwoFactorAuthProps } from './';

import { shallow } from 'enzyme';

const defaults: TwoFactorAuthProps = {
    onSubmit: jest.fn(),
    onSignUp: jest.fn(),
    signInLabel: '',
    codeLabel: '',
    buttonLabel: '',
    footerCreateAccountLabel: '',
    signUpLabel: '',
    otpCode: '',
    error: '',
    handleOtpCodeChange: jest.fn(),
};

const setup = (props: Partial<TwoFactorAuthProps> = {}) =>
    shallow(<TwoFactorAuth {...{ ...defaults, ...props }} />);

describe('TwoFactorAuth component', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('renders without crashing', () => {
        const wrapper = setup();
        expect(wrapper).toBeDefined();
    });
});
