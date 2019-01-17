import { RootState } from '../index';
import { ContactState } from './reducer';

export const selectSendEmailSuccess = (state: RootState): ContactState['success'] =>
    state.app.contact.success;

export const selectSendEmailError = (state: RootState): ContactState['error'] =>
    state.app.contact.error;
