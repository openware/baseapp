import { createStore } from 'redux';
import { rootReducer } from '../../index';
import * as selectors from './selectors';


describe('Current History selectors', () => {
    const mockedStore = createStore(rootReducer).getState();
    const PAGE_LIMIT = 6;

    it('should check selectHistory selector', () => {
        expect(selectors.selectHistory(mockedStore)).toEqual(mockedStore.user.history.list);
    });

    it('should check selectFullHistory selector', () => {
        expect(selectors.selectFullHistory(mockedStore)).toEqual(mockedStore.user.history.fullHistory);
    });

    it('should check selectCurrentPage selector', () => {
        expect(selectors.selectCurrentPage(mockedStore)).toEqual(mockedStore.user.history.page);
    });

    it('should check selectPageCount selector', () => {
        expect(selectors.selectPageCount(mockedStore ,6)).toEqual(Math.ceil(mockedStore.user.history.fullHistory / PAGE_LIMIT));
    });

    it('should check selectFirstElemIndex selector', () => {
        expect(selectors.selectFirstElemIndex(mockedStore, 6)).toEqual((mockedStore.user.history.page * PAGE_LIMIT) + 1);
    });

    it('should check selectNextPageExists selector', () => {
        expect(selectors.selectNextPageExists(mockedStore, 6))
            .toEqual((mockedStore.user.history.page + 1) < selectors.selectPageCount(mockedStore, 6));
    });

    it('should check selectHistoryLoading selector', () => {
        expect(selectors.selectHistoryLoading(mockedStore)).toEqual(mockedStore.user.history.fetching);
    });
});
