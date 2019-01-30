import { RootState } from '..';
import { RangerState } from './reducer';

export const selectRanger = (state: RootState): RangerState =>
    state.app.ranger;

export const selectRangerIsConnected = (state: RootState): boolean =>
    state.app.ranger.connected;
