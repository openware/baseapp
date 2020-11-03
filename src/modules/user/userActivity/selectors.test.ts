import { createStore } from 'redux';

import { rootReducer } from '../../';
import {
    selectTotalNumber,
    selectUserActivity,
    selectUserActivityCurrentPage,
    selectUserActivityFirstElemIndex,
    selectUserActivityLastElemIndex,
    selectUserActivityLoading,
    selectUserActivityNextPageExists,
    selectUserActivityPageCount,
} from './selectors';

describe('User activity selectors', () => {
    const state = createStore(rootReducer).getState();
    const limit = 25;

    it('should select User activity', () => {
        expect(selectUserActivity(state)).toEqual(state.user.userActivity.list);
    });

    it('should select Total Number', () => {
        expect(selectTotalNumber(state)).toEqual(state.user.userActivity.total);
    });

    it('should select User Activity Current Page', () => {
        expect(selectUserActivityCurrentPage(state)).toEqual(state.user.userActivity.page);
    });

    it('should select User Activity Page Count', () => {
        expect(selectUserActivityPageCount(state, limit)).toEqual(Math.ceil(state.user.userActivity.total / limit));
    });

    it('should select User Activity First Elem Index', () => {
        expect(selectUserActivityFirstElemIndex(state, limit)).toEqual(state.user.userActivity.page * limit + 1);
    });

    it('should select User Activity Last Elem Index', () => {
        expect(selectUserActivityLastElemIndex(state, limit)).toEqual(
            state.user.userActivity.page * limit + limit > selectTotalNumber(state)
                ? selectTotalNumber(state)
                : state.user.userActivity.page * limit + limit
        );
    });

    it('should select User Activity Next Page Exists', () => {
        expect(selectUserActivityNextPageExists(state, limit)).toEqual(
            state.user.userActivity.page + 1 < selectUserActivityPageCount(state, limit)
        );
    });

    it('should select User Activity Loading', () => {
        expect(selectUserActivityLoading(state)).toEqual(state.user.userActivity.loading);
    });
});
