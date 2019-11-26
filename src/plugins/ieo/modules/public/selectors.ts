import { RootState } from '../../../../modules';
import { CommonError } from '../../../../modules/types';
import { DataIEOInterface } from './types';

export const selectIEO = (state: RootState): DataIEOInterface[] =>
    state.public.ieo.list;

export const selectIEOLoading = (state: RootState): boolean =>
    state.public.ieo.loading;

export const selectIEOSuccess = (state: RootState): boolean =>
    state.public.ieo.success;

export const selectIEOError = (state: RootState): CommonError | undefined =>
    state.public.ieo.error;

export const selectCurrentIEO = (state: RootState): DataIEOInterface | undefined =>
    state.public.ieo.currentIEO;

// tslint:disable-next-line: no-any
export const selectCurrentIEODetails = (state: RootState): any =>
    state.public.ieo.ieoDetails;
