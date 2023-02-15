import { shallow } from 'enzyme';
import * as React from 'react';
import { DepositFiat } from './';

describe('DepositFiat', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<DepositFiat title={'text123'} description={'123123'} uid={'42389734'} />);
    });

    it('should contains title', () => {
        const text = wrapper.find('.cr-deposit-fiat__title').text();
        expect(text).toContain('text123');
    });

    it('should contains right description', () => {
        const text = wrapper.find('.cr-deposit-fiat__description').text();
        expect(text).toContain('123123');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
