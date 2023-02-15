import { CommonError } from '../../../types';
import * as actions from './actions';
import { documentsReducer, initialDocumentsState } from './reducer';

describe('Documents reducer', () => {
    const payloadFormData = new FormData();

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle SEND_DOCUMENTS_FETCH', () => {
        const expectedState = {
            ...initialDocumentsState,
            loading: true,
        };
        expect(
            documentsReducer(
                initialDocumentsState,
                actions.sendDocuments({ front_side: payloadFormData, selfie: payloadFormData }),
            ),
        ).toEqual(expectedState);
    });

    it('should handle SEND_DOCUMENTS_DATA', () => {
        const expectedState = {
            ...initialDocumentsState,
            success: true,
        };
        expect(documentsReducer(initialDocumentsState, actions.sendDocumentsData())).toEqual(expectedState);
    });

    it('should handle SEND_DOCUMENTS_ERROR', () => {
        const expectedState = {
            ...initialDocumentsState,
            error: error,
        };
        expect(documentsReducer(initialDocumentsState, actions.sendDocumentsError(error))).toEqual(expectedState);
    });
});
