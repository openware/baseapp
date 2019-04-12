import { mount, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';
import { Order, OrderComponentProps } from './';

// tslint:disable:no-magic-numbers

const defaultProps: OrderComponentProps = {
    feeBuy: 10,
    feeSell: 10,
    onSubmit: spy(),
    priceMarketBuy: 5,
    priceMarketSell: 10,
    currentMarketAskPrecision: 4,
    currentMarketBidPrecision: 5,
    availableBase: 200,
    availableQuote: 12,
    from: 'btc',
    to: 'eth',
    asks: [['10','1']],
    bids: [['10','1']],
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

    it('should handle submit function', () => {
        // tslint:disable: no-shadowed-variable
        const wrapper = mount(<Order {...{ ...defaultProps}} />);
        wrapper.find('input').at(0).simulate('change', {target: { value: '123' }});
        wrapper.find('input').at(1).simulate('change', {target: { value: '123' }});
        wrapper.find('input').at(2).simulate('click');
        expect((defaultProps.onSubmit as SinonSpy).calledOnceWith()).toBeTruthy();
        wrapper.unmount();
    });
});
