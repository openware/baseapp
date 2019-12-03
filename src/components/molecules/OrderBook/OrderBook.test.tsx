import { mount, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';
import { CellData } from '../Table/Table';
import {  mapValues, OrderBook, OrderBookProps } from './OrderBook';

const data: CellData[][] = [
    ['12349', '14', '12'],
    ['12349', '14', '1211'],
    ['12349', '14', '124'],
    ['12349', '14', '121'],
    ['12349', '14', '1991'],
];

const defaultProps: OrderBookProps = {
    data: data,
    headers: ['Total', 'Amount', 'Price'],
    title: 'Bids',
    onSelect: spy(),
};

const setup = (props: Partial<OrderBook> = {}) =>
    shallow(<OrderBook {...{ ...defaultProps, ...props }} />);

describe('History', () => {
    let wrapper: ShallowWrapper<History>;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should return correct data', () => {
        // tslint:disable-next-line:no-magic-numbers
        const orderEntry = [1, 0.2, 3, 2, 0.5];
        const maxVolume = 3;

        const expectedData = [
            { value: 33.33333333333333 },
            { value: 6.666666666666667 },
            { value: 100 },
            { value: 66.66666666666666 },
            { value: 16.666666666666664 },
        ];

        const result = mapValues(maxVolume, orderEntry);
        expect(result).toEqual(expectedData);
    });

    it('should handle onSelect function', () => {
        // tslint:disable: no-shadowed-variable
        const wrapper = mount(<OrderBook {...{ ...defaultProps}} />);
        wrapper.find('tbody').find('tr').first().simulate('click');
        expect(wrapper.find('tbody').find('tr').first().prop('className')).toEqual('cr-table__row--selected');
        expect((defaultProps.onSelect as SinonSpy).calledOnceWith()).toBeTruthy();
        wrapper.unmount();
    });
});
