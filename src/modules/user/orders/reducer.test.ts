import { OrderSide } from '../../types';
import {
    orderExecuteData,
    orderExecuteError,
    orderExecuteFetch,
} from './actions';
import { ordersReducer } from './reducer';

describe('Orders reducer', () => {
    const buy: OrderSide = 'buy';

    const someError = {
        code: 51,
        message: ['something went wrong'],
    };

    it('supports orderExecuteFetch', () => {
        const orderExecution = {
            market: 'ethbtc',
            side: buy,
            volume: '10',
            price: '0.01',
        };
        expect(ordersReducer(undefined, orderExecuteFetch(orderExecution)))
            .toEqual({
                currentPrice: undefined,
                executeLoading: true,
                executeError: undefined,
            });
    });

    it('supports orderExecuteData', () => {
        const initialState = {
            currentPrice: undefined,
            executeLoading: false,
        };

        expect(ordersReducer(initialState, orderExecuteData()))
            .toEqual({
                currentPrice: undefined,
                executeLoading: false,
                executeError: undefined,
            });
    });

    it('supports orderExecuteError', () => {
        expect(ordersReducer(undefined, orderExecuteError(someError)))
            .toEqual({
                currentPrice: undefined,
                executeLoading: false,
                executeError: someError,
            });
    });
});
