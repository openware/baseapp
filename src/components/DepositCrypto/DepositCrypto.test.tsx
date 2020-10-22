import { shallow } from 'enzyme';
import * as React from 'react';
import { CopyableTextField } from '../CopyableTextField';
import { DepositCrypto } from './';


describe('DepositCrypto', () => {
    let wrapper;
    const handleOnCopy = jest.fn();

    beforeEach(() => {
        wrapper = shallow(
            <DepositCrypto
                text={'text123'}
                data={'123123'}
                dimensions={118}
                error={'error123'}
                disabled={false}
                handleOnCopy={handleOnCopy}
            />,
        );
    });

    it('should handle click if disabled', () => {
        wrapper.setProps({ disabled: true });
        wrapper.find('.cr-copyable-text-field').simulate('click');
        expect(handleOnCopy).toHaveBeenCalledTimes(0);
    });

    it('should handle click if not disabled', () => {
        wrapper.find('.cr-copyable-text-field').simulate('click');
        expect(handleOnCopy).toHaveBeenCalled();
        expect(handleOnCopy).toHaveBeenCalledTimes(1);
    });

    it('should contains text on the left side', () => {
        const text = wrapper.find('.cr-deposit-info').text();
        expect(text).toContain('text123');
    });

    it('should contains QRCode', () => {
        expect(wrapper.find('.qr-code-wrapper')).toBeTruthy();
    });

    it('should contains CopyableTextField', () => {
        expect(wrapper.find(CopyableTextField)).toBeTruthy();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
