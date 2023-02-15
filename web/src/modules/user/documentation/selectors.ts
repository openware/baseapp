import { RootState } from '../../../modules';
import { CommonError } from '../../../modules/types';
import { DocTradeUserApiDataInterface } from './types';

export const selectDocumentationData = (state: RootState): DocTradeUserApiDataInterface | undefined =>
    state.user.documentation.data;

export const selectDocumentationLoading = (state: RootState): boolean => state.user.documentation.loading;

export const selectDocumentationSuccess = (state: RootState): boolean => state.user.documentation.success;

export const selectDocumentationError = (state: RootState): CommonError | undefined => state.user.documentation.error;

export const selectDocumentationTimestamp = (state: RootState): number | undefined =>
    state.user.documentation.timestamp;

export const selectShouldFetchDocumentation = (state: RootState): boolean =>
    !selectDocumentationTimestamp(state) && !selectDocumentationLoading(state);
