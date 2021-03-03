import { shallow } from 'enzyme';
import * as React from 'react';
import { OpenOrders, OpenOrdersProps } from '.';
import { CellData } from '../';

const defaultProps: OpenOrdersProps = {
    data: [
        ['13:50', 'buy', '1,442.43', '4,323.04', ''],
        ['13:50', 'sell', '1,442.43', '44,323.12', ''],
        ['13:50', 'sell', '1,442.43', '4,323.23', ''],
        ['13:50', 'buy', '1,442.43', '543.33', ''],
    ],
    onCancel: jest.fn(),
};

const setup = (props: Partial<OpenOrdersProps> = {}) =>
    shallow(<OpenOrders {...{ ...defaultProps, ...props }} />);

describe('OpenOrders', () => {
    let wrapper = setup();

    beforeEach(() => {
       wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render formatted price', () => {
        const instance: OpenOrders = (wrapper.instance() as OpenOrders);
        const sideBuy = 'buy';
        const sideSell = 'sell';

        const renderedBuyPrice = (
            <span className="cr-open-orders__price cr-open-orders__price--buy">{sideBuy}</span>
        );

        const renderedSellPrice = (
            <span className="cr-open-orders__price cr-open-orders__price--sell">{sideSell}</span>
        );

        expect(instance.renderAction(sideBuy, sideBuy)).toEqual(renderedBuyPrice);
        expect(instance.renderAction(sideSell, sideSell)).toEqual(renderedSellPrice);
    });

    it('should map cells', () => {
        const date: CellData = '12:34';
        const dateIndex = 0;
        const price: CellData = 123.43;
        const priceIndex = 1;
        const action = 'bid';
        const volume = 12343.4;
        const row: CellData[] = [date, action, price, volume, 'buy'];
        const rowIndex = 1;

        const instance = (wrapper.instance() as OpenOrders);

        expect(instance.renderCell(rowIndex)(date, dateIndex, row)).toBe(date);
        expect(instance.renderCell(rowIndex)(action, priceIndex, row)).toEqual(instance.renderAction(action, 'buy'));
    });

    it('should map rows', () => {
        const price = 5.34;
        const volume = 454.5;
        const rowIndex = 0;
        const row: CellData[] = ['12:50', 'ask', price, volume, 'sell'];
        const instance: OpenOrders = (wrapper.instance() as OpenOrders);
        const renderedRow: CellData[] = [
            '12:50',
            instance.renderAction('ask', 'sell'),
            price,
            volume,
            instance.renderCancelButton(rowIndex),
        ];

        expect(JSON.stringify(instance.renderRow(row, rowIndex))).toBe(JSON.stringify(renderedRow));
    });
});
