import { RootState } from '../../../../modules';
import { CommonError } from '../../../../modules/types';
import { OrderIEOData } from './types';

export const selectIEOOrdersData = (state: RootState): OrderIEOData[] =>
    state.user.ieo.fetch.data;

export const selectIEOOrdersSuccess = (state: RootState): boolean =>
    state.user.ieo.fetch.success;

export const selectIEOOrdersLoading = (state: RootState): boolean =>
    state.user.ieo.fetch.loading;

export const selectIEOOrdersError = (state: RootState): CommonError | undefined =>
    state.user.ieo.fetch.error;

export const selectIEOOrderCancelSuccess = (state: RootState): boolean =>
    state.user.ieo.cancel.success;

export const selectIEOOrderCancelLoading = (state: RootState): boolean =>
    state.user.ieo.cancel.loading;

export const selectIEOOrderCancelError = (state: RootState): CommonError | undefined =>
    state.user.ieo.cancel.error;

export const selectIEOOrderExecuteData = (state: RootState): OrderIEOData | undefined =>
    state.user.ieo.execute.data;

export const selectIEOOrderExecuteSuccess = (state: RootState): boolean =>
    state.user.ieo.execute.success;

export const selectIEOOrderExecuteLoading = (state: RootState): boolean =>
    state.user.ieo.execute.loading;

export const selectIEOOrderExecuteError = (state: RootState): CommonError | undefined =>
    state.user.ieo.execute.error;

export const selectIEOHistoryData = (state: RootState): OrderIEOData[] =>
    state.user.ieo.history.data;

export const selectIEOHistoryLoading = (state: RootState): boolean =>
    state.user.ieo.history.loading;

export const selectIEOHistoryTotal = (state: RootState): number =>
    state.user.ieo.history.total;

export const selectIEOHistoryCurrentPage = (state: RootState): number =>
    state.user.ieo.history.page;

export const selectIEOHistoryPageCount = (state: RootState, limit): number =>
    Math.ceil(state.user.ieo.history.total / limit);

export const selectIEOHistoryFirstElemIndex = (state: RootState, limit): number =>
    state.user.ieo.history.page * limit;

export const selectIEOHistoryLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.user.ieo.history.page * limit) + limit > selectIEOHistoryTotal(state)) {
        return selectIEOHistoryTotal(state);
    } else {
        return (state.user.ieo.history.page * limit) + limit;
    }
};

export const selectIEOHistoryNextPageExists = (state: RootState, limit: number): boolean =>
    state.user.ieo.history.page < selectIEOHistoryPageCount(state, limit);

