import { shallow } from 'enzyme';

import * as React from 'react';

import { TestComponentWrapper } from 'lib/test';
import { CryptoIcon, CryptoIconProps } from '.';

const defaultProps: CryptoIconProps = {
    code: 'btc',
};

const setup = (props: Partial<CryptoIconProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <CryptoIcon {...{ ...defaultProps, ...props }} />
        </TestComponentWrapper>
    );

describe('CryptoIcon', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        const wrapper = setup().render();
        expect(wrapper.hasClass('cr-crypto-icon')).toBeTruthy();
    });

    it('should render children', () => {
        const amount = 123;
        const wrapper = setup({ children: [amount] }).render();
        expect(wrapper.text()).toEqual(` ${amount}`);
    });

    it.skip('should have correct path to svg images', () => {
        const wrapper = setup().render();
        expect(wrapper.find('img').prop('src')).toEqual(require('cryptocurrency-icons/svg/color/btc.svg'));
    });

    it('should pass along supplied className', () => {
        const className = 'some-class';
        const wrapper = setup({ className }).render();
        expect(wrapper.hasClass(className)).toBeTruthy();
    });
});
