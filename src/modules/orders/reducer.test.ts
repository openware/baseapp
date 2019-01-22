import { userOrdersDefault } from './actions';
import { ordersReducer } from './reducer';


describe('todos reducer', () => {
    it('should return the initial state', () => {
        expect(ordersReducer(undefined, userOrdersDefault())).toEqual({
            loading: false,
            orders: {
                wait: [],
                done: [],
                cancel: [],
            },
            fees: [],
            feesLoading: false,
            cancelLoading: false,
            executeLoading: false,
        });
    });
});
