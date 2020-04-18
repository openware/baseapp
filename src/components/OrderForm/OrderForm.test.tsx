import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { SinonSpy, spy } from 'sinon';
import { DropdownComponent } from '../Dropdown';
import { PercentageButton } from '../PercentageButton';
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
    // proposals: [['10','1']],
    listenInputPrice: spy(),
    handleAmountChange: spy(),
    handleChangeAmountByButton: spy(),
    amount: '1.5',
    totalPrice: 0,
};

const setup = (props: Partial<OrderFormProps> = {}) =>
    shallow(<OrderForm {...{ ...defaultProps, ...props }} />);

// TODO: Requires changes to almost all tests since the logic of calculation was moved to parent component
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

    it('should render dropdown', () => {
        const wrapper = setup();
        const dropdown = wrapper.find(DropdownComponent);
        expect(dropdown.at(0).props().list).toEqual(['Limit', 'Market']);
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
        expect(submitButton.props().children).toBe('buy');

        wrapper = setup({ type: 'sell' });
        submitButton = wrapper.find(Button);
        expect(submitButton.props().children).toBe('sell');
    });

    it('should call onSubmit callback', () => {
        const onSubmit: SinonSpy = spy();
        const wrapper = setup({ onSubmit });

        const nextState = { price: '135.58' };
        wrapper.setState(nextState);

        const submitButton = wrapper.find(Button);
        submitButton.simulate('click');

        expect(onSubmit.calledOnceWith({type: 'buy', orderType: 'Limit', price: nextState.price, amount: '1.5', available: 50})).toBeTruthy();
    });

    it('should disable button if price is 0 in Limit order', () => {
        const onSubmit: SinonSpy = spy();
        const wrapper = setup({ onSubmit });

        const orderState = { orderType: 'Limit' };
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
        const orderState = { orderType: 'Market' };
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
        let amountProps = '0.001';
        let wrapper = setup({ onSubmit, amount: amountProps });
        const orderState = { orderType: 'Limit', price: '118.643' };
        wrapper.setState(orderState);

        let submitButton = wrapper.find(Button);
        expect(submitButton.props().disabled).toBe(false);

        amountProps = '0';
        wrapper = setup({ onSubmit, amount: amountProps });

        submitButton = wrapper.find(Button);
        expect(submitButton.props().disabled).toBe(true);
    });

    it('should disable button amount 0 in Market order', () => {
        const onSubmit: SinonSpy = spy();
        let amountProps = '0.001';
        let wrapper = setup({ onSubmit, amount: amountProps });
        const orderState = { orderType: 'Market'};
        wrapper.setState(orderState);

        let submitButton = wrapper.find(Button);
        expect(submitButton.props().disabled).toBe(false);

        amountProps = '0';
        wrapper = setup({ onSubmit, amount: amountProps });

        submitButton = wrapper.find(Button);
        expect(submitButton.props().disabled).toBe(true);
    });

    const findInputPrice = (wrapper: ShallowWrapper) => wrapper.find('.cr-order-item').at(1).find('div').last().children().last();

    it('should handle change price when it was set as priceLimit', () => {
        const wrapper = setup();
        const inputPrice = findInputPrice(wrapper);

        inputPrice.props().handleChangeValue('1');
        expect(wrapper.state('price')).toBe('1');

        inputPrice.props().handleChangeValue('123456');
        expect(wrapper.state('price')).toBe('123456');
    });
});
