import { shallow } from 'enzyme';
import * as React from 'react';
import { CryptoIcon, CryptoIconProps } from '.';

const defaultProps: CryptoIconProps = {
    code: 'BTC',
};

const setup = (props: Partial<CryptoIconProps> = {}) =>
    shallow(<CryptoIcon {...{ ...defaultProps, ...props }} />);

describe('CryptoIcon', () => {

    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        const wrapper = setup();
        expect(wrapper.hasClass('cr-crypto-icon')).toBeTruthy();
    });

    it('should render children', () => {
        const amount = 123;
        const wrapper = setup({ children: [amount] });
        expect(wrapper.text()).toEqual(` ${amount}`);
    });

    it('should have correct path to svg images', () => {
        const icon = setup();
        expect(icon.find('img').prop('src')).toEqual(require('../../../node_modules/cryptocurrency-icons/svg/color/btc.svg'));
    });

    it('should pass along supplied className', () => {
        const className = 'some-class';
        const wrapper = setup({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

});
