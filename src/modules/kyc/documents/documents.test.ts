import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import { sendDocuments } from './actions';

const debug = false;

describe('KYC - Documents', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
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

    describe('Send documents', () => {
        const payloadFormData = new FormData();

        const confirmDocumentsResponse = {
            message: 'Success',
        };

        const expectedConfirmDocumentsFetch = {
            type: 'documents/SEND_DOCUMENTS_FETCH',
            payload: payloadFormData,
        };

        const expectedConfirmDocumentsData = {
            type: 'documents/SEND_DOCUMENTS_DATA',
            payload: confirmDocumentsResponse,
        };

        const expectedConfirmDocumentsError = {
            type: 'documents/SEND_DOCUMENTS_ERROR',
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        const expectedCallErrorHandler = {
            type: 'error/ERROR_DATA',
            payload: 500,
        };

        const mockConfirmDocumentsFetch = () => {
            mockAxios.onPost(`/resource/documents`).reply(200, confirmDocumentsResponse);
        };

        it('should fetch sending documents data', async () => {
            mockConfirmDocumentsFetch();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedConfirmDocumentsFetch);
                        expect(actions[1]).toEqual(expectedConfirmDocumentsData);
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
                    if (actions.length === 3) {
                        expect(actions[0]).toEqual(expectedConfirmDocumentsFetch);
                        expect(actions[1]).toEqual(expectedConfirmDocumentsError);
                        expect(actions[2]).toEqual(expectedCallErrorHandler);
                        resolve();
                    }
                });
            });
            store.dispatch(sendDocuments(payloadFormData));
            return promise;
        });
    });
});
