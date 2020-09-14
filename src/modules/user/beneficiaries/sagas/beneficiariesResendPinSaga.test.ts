import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga } from '../../../../modules/index';
import {
    beneficiariesResendPin,
    beneficiariesResendPinData,
    beneficiariesResendPinError,
} from '../actions';

const debug = false;

describe('Beneficiaries Resend Pin', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
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

    const fakeSuccessPayload = {
        sent_at: '',
    };

    const fakeError = {
        code: 500,
        message: ['Server error'],
    };

    const mockBeneficiariesActivate = () => {
        mockAxios.onPatch(`/account/beneficiaries/${fakePayload.id}/resend_pin`).reply(200, fakeSuccessPayload);
    };

    const expectedBeneficiariesActivateSuccess = [
        beneficiariesResendPin(fakePayload),
        beneficiariesResendPinData(fakeSuccessPayload),
    ];

    const expectedBeneficiariesActivateError = [
        beneficiariesResendPin(fakePayload),
        beneficiariesResendPinError(fakeError),
    ];

    it('should resend pin code for beneficiary in success flow', async () => {
        mockBeneficiariesActivate();

        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedBeneficiariesActivateSuccess.length) {
                    expect(actions).toEqual(expectedBeneficiariesActivateSuccess);
                    resolve();
                }
            });
        });
        store.dispatch(beneficiariesResendPin(fakePayload));

        return promise;
    });

    it('should handle resend pin code for beneficiary error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedBeneficiariesActivateError.length) {
                    expect(actions).toEqual(expectedBeneficiariesActivateError);
                    resolve();
                }
            });
        });
        store.dispatch(beneficiariesResendPin(fakePayload));

        return promise;
    });
});
