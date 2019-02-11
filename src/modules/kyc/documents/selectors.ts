import { RootState } from '../../index';
import { DocumentsState } from './reducer';

export const selectSendDocumentsSuccess = (state: RootState): DocumentsState['success'] =>
    state.app.documents.success;

export const selectSendDocumentsError = (state: RootState): DocumentsState['error'] =>
    state.app.documents.error;

export const selectSendDocumentsLoading = (state: RootState): DocumentsState['loading'] =>
    state.app.documents.loading;
