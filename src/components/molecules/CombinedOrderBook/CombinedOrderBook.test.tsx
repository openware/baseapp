import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { spy } from 'sinon';
import { CellData } from '../Table/Table';
import {  CombinedOrderBook, CombinedOrderBookProps } from './CombinedOrderBook';

const dataAsks: CellData[][] = [
    ['123', '14', '121'],
    ['123', '14', '121'],
    ['123', '14', '121'],
    ['123', '14', '121'],
    ['123', '14', '121'],
];

const dataBids: CellData[][] = [
    ['123', '14', '121'],
    ['123', '14', '121'],
    ['123', '14', '121'],
    ['123', '14', '121'],
    ['123', '14', '121'],
];

// tslint:disable:no-magic-numbers
const orderBookEntryAsks = [0.1, 0.2, 0.3, 0.4, 0.5];
const orderBookEntryBids = [0.1, 0.2, 0.3, 0.4, 0.5];

const maxVolume = 3;
const headers = ['Amount', 'Total', 'Price'];
const onSelectAsks = spy();
const onSelectBids = spy();

const isLarge = false;

const lastPrice = <React.Fragment><span className={'pg-order-book__market-negative'}>123</span><span>Last Market Price</span></React.Fragment>;

const defaultProps: CombinedOrderBookProps = {
    dataAsks,
    dataBids,
    orderBookEntryAsks,
    orderBookEntryBids,
    headers,
    onSelectAsks,
    onSelectBids,
    isLarge,
    lastPrice,
    maxVolume,
};

const setup = (props: Partial<CombinedOrderBookProps> = {}) =>
    shallow(<CombinedOrderBook {...{ ...defaultProps, ...props }} />);

describe('CombinedOrderBook', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render small width component', () => {
        const smallComponent = wrapper.children();
        expect(smallComponent.hasClass('cr-combined-order-book__small')).toBeTruthy();
    });

    it('should render large width component', () => {
        wrapper = setup({ isLarge: true });
        const largeComponent = wrapper.children().first();
        expect(largeComponent.hasClass('cr-combined-order-book__large')).toBeTruthy();
    });
});
