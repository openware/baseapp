import { RootState } from '../../../index';
import { CommonError, Label } from './actions';

export const selectLabelData = (state: RootState): Label[] =>
    state.user.label.data;

export const selectLabelError = (state: RootState): CommonError | undefined =>
    state.user.label.error;

export const selectLabelFetching = (state: RootState): boolean =>
    state.user.label.isFetching;
