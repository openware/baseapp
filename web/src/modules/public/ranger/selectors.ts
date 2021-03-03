import { RootState } from '../..';
import { RangerState } from './reducer';

export const selectRanger = (state: RootState): RangerState =>
    state.public.ranger;

export const selectRangerIsConnected = (state: RootState): boolean =>
    state.public.ranger.connected;

export const selectRangerIsConnecting = (state: RootState): boolean =>
    state.public.ranger.connecting;

export const selectSubscriptions = (state: RootState): string[] =>
    state.public.ranger.subscriptions;

export const selectRangerTimestamp = (state: RootState): number | undefined =>
    state.public.ranger.timestamp;

export const selectShouldRangerConnect = (state: RootState): boolean =>
    !selectRangerTimestamp(state) && !selectRangerIsConnecting(state);
