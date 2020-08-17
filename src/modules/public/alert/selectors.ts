import { RootState } from '../../';
import { AlertState } from './reducer';

export const selectAlertState = (state: RootState): AlertState => state.public.alerts;
