import { RootState } from '../../index';
import { CommonError, Label } from './actions';

export const selectLabelData = (state: RootState): Label[] =>
    state.app.label.data;

export const selectLabelError = (state: RootState): CommonError | undefined =>
    state.app.label.error;

export const selectLabelFetching = (state: RootState): boolean =>
    state.app.label.isFetching;
