import { createStore } from 'redux';
import { rootReducer } from '../../index';
import * as selectors from './selectors';


describe('Orders History selectors', () => {
    const mockedStore = createStore(rootReducer).getState();
    const PAGE_LIMIT = 25;

    it('should check selectOrdersHistory selector', () => {
        expect(selectors.selectOrdersHistory(mockedStore)).toEqual(mockedStore.user.ordersHistory.list);
    });

    it('should check selectTotalOrdersHistory selector', () => {
        expect(selectors.selectTotalOrdersHistory(mockedStore)).toEqual(mockedStore.user.ordersHistory.total);
    });

    it('should check selectCurrentPageIndex selector', () => {
        expect(selectors.selectCurrentPageIndex(mockedStore)).toEqual(mockedStore.user.ordersHistory.pageIndex);
    });

    it('should check selectOrdersPageCount selector', () => {
        expect(selectors.selectOrdersPageCount(mockedStore ,25)).toEqual(Math.ceil(mockedStore.user.ordersHistory.total / PAGE_LIMIT));
    });

    it('should check selectOrdersFirstElemIndex selector', () => {
        expect(selectors.selectOrdersFirstElemIndex(mockedStore, 25)).toEqual((mockedStore.user.ordersHistory.pageIndex * PAGE_LIMIT) + 1);
    });

    it('should check selectOrdersNextPageExists selector', () => {
        expect(selectors.selectOrdersNextPageExists(mockedStore, 25))
            .toEqual((mockedStore.user.ordersHistory.pageIndex + 1) < selectors.selectOrdersPageCount(mockedStore, 25));
    });

    it('should check selectOrdersHistoryLoading selector', () => {
        expect(selectors.selectOrdersHistoryLoading(mockedStore)).toEqual(mockedStore.user.ordersHistory.fetching);
    });

    it('should check selectCancelAllFetching selector', () => {
        expect(selectors.selectCancelAllFetching(mockedStore)).toEqual(mockedStore.user.ordersHistory.cancelAllFetching);
    });

    it('should check selectCancelFetching selector', () => {
        expect(selectors.selectCancelFetching(mockedStore)).toEqual(mockedStore.user.ordersHistory.cancelFetching);
    });
});
