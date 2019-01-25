import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { Asks, AsksProps, calcMaxVolume, renderTotal } from '..';
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

const asksLoading = false;
const currentMarket = {
    id: 'btczar',
    name: 'BTC/ZAR',
};

const defaultProps: AsksProps = {
    asks,
    asksLoading,
    bids,
    currentMarket,
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
        const expectedResult = [0.06, 0.76, 1.51, 2.31, 3.27, 22.87, 23.86];
        const result = renderTotal(asks);
        expect(result).toEqual(expectedResult);
    });

    it('sholud calculate max volume between asks and bids correctly', () => {
        const expectedMax = 23.86;
        const result = calcMaxVolume(asks, bids);
        expect(result).toEqual(expectedMax);
    });
});
