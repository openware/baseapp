import { createStore } from 'redux';
import { rootReducer } from '../index';
import * as selectors from './selectors';


describe('Open Orders selectors', () => {
    const mockedStore = createStore(rootReducer).getState();

    it('should check selectOpenOrdersList selector', () => {
        expect(selectors.selectOpenOrdersList(mockedStore)).toEqual(mockedStore.app.openOrders.list);
    });

    it('should check selectOpenOrdersFetching selector', () => {
        expect(selectors.selectOpenOrdersFetching(mockedStore)).toEqual(mockedStore.app.openOrders.fetching);
    });

    it('should check selectCancelOpenOrdersFetching selector', () => {
        expect(selectors.selectCancelOpenOrdersFetching(mockedStore)).toEqual(mockedStore.app.openOrders.cancelFetching);
    });
});
