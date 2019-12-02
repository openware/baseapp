import { Button, PercentageButton } from '@openware/components';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';
import { OrderForm, OrderFormProps } from './';

const defaultProps = {
    currentMarketAskPrecision: 4,
    currentMarketBidPrecision: 5,
    available: 50,
    priceMarket: 5,
    priceLimit: 12,
    from: 'btc',
    to: 'eth',
    onSubmit: spy(),
    proposals: [['5', '5']],
    listenInputPrice: spy(),
};

const setup = (props: Partial<OrderFormProps> = {}) =>
    shallow(<OrderForm {...{ ...defaultProps, ...props }} />);

describe('OrderForm', () => {
    it('should match snapshot', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        const wrapper = setup();
        expect(wrapper.hasClass('cr-order-form')).toBeTruthy();
    });

    it('should pass along supplied className', () => {
        const className = 'some-class';
        const wrapper = setup({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('should render percentage buttons', () => {
        const wrapper = setup();
        const percentageButton = wrapper.find(PercentageButton);
        expect(percentageButton.at(0).props().label.toLowerCase()).toBe('25%');
        expect(percentageButton.at(1).props().label.toLowerCase()).toBe('50%');
        expect(percentageButton.at(2).props().label.toLowerCase()).toBe('75%');
        expect(percentageButton.at(3).props().label.toLowerCase()).toBe('100%');
    });

    it('should render submit button', () => {
        const wrapper = setup();
        let submitButton = wrapper.find(Button);
        expect(submitButton.props().label.toLowerCase()).toBe('buy');

        submitButton = wrapper.find(Button);
        expect(submitButton.props().label.toLowerCase()).toBe('buy');
    });

    it('should disable button price 0 in Market order', () => {
        const onSubmit: SinonSpy = spy();
        let priceMarket = 135.15;
        let wrapper = setup({ onSubmit, priceMarket });
        const orderState = { orderType: 'Market', amount: '0.05' };
        wrapper.setState(orderState);

        let submitButton = wrapper.find(Button);
        expect(submitButton.props().disabled).toBe(false);

        priceMarket = 0;
        wrapper = setup({ onSubmit, priceMarket });
        submitButton = wrapper.find(Button);
        expect(submitButton.props().disabled).toBe(true);
    });

    it('should disable button amount 0 in Market order', () => {
        const onSubmit: SinonSpy = spy();
        const wrapper = setup({ onSubmit });
        const orderState = { orderType: 'Market'};
        wrapper.setState(orderState);

        let amountState = { amount: '0.001' };
        wrapper.setState(amountState);

        let submitButton = wrapper.find(Button);
        expect(submitButton.props().disabled).toBe(false);

        amountState = { amount: '0' };
        wrapper.setState(amountState);

        submitButton = wrapper.find(Button);
        expect(submitButton.props().disabled).toBe(true);
    });

    const findInputAmount = (wrapper: ShallowWrapper) => wrapper.find('.cr-order-item').at(1).find('div').last().children().last();

    it('does not change positive well formatted integers', () => {
        const wrapper = setup();
        const inputAmount = findInputAmount(wrapper);

        inputAmount.props().handleChangeValue('1');
        expect(wrapper.state('amount')).toBe('1');

        inputAmount.props().handleChangeValue('123456');
        expect(wrapper.state('amount')).toBe('123456');
    });

    it('does not change positive well formatted floats', () => {
        const wrapper = setup();
        const inputAmount = findInputAmount(wrapper);

        inputAmount.props().handleChangeValue('3120.123');
        expect(wrapper.state('amount')).toBe('3120.123');
    });

    it('formats lazy float format', () => {
        const wrapper = setup();
        const inputAmount = findInputAmount(wrapper);

        inputAmount.props().handleChangeValue('.123');
        expect(wrapper.state('amount')).toBe('0.123');

        inputAmount.props().handleChangeValue(',123');
        expect(wrapper.state('amount')).toBe('0.123');
    });

    it('fixes some errors in float format', () => {
        const wrapper = setup();
        const inputAmount = findInputAmount(wrapper);

        inputAmount.props().handleChangeValue('0..123');
        expect(wrapper.state('amount')).toBe('0.123');

        inputAmount.props().handleChangeValue('0..123.');
        expect(wrapper.state('amount')).toBe('0.123');

        inputAmount.props().handleChangeValue('0..123.10');
        expect(wrapper.state('amount')).toBe('0.123');
    });

    it('changes negative numbers to positive', () => {
        const wrapper = setup();
        const inputAmount = findInputAmount(wrapper);

        inputAmount.props().handleChangeValue('-12');
        expect(wrapper.state('amount')).toBe('12');

        inputAmount.props().handleChangeValue('-3120.123');
        expect(wrapper.state('amount')).toBe('3120.123');

        inputAmount.props().handleChangeValue('--123');
        expect(wrapper.state('amount')).toBe('123');
    });

    it('should cleanup leading zeros', () => {
        const wrapper = setup();
        const inputAmount = findInputAmount(wrapper);

        inputAmount.props().handleChangeValue('0');
        expect(wrapper.state('amount')).toBe('0');

        inputAmount.props().handleChangeValue('0123');
        expect(wrapper.state('amount')).toBe('123');

        inputAmount.props().handleChangeValue('000100023300.123');
        expect(wrapper.state('amount')).toBe('100023300.123');

        inputAmount.props().handleChangeValue('0.');
        expect(wrapper.state('amount')).toBe('0.');

        inputAmount.props().handleChangeValue('0.0');
        expect(wrapper.state('amount')).toBe('0.0');

        inputAmount.props().handleChangeValue('0.000');
        expect(wrapper.state('amount')).toBe('0.000');

        inputAmount.props().handleChangeValue('0.0001');
        expect(wrapper.state('amount')).toBe('0.0001');
    });

    it('should display correct values', () => {
        const proposals = [['2', '200']];
        const wrapper = setup({proposals});
        const nextState = { total: '0', priceMarket: '2' };

        wrapper.setState(nextState);

        const inputAmount = findInputAmount(wrapper);
        inputAmount.props().handleChangeValue('110');

        expect(wrapper.state('amount')).toBe('110');

        const total = wrapper.find('.cr-order-item__total').find('.cr-order-item__total__content').find('.cr-order-item__total__content__amount').props().children;
        const available = wrapper.find('.cr-order-item__available').find('.cr-order-item__available__content').find('.cr-order-item__available__content__amount').props().children;
        const fee = wrapper.find('.cr-order-item__fee').find('.cr-order-item__fee__content').find('.cr-order-item__fee__content__amount').props().children;

        expect(total).toEqual('220.00000');
        expect(available).toEqual('50.00000');
        expect(fee).toEqual('11.0000');
    });

    it('should display values with correct precision', () => {
        const currentMarketAskPrecision = 3;
        const currentMarketBidPrecision = 2;
        const proposals = [['2', '5']];
        const wrapper = setup({currentMarketAskPrecision, currentMarketBidPrecision, proposals});
        const nextState = { total: '0', priceMarket: '2' };

        wrapper.setState(nextState);

        const inputAmount = findInputAmount(wrapper);
        inputAmount.props().handleChangeValue('0.1');

        expect(wrapper.state('amount')).toBe('0.1');

        const total = wrapper.find('.cr-order-item__total').find('.cr-order-item__total__content').find('.cr-order-item__total__content__amount').props().children;
        const available = wrapper.find('.cr-order-item__available').find('.cr-order-item__available__content').find('.cr-order-item__available__content__amount').props().children;

        expect(total).toEqual('0.20');
        expect(available).toEqual('50.00');
    });
});
