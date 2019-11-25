import { Button, PercentageButton } from '@openware/components';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';
import { OrderForm, OrderFormProps } from './';

// tslint:disable:no-magic-numbers
type DropdownElem = number | string | React.ReactNode;
type FormType = 'buy' | 'sell';

const defaultOrderTypes: DropdownElem[] = [
    'Limit',
    'Market',
];

const defaultProps = {
    orderTypes: defaultOrderTypes,
    orderTypesIndex: defaultOrderTypes,
    type: 'buy' as FormType,
    currentMarketAskPrecision: 4,
    currentMarketBidPrecision: 5,
    available: 50,
    priceMarket: 5,
    priceLimit: 12,
    price: '',
    from: 'btc',
    to: 'eth',
    onSubmit: spy(),
    proposals: [['10','1']],
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
        let wrapper = setup();
        let submitButton = wrapper.find(Button);
        expect(submitButton.props().label.toLowerCase()).toBe('buy');

        wrapper = setup({ type: 'sell' });
        submitButton = wrapper.find(Button);
        expect(submitButton.props().label.toLowerCase()).toBe('sell');
    });

    it('should disable button if price is 0 in Limit order', () => {
        const onSubmit: SinonSpy = spy();
        const wrapper = setup({ onSubmit });

        const orderState = { orderType: 'Limit', amount: '0.05' };
        wrapper.setState(orderState);

        let priceState = { price: '118.643' };
        wrapper.setState(priceState);

        let submitButton = wrapper.find(Button);
        expect(submitButton.props().disabled).toBe(false);

        priceState = { price: '0' };
        wrapper.setState(priceState);

        submitButton = wrapper.find(Button);
        expect(submitButton.props().disabled).toBe(true);
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

    it('should disable button if amount is 0 in Limit order', () => {
        const onSubmit: SinonSpy = spy();
        const wrapper = setup({ onSubmit });
        const orderState = { orderType: 'Limit', price: '118.643' };
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

    it('should set correct values by percentage buttons when type is buy', () => {
        const type = 'buy';
        const wrapper = setup({type});
        const nextState = { price: '2' };

        wrapper.setState(nextState);

        const inputAmount = findInputAmount(wrapper);
        inputAmount.props().handleChangeValue('10');

        expect(wrapper.state('amount')).toBe('10');

        const firstPercentageButton = wrapper.find(PercentageButton).at(0);
        firstPercentageButton.simulate('click');

        expect(wrapper.state('amount')).toBe('6.2500');

        const secondPercentageButton = wrapper.find(PercentageButton).at(1);
        secondPercentageButton.simulate('click');

        expect(wrapper.state('amount')).toBe('12.5000');

        const thirdPercentageButton = wrapper.find(PercentageButton).at(2);
        thirdPercentageButton.simulate('click');

        expect(wrapper.state('amount')).toBe('18.7500');

        const fourthPercentageButton = wrapper.find(PercentageButton).at(3);
        fourthPercentageButton.simulate('click');

        expect(wrapper.state('amount')).toBe('25.0000');
    });

    it('should set correct values by percentage buttons when type is sell', () => {
        const type = 'sell';
        const wrapper = setup({type});
        const nextState = { price: '2' };

        wrapper.setState(nextState);

        const inputAmount = findInputAmount(wrapper);
        inputAmount.props().handleChangeValue('10');

        expect(wrapper.state('amount')).toBe('10');

        const firstPercentageButton = wrapper.find(PercentageButton).at(0);
        firstPercentageButton.simulate('click');

        expect(wrapper.state('amount')).toBe('12.5000');

        const secondPercentageButton = wrapper.find(PercentageButton).at(1);
        secondPercentageButton.simulate('click');

        expect(wrapper.state('amount')).toBe('25.0000');

        const thirdPercentageButton = wrapper.find(PercentageButton).at(2);
        thirdPercentageButton.simulate('click');

        expect(wrapper.state('amount')).toBe('37.5000');

        const fourthPercentageButton = wrapper.find(PercentageButton).at(3);
        fourthPercentageButton.simulate('click');

        expect(wrapper.state('amount')).toBe('50.0000');
    });

    it('should display correct values', () => {
        const type = 'buy';
        const proposals = [['2', '200']];
        const wrapper = setup({type, proposals});
        const nextState = { total: '0', price: '2' };

        wrapper.setState(nextState);

        const inputAmount = findInputAmount(wrapper);
        inputAmount.props().handleChangeValue('110');

        expect(wrapper.state('amount')).toBe('110');

        const total = wrapper.find('.cr-order-item__total').find('.cr-order-item__total__content').find('.cr-order-item__total__content__amount').props().children;
        const available = wrapper.find('.cr-order-item__available').find('.cr-order-item__available__content').find('.cr-order-item__available__content__amount').props().children;

        expect(total).toEqual('220.0000');
        expect(available).toEqual('50.00000');
    });

    it('should display values with correct precision', () => {
        const type = 'buy';
        const currentMarketAskPrecision = 3;
        const currentMarketBidPrecision = 2;
        const proposals = [['2', '5']];
        const wrapper = setup({type, currentMarketAskPrecision, currentMarketBidPrecision, proposals});
        const nextState = { total: '0', price: '2' };

        wrapper.setState(nextState);

        const inputAmount = findInputAmount(wrapper);
        inputAmount.props().handleChangeValue('0.1');

        expect(wrapper.state('amount')).toBe('0.1');

        const total = wrapper.find('.cr-order-item__total').find('.cr-order-item__total__content').find('.cr-order-item__total__content__amount').props().children;
        const available = wrapper.find('.cr-order-item__available').find('.cr-order-item__available__content').find('.cr-order-item__available__content__amount').props().children;

        expect(total).toEqual('0.200');
        expect(available).toEqual('50.00');
    });

    const findInputPrice = (wrapper: ShallowWrapper) => wrapper.find('.cr-order-item').at(0).find('div').last().children().last();

    it('should handle change price when it was set as priceLimit', () => {
        const wrapper = setup();
        const inputPrice = findInputPrice(wrapper);

        inputPrice.props().handleChangeValue('1');
        expect(wrapper.state('price')).toBe('1');

        inputPrice.props().handleChangeValue('123456');
        expect(wrapper.state('price')).toBe('123456');
    });
});
