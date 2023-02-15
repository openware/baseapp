import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga, sendError } from '../../../../modules/index';
import { CommonError } from '../../../types';
import { beneficiariesResendPin, beneficiariesResendPinData, beneficiariesResendPinError } from '../actions';

const debug = false;

describe('Beneficiaries resend pin', () => {
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

    const fakePayload = {
        id: 1,
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const mockBeneficiariesResendPin = () => {
        mockAxios.onPatch(`/account/beneficiaries/${fakePayload.id}/resend_pin`).reply(204);
    };

    const expectedBeneficiariesResendPinSuccess = [
        beneficiariesResendPin(fakePayload),
        beneficiariesResendPinData(fakePayload),
    ];

    const expectedBeneficiariesResendPinError = [
        beneficiariesResendPin(fakePayload),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: beneficiariesResendPinError,
            },
        }),
    ];

    it('should resend pin beneficiaries success flow', async () => {
        mockBeneficiariesResendPin();

        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedBeneficiariesResendPinSuccess.length) {
                    expect(actions).toEqual(expectedBeneficiariesResendPinSuccess);
                    resolve();
                }
            });
        });
        store.dispatch(beneficiariesResendPin(fakePayload));

        return promise;
    });

    it('should handle resend pin beneficiaries error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedBeneficiariesResendPinError.length) {
                    expect(actions).toEqual(expectedBeneficiariesResendPinError);
                    resolve();
                }
            });
        });
        store.dispatch(beneficiariesResendPin(fakePayload));

        return promise;
    });
});
