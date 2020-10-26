import { ApiKeys2FAModal, ApiKeysState, RootState } from '../../';

export const selectApiKeys = (state: RootState): ApiKeysState['apiKeys'] => state.user.apiKeys.apiKeys;

export const selectApiKeysDataLoaded = (state: RootState): ApiKeysState['dataLoaded'] => state.user.apiKeys.dataLoaded;

export const selectApiKeysModal = (state: RootState): ApiKeys2FAModal['payload'] => state.user.apiKeys.modal;

export const selectApiKeysPageIndex = (state: RootState): number =>
    state.user.apiKeys.pageIndex;

export const selectApiKeysFirstElemIndex = (state: RootState, limit: number): number =>
    (state.user.apiKeys.pageIndex * limit) + 1;

export const selectApiKeysLastElemIndex = (state: RootState, limit: number): number =>
    (state.user.apiKeys.pageIndex * limit) + state.user.apiKeys.apiKeys.length;

export const selectApiKeysNextPageExists = (state: RootState): boolean =>
    state.user.apiKeys.nextPageExists;
