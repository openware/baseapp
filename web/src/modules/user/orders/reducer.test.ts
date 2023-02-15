import { OrderSide } from '../../types';
import {
    orderExecuteData,
    orderExecuteError,
    orderExecuteFetch,
    setAmount,
    setCurrentPrice,
    setOrderType,
} from './actions';
import { ordersReducer } from './reducer';

describe('Orders reducer', () => {
    const buy: OrderSide = 'buy';

    const someError = {
        code: 51,
        message: ['something went wrong'],
    };

    const initialState = {
        executeLoading: false,
        currentPrice: undefined,
        amount: '',
        orderType: '',
    };

    it('supports orderExecuteFetch', () => {
        const orderExecution = {
            market: 'ethbtc',
            side: buy,
            volume: '10',
            price: '0.01',
        };
        expect(ordersReducer(undefined, orderExecuteFetch(orderExecution))).toEqual({
            currentPrice: undefined,
            executeLoading: true,
            executeError: undefined,
            amount: '',
            orderType: '',
        });
    });

    it('supports orderExecuteData', () => {
        expect(ordersReducer(initialState, orderExecuteData())).toEqual({
            currentPrice: undefined,
            executeLoading: false,
            executeError: undefined,
            amount: '',
            orderType: '',
        });
    });

    it('supports orderExecuteError', () => {
        expect(ordersReducer(undefined, orderExecuteError(someError))).toEqual({
            currentPrice: undefined,
            executeLoading: false,
            executeError: someError,
            amount: '',
            orderType: '',
        });
    });

    it('supports setCurrentPrice', () => {
        expect(ordersReducer(initialState, setCurrentPrice(42))).toEqual({
            currentPrice: 42,
            executeLoading: false,
            executeError: undefined,
            amount: '',
            orderType: '',
        });
    });

    it('supports setAmount', () => {
        expect(ordersReducer(initialState, setAmount('42'))).toEqual({
            currentPrice: undefined,
            executeLoading: false,
            executeError: undefined,
            amount: '42',
            orderType: '',
        });
    });

    it('supports setOrderType', () => {
        expect(ordersReducer(initialState, setOrderType('Market'))).toEqual({
            currentPrice: undefined,
            executeLoading: false,
            executeError: undefined,
            amount: '',
            orderType: 'Market',
        });
    });
});
