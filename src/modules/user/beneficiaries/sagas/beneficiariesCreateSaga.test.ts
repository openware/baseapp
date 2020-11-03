import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga, sendError } from '../../../../modules/index';
import { CommonError } from '../../../types';
import {
    beneficiariesCreate,
    beneficiariesCreateData,
    beneficiariesCreateError,
    beneficiariesDataUpdate,
} from '../actions';
import { Beneficiary } from '../types';

const debug = false;

describe('Beneficiaries Create', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    describe('Create beneficiaries data', () => {
        const fakePayload = {
            currency: 'eth',
            name: 'First company',
            data: '{"address": "0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a"}',
        };

        const fakeSuccessPayload: Beneficiary = {
            id: 1,
            currency: 'eth',
            name: 'First company',
            state: 'pending',
            data: {
                address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
            },
        };

        const mockBeneficiariesCreate = () => {
            mockAxios.onPost('/account/beneficiaries').reply(200, fakeSuccessPayload);
        };

        const error: CommonError = {
            code: 500,
            message: ['Server error'],
        };

        const expectedBeneficiariesCreateSuccess = [
            beneficiariesCreate(fakePayload),
            beneficiariesCreateData(fakeSuccessPayload),
            beneficiariesDataUpdate(fakeSuccessPayload),
        ];

        const expectedBeneficiariesCreateError = [
            beneficiariesCreate(fakePayload),
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: beneficiariesCreateError,
                },
            }),
        ];

        it('should create beneficiaries in success flow', async () => {
            mockBeneficiariesCreate();

            const promise = new Promise((resolve) => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedBeneficiariesCreateSuccess.length) {
                        expect(actions).toEqual(expectedBeneficiariesCreateSuccess);
                        resolve();
                    }
                });
            });
            store.dispatch(beneficiariesCreate(fakePayload));

            return promise;
        });

        it('should handle create beneficiaries error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise((resolve) => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedBeneficiariesCreateError.length) {
                        expect(actions).toEqual(expectedBeneficiariesCreateError);
                        resolve();
                    }
                });
            });
            store.dispatch(beneficiariesCreate(fakePayload));

            return promise;
        });
    });
});
