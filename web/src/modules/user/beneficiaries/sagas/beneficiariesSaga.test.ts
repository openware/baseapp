import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga, sendError } from '../../../../modules';
import { CommonError } from '../../../types';
import { beneficiariesData, beneficiariesError, beneficiariesFetch } from '../actions';
import { Beneficiary } from '../types';

describe('Beneficiaries Fetch', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, false)();
        sagaMiddleware.run(rootSaga);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    const fakeBeneficiaries: Beneficiary[] = [
        {
            id: 1,
            currency: 'eth',
            name: 'First company',
            state: 'active',
            data: {
                address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
            },
        },
        {
            id: 2,
            currency: 'usd',
            name: 'Second company',
            state: 'active',
            description: 'Information about second company',
            data: {
                address: 'Somestreet 42, City',
                country: 'Wakanda',
                full_name: 'Some name',
                account_number: '1234512345',
                account_type: 'Account type',
                bank_name: 'First bank',
                bank_address: 'Anotherstreet 13',
                bank_country: 'Wakanda',
            },
        },
    ];

    const mockBeneficiaries = () => {
        mockAxios.onGet(`/account/beneficiaries`).reply(200, fakeBeneficiaries);
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const expectedBeneficiariesActionsFetch = [
        beneficiariesFetch(),
        beneficiariesData(fakeBeneficiaries),
    ];

    const expectedBeneficiariesActionsError = [
        beneficiariesFetch(),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: beneficiariesError,
            },
        }),
    ];

    it('should fetch benefciiaries in success flow', async () => {
        mockBeneficiaries();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedBeneficiariesActionsFetch.length) {
                    expect(actions).toEqual(expectedBeneficiariesActionsFetch);
                    resolve();
                }
            });
        });
        store.dispatch(beneficiariesFetch());

        return promise;
    });

    it('should trigger fetch benefciiaries error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedBeneficiariesActionsError.length) {
                    expect(actions).toEqual(expectedBeneficiariesActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(beneficiariesFetch());

        return promise;
    });
});
