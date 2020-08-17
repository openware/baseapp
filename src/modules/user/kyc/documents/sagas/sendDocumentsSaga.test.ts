import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { CommonError } from '../../../../types';
import { sendDocuments, sendDocumentsData, sendDocumentsError } from '../actions';

const debug = false;

describe('KYC - Documents', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
    let mockAxios: MockAdapter;

    afterEach(() => {
        mockAxios.reset();
    });

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    const payloadFormData = new FormData();

    const confirmDocumentsResponse = {
        message: 'Success',
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const expectedActionsSuccess = [
        sendDocuments(payloadFormData),
        sendDocumentsData(confirmDocumentsResponse),
    ];

    const expectedActionsError = [
        sendDocuments(payloadFormData),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: sendDocumentsError,
            },
        }),
    ];

    const mockConfirmDocumentsFetch = () => {
        mockAxios.onPost(`/resource/documents`).reply(200, confirmDocumentsResponse);
    };

    it('should fetch sending documents data', async () => {
        mockConfirmDocumentsFetch();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsSuccess.length) {
                    expect(actions).toEqual(expectedActionsSuccess);
                    resolve();
                }
            });
        });
        store.dispatch(sendDocuments(payloadFormData));

        return promise;
    });

    it('should fetch sending documents error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsError.length) {
                    expect(actions).toEqual(expectedActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(sendDocuments(payloadFormData));

        return promise;
    });
});
