import * as actions from './actions';


describe('Orders History actions', () => {
    it('should check userOrdersHistoryFetch action creator', () => {
        const payload = { pageIndex: 0, type: 'all', limit: 25 };
        const expectedAction = { type: 'orders/USER_ORDERS_HISTORY_FETCH', payload };
        expect(actions.userOrdersHistoryFetch(payload)).toEqual(expectedAction);
    });

    it('should check userOrdersHistoryData action creator', () => {
        const payload = { list: [], pageIndex: 2, total: 0 };
        const expectedAction = { type: 'orders/USER_ORDERS_HISTORY_DATA', payload };
        expect(actions.userOrdersHistoryData(payload)).toEqual(expectedAction);
    });

    it('should check userOrdersHistoryError action creator', () => {
        const expectedAction = { type: 'orders/USER_ORDERS_HISTORY_ERROR' };
        expect(actions.userOrdersHistoryError()).toEqual(expectedAction);
    });
});
