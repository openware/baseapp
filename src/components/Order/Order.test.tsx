import { mount, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';
import { Market } from '../../modules';
import { Order, OrderComponentProps } from './';

// tslint:disable:no-magic-numbers

const defaultProps: OrderComponentProps = {
    onSubmit: spy(),
    priceMarketBuy: 5,
    priceMarketSell: 10,
    availableBase: 200,
    availableQuote: 12,
    asks: [['10','1']],
    bids: [['10','1']],
    currentMarket: {
        quote_unit: 'btc',
        base_unit: 'eth',
        amount_precision: 4,
        price_precision: 5,
    } as Market,
};

const setup = (props: Partial<OrderComponentProps> = {}) =>
    shallow(<Order {...{ ...defaultProps, ...props }} />);

describe('Order', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('button should be disabled', () => {
        // tslint:disable: no-shadowed-variable
        const wrapper = mount(<Order {...{ ...defaultProps}} />);
        wrapper.find('input').at(2).simulate('click');
        expect((defaultProps.onSubmit as SinonSpy).calledOnceWith()).toBeFalsy();
        wrapper.unmount();
    });
});
