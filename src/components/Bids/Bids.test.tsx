import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { Bids, BidsProps, renderVolume } from '..';
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
};

const defaultProps: BidsProps = {
    asks,
    bidsLoading,
    bids,
    currentMarket,
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
        const expectedResult = [0.02, 0.26, 0.36, 0.41, 3.41, 3.97, 5.32, 11.82];
        const result = renderVolume(bids);
        expect(result).toEqual(expectedResult);
    });
});
