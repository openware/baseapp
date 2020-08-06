import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { generate2faQRData, generate2faQRError, generate2faQRFetch } from '../actions';


describe('Module: Generate 2fa QR', () => {
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

    const fakeError = {
        code: 500,
        message: ['Server error'],
    };

    const fakeCredentials =  {
        data: {
            barcode: 'barcode',
            url: 'test_url',
        },
    };

    const mockGenerate2faQR = () => {
        mockAxios.onPost('/resource/otp/generate_qrcode').reply(200, fakeCredentials);
    };

    const expectedActionsFetch = [generate2faQRFetch(), generate2faQRData(fakeCredentials.data)];
    const expectedActionsError = [generate2faQRFetch(), generate2faQRError(fakeError)];

    it('should change password in success flow', async () => {
        mockGenerate2faQR();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(generate2faQRFetch());

        return promise;
    });

    it('should trigger an error', async () => {
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
        store.dispatch(generate2faQRFetch());

        return promise;
    });
});
