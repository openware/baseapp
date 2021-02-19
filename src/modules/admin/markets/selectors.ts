import { RootState } from '../../';
import { MarketsAdminState } from './reducer';

export const selectMarketsAdminList = (state: RootState): MarketsAdminState['list'] =>
    state.admin.markets.list;

export const selectMarketsAdminListLoading = (state: RootState): MarketsAdminState['loading'] =>
    state.admin.markets.loading;

export const selectMarketsAdminUpdate = (state: RootState): MarketsAdminState['successMarketsUpdate'] =>
    state.admin.markets.successMarketsUpdate;

export const selectEnabledMarketsAdminList = (state: RootState): MarketsAdminState['enabledMarkets'] =>
    state.admin.markets.enabledMarkets;
