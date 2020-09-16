import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { spy } from 'sinon';
import { CellData } from '../../components/Table';
import {  mapValues, OrderBook, OrderBookProps } from './';

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

describe.skip('History', () => {
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
});
