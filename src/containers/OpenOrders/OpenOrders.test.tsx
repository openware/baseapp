import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { OpenOrdersComponent, OpenOrdersProps } from '..';
import { Market, Order, rootReducer } from '../../modules';

const currentMarket: Market | undefined = {
    id:'ethusd',
    name:'ETH/USD',
    ask_unit:'eth',
    bid_unit:'usd',
    ask_fee:'0.0015',
    bid_fee:'0.0015',
    min_ask_price:'0.0',
    max_bid_price:'0.0',
    min_ask_amount:'0.0',
    min_bid_amount:'0.0',
    ask_precision:4,
    bid_precision:4,
};

const openOrdersData: Order[] = [{
    id:131,
    side:'sell',
    price:104.4313,
    volume:'0.0000',
    created_at:'2019-01-31T21:14:04+01:00',
    remaining_volume: '0.0000',
    state:'wait',
}];

const defaultProps: OpenOrdersProps = {
    currentMarket,
    openOrdersData,
};

const store = createStore(rootReducer);
const OpenOrders = connect()(OpenOrdersComponent);

const setup = (props: Partial<OpenOrdersProps> = {}) =>
    shallow(<Provider store={store}><OpenOrders  {...{ ...defaultProps, ...props }} /></Provider>);

describe('OpenOrders', () => {
    let wrapper = setup();

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
