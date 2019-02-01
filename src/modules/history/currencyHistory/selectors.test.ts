import { createStore } from 'redux';
import { rootReducer } from '../../';
import * as selectors from './selectors';


describe('Current History selectors', () => {
    const mockedStore = createStore(rootReducer).getState();
    const PAGE_LIMIT = 6;

    it('should check selectCurrencyHistory selector', () => {
        expect(selectors.selectCurrencyHistory(mockedStore)).toEqual(mockedStore.app.currencyHistory.list);
    });

    it('should check selectFullHistory selector', () => {
        expect(selectors.selectFullHistory(mockedStore)).toEqual(mockedStore.app.currencyHistory.fullHistory);
    });

    it('should check selectCurrentPage selector', () => {
        expect(selectors.selectCurrentPage(mockedStore)).toEqual(mockedStore.app.currencyHistory.page);
    });

    it('should check selectPageCount selector', () => {
        expect(selectors.selectPageCount(mockedStore)).toEqual(Math.ceil(mockedStore.app.currencyHistory.fullHistory / PAGE_LIMIT));
    });

    it('should check selectFirstElemIndex selector', () => {
        expect(selectors.selectFirstElemIndex(mockedStore)).toEqual((mockedStore.app.currencyHistory.page * PAGE_LIMIT) + 1);
    });

    it('should check selectNextPageExists selector', () => {
        expect(selectors.selectNextPageExists(mockedStore))
            .toEqual((mockedStore.app.currencyHistory.page + 1) < selectors.selectPageCount(mockedStore));
    });

    it('should check selectCurrencyHistoryLoading selector', () => {
        expect(selectors.selectCurrencyHistoryLoading(mockedStore)).toEqual(mockedStore.app.currencyHistory.fetching);
    });
});
