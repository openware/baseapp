import { RootState } from '../../index';
import { CurrencyHistory } from './reducer';


const PAGE_LIMIT = 6;

export const selectCurrencyHistory = (state: RootState): CurrencyHistory[] =>
    state.app.currencyHistory.list;

export const selectFullHistory = (state: RootState): number =>
    state.app.currencyHistory.fullHistory;

export const selectCurrentPage = (state: RootState): number =>
    state.app.currencyHistory.page;

export const selectPageCount = (state: RootState): number =>
    Math.ceil(state.app.currencyHistory.fullHistory / PAGE_LIMIT);

export const selectFirstElemIndex = (state: RootState): number =>
    (state.app.currencyHistory.page * PAGE_LIMIT) + 1;

export const selectLastElemIndex = (state: RootState): number => {
    if ((state.app.currencyHistory.page * PAGE_LIMIT) + PAGE_LIMIT > selectFullHistory(state)) {
        return selectFullHistory(state);
    } else {
        return (state.app.currencyHistory.page * PAGE_LIMIT) + PAGE_LIMIT;
    }
};

export const selectNextPageExists = (state: RootState): boolean =>
    (state.app.currencyHistory.page + 1) < selectPageCount(state);

export const selectCurrencyHistoryLoading = (state: RootState): boolean =>
    state.app.currencyHistory.fetching;
