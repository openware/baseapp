import { RootState } from '../../../index';
import { Label } from './actions';

export const selectLabelData = (state: RootState): Label[] =>
    state.user.label.data;

export const selectLabelFetching = (state: RootState): boolean =>
    state.user.label.isFetching;
