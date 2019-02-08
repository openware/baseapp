import { RootState } from '../index';
import { AlertState } from './reducer';

export const selectAlertState = (state: RootState): AlertState => state.app.alert;
