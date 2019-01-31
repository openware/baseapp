import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { Asks, AsksProps, calcMaxVolume, renderTotal, sortAskByPrice } from '..';
import { rootReducer } from '../../modules';

const asks: string[][] = [
    ['0.6', '0.1'],
    ['0.8', '1'],
    ['0.99', '1'],
    ['0.96', '1'],
    ['0.75', '1'],
    ['0.98', '20'],
    ['0.7', '1'],
];

const bids: string[][] = [
    ['0.5', '0.04'],
    ['0.48', '0.2'],
    ['0.27', '5'],
    ['0.28', '2'],
    ['0.47', '0.1'],
    ['0.3', '10'],
    ['0.26', '25'],
    ['0.49', '0.5'],
];

const asksLoading = false;
const currentMarket = {
    id: 'btczar',
    name: 'BTC/ZAR',
    bid_fee: '0.0015',
    ask_fee: '0.0015',
    ask_unit: 'btc',
    bid_unit: 'zar',
    min_ask_price: '0.0',
    max_bid_price: '0.0',
    min_ask_amount: '0.0',
    min_bid_amount: '0.0',
    ask_precision: 4,
    bid_precision: 4,
};

const currentPrice = '';

const defaultProps: AsksProps = {
    asks,
    asksLoading,
    bids,
    currentMarket,
    currentPrice,
};

const store = createStore(rootReducer);
const AsksTable = connect()(Asks);

const setup = (props: Partial<AsksProps> = {}) =>
    shallow(<Provider store={store}><AsksTable  {...{ ...defaultProps, ...props }} /></Provider>);

describe('Asks table test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('should accumulate volume of asks properly', () => {
        const expectedResult = [0.1, 1.1, 2.1, 3.1, 4.1, 24.1, 25.1];
        const result = renderTotal(asks);
        expect(result).toEqual(expectedResult);
    });

    it('sholud calculate max volume between asks and bids correctly', () => {
        const expectedMax = 42.84;
        const result = calcMaxVolume(asks, bids);
        expect(result).toEqual(expectedMax);
    });

    it('should sort ask ascendingly by price', () => {
        const sortedArray = [
            ['0.6', '0.1'],
            ['0.7', '1'],
            ['0.75', '1'],
            ['0.8', '1'],
            ['0.96', '1'],
            ['0.98', '20'],
            ['0.99', '1'],
        ];

        const result = sortAskByPrice(asks);
        expect(result).toEqual(sortedArray);
    });
});
