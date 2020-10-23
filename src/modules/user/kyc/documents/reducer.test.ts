import * as actions from './actions';
import { documentsReducer, initialDocumentsState } from './reducer';

describe('Documents reducer', () => {
    const payloadFormData = new FormData();

    const confirmDocumentsResponse = {
        message: 'Success',
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle SEND_DOCUMENTS_FETCH', () => {
        const expectedState = {
            ...initialDocumentsState,
            loading: true,
        };
        expect(documentsReducer(initialDocumentsState, actions.sendDocuments(payloadFormData))).toEqual(expectedState);
    });

    it('should handle SEND_DOCUMENTS_DATA', () => {
        const expectedState = {
            ...initialDocumentsState,
            success: confirmDocumentsResponse.message,
        };
        expect(documentsReducer(initialDocumentsState, actions.sendDocumentsData(confirmDocumentsResponse))).toEqual(expectedState);
    });

    it('should handle SEND_DOCUMENTS_ERROR', () => {
        const expectedState = {
            ...initialDocumentsState,
            error: error,
        };
        expect(documentsReducer(initialDocumentsState, actions.sendDocumentsError(error))).toEqual(expectedState);
    });
});
