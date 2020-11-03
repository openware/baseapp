import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';

import { FilterInput, FilterInputProps } from './';

const data = [
    {
        active: true,
        address: '0xdeadbeef',
        cryptoAmount: 10,
        cryptoCode: 'BTC',
        fiatAmount: 100,
        fiatCode: 'USD',
        lockedAmount: 0,
    },
    {
        active: false,
        address: '0xdvrervef',
        cryptoAmount: 10,
        cryptoCode: 'ETH',
        fiatAmount: 100,
        fiatCode: 'USD',
        lockedAmount: 0,
    },
];

const defaults: FilterInputProps = {
    data,
    filter: (item: typeof data[0], term) => String(item.cryptoCode).toLowerCase().indexOf(term.toLowerCase()) !== -1,
    onFilter: spy(),
};

const setup = (props: Partial<FilterInputProps> = {}) => shallow(<FilterInput {...{ ...defaults, ...props }} />);

describe('FilterInput', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render 1 input tag', () => {
        const input = wrapper.find('input');
        expect(input.length).toBe(1);
    });

    it('should render 1 div', () => {
        const divs = wrapper.find('div');
        expect(divs.length).toBe(1);
    });

    it('should have correct className', () => {
        expect(wrapper.hasClass('cr-search')).toBeTruthy();
    });

    it('should render correct list from data', () => {
        wrapper.find('input').simulate('change', {
            target: {
                value: 'b',
            },
        });

        expect((defaults.onFilter as SinonSpy).calledOnceWith([defaults.data[0]])).toBeTruthy();
    });
});
