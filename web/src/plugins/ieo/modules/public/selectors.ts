import { RootState } from '../../../../modules';
import { CommonError } from '../../../../modules/types';
import { DataIEOInterface } from './types';

export const selectIEO = (state: RootState): DataIEOInterface[] =>
    state.plugins.ieo.public.list;

export const selectIEOLoading = (state: RootState): boolean =>
    state.plugins.ieo.public.loading;

export const selectIEOSuccess = (state: RootState): boolean =>
    state.plugins.ieo.public.success;

export const selectIEOError = (state: RootState): CommonError | undefined =>
    state.plugins.ieo.public.error;

export const selectCurrentIEO = (state: RootState): DataIEOInterface | undefined =>
    state.plugins.ieo.public.currentIEO;

export const selectNewIEO = (state: RootState): DataIEOInterface | undefined =>
    state.plugins.ieo.public.newIEO;
