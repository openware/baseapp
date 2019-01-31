import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { Bids, BidsProps, renderVolume, sortBidByPrice } from '..';
import { rootReducer } from '../../modules';

const asks: string[][] = [
    ['0.6', '0.1'],
    ['0.7', '1'],
    ['0.75', '1'],
    ['0.8', '1'],
    ['0.96', '1'],
    ['0.98', '20'],
    ['0.99', '1'],
];

const bids: string[][] = [
    ['0.5', '0.04'],
    ['0.49', '0.5'],
    ['0.48', '0.2'],
    ['0.47', '0.1'],
    ['0.3', '10'],
    ['0.28', '2'],
    ['0.27', '5'],
    ['0.26', '25'],
];

const bidsLoading = false;
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

const defaultProps: BidsProps = {
    asks,
    bidsLoading,
    bids,
    currentMarket,
    currentPrice,
};

const store = createStore(rootReducer);
const BidsTable = connect()(Bids);

const setup = (props: Partial<BidsProps> = {}) =>
    shallow(<Provider store={store}><BidsTable  {...{ ...defaultProps, ...props }} /></Provider>);

describe('Bids table test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('should accumulate volume of bids properly', () => {
        const expectedResult = [0.04, 0.54, 0.74, 0.84, 10.84, 12.84, 17.84, 42.84];
        const result = renderVolume(bids);
        expect(result).toEqual(expectedResult);
    });

    it('should sort bids descendingly by price', () => {
        const sortedArray = [
            ['0.5', '0.04'],
            ['0.49', '0.5'],
            ['0.48', '0.2'],
            ['0.47', '0.1'],
            ['0.3', '10'],
            ['0.28', '2'],
            ['0.27', '5'],
            ['0.26', '25'],
        ];

        const result = sortBidByPrice(bids);
        expect(result).toEqual(sortedArray);
    });
});
