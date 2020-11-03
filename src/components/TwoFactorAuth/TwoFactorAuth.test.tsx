import * as React from 'react';

import { shallow } from 'enzyme';

import { TwoFactorAuth, TwoFactorAuthProps } from './';

const defaults: TwoFactorAuthProps = {
    onSubmit: jest.fn(),
    label: '',
    title: '',
    buttonLabel: '',
    message: '',
    otpCode: '',
    error: '',
    codeFocused: false,
    handleOtpCodeChange: jest.fn(),
    handleChangeFocusField: jest.fn(),
    handleClose2fa: jest.fn(),
};

const setup = (props: Partial<TwoFactorAuthProps> = {}) => shallow(<TwoFactorAuth {...{ ...defaults, ...props }} />);

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
