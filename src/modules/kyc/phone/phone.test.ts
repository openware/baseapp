import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import { resendCode, sendCode, verifyPhone } from './actions';

const debug = false;

describe('KYC - Phone', () => {
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

    describe('Send code', () => {
        const sendCodePayload = {
            phone_number: '38099999999',
        };

        const expectedSendCodeFetch = {
            type: 'phone/SEND_CODE_FETCH',
            payload: sendCodePayload,
        };

        const expectedSendCodeData = {
            type: 'phone/SEND_CODE_DATA',
        };

        const expectedSendCodeError = {
            type: 'phone/SEND_CODE_ERROR',
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        const expectedCallErrorHandler = {
            error: {
              code: 500,
              message: 'Server error',
            },
            type: 'error/ERROR_FETCH',
        };

        const mockSendCodeFetch = () => {
            mockAxios.onPost(`/resource/phones`).reply(200);
        };

        it('should handle send code data', async () => {
            mockSendCodeFetch();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedSendCodeFetch);
                        expect(actions[1]).toEqual(expectedSendCodeData);
                        resolve();
                    }
                });
            });
            store.dispatch(sendCode(sendCodePayload));
            return promise;
        });

        it('should handle send code error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 3) {
                        expect(actions[0]).toEqual(expectedSendCodeFetch);
                        expect(actions[1]).toEqual(expectedSendCodeError);
                        expect(actions[2]).toEqual(expectedCallErrorHandler);
                        resolve();
                    }
                });
            });
            store.dispatch(sendCode(sendCodePayload));
            return promise;
        });
    });

    describe('Confirm code', () => {
        const verifyCodeFetchPayload = {
            phone_number: '38099999999',
            verification_code: '000000',
        };

        const verifyCodeDataPayload = {
            message: 'message',
        };

        const expectedVerifyCodeFetch = {
            type: 'phone/VERIFY_PHONE_FETCH',
            payload: verifyCodeFetchPayload,
        };

        const expectedVerifyCodeData = {
            type: 'phone/VERIFY_PHONE_DATA',
            payload: verifyCodeDataPayload,
        };

        const expectedVerifyCodeError = {
            type: 'phone/VERIFY_PHONE_ERROR',
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        const expectedCallErrorHandler = {
            error: {
              code: 500,
              message: 'Server error',
            },
            type: 'error/ERROR_FETCH',
        };

        const mockVerifyCodeFetch = () => {
            mockAxios.onPost(`/resource/phones/verify`).reply(200, verifyCodeDataPayload);
        };

        it('should handle verify code data', async () => {
            mockVerifyCodeFetch();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedVerifyCodeFetch);
                        expect(actions[1]).toEqual(expectedVerifyCodeData);
                        resolve();
                    }
                });
            });
            store.dispatch(verifyPhone(verifyCodeFetchPayload));
            return promise;
        });

        it('should handle verify code error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 3) {
                        expect(actions[0]).toEqual(expectedVerifyCodeFetch);
                        expect(actions[1]).toEqual(expectedVerifyCodeError);
                        expect(actions[2]).toEqual(expectedCallErrorHandler);
                        resolve();
                    }
                });
            });
            store.dispatch(verifyPhone(verifyCodeFetchPayload));
            return promise;
        });
    });

    describe('Resend code', () => {
        const resendCodePayload = {
            phone_number: '38099999999',
        };

        const expectedResendCodeFetch = {
            type: 'phone/RESEND_CODE_FETCH',
            payload: resendCodePayload,
        };

        const expectedResendCodeData = {
            type: 'phone/RESEND_CODE_DATA',
        };

        const expectedResendCodeError = {
            type: 'phone/RESEND_CODE_ERROR',
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        const expectedCallErrorHandler = {
            error: {
              code: 500,
              message: 'Server error',
            },
            type: 'error/ERROR_FETCH',
        };

        const mockResendCodeFetch = () => {
            mockAxios.onPost(`/resource/phones/send_code`).reply(200);
        };

        it('should handle resend code data', async () => {
            mockResendCodeFetch();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedResendCodeFetch);
                        expect(actions[1]).toEqual(expectedResendCodeData);
                        resolve();
                    }
                });
            });
            store.dispatch(resendCode(resendCodePayload));
            return promise;
        });

        it('should handle resend code error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 3) {
                        expect(actions[0]).toEqual(expectedResendCodeFetch);
                        expect(actions[1]).toEqual(expectedResendCodeError);
                        expect(actions[2]).toEqual(expectedCallErrorHandler);
                        resolve();
                    }
                });
            });
            store.dispatch(resendCode(resendCodePayload));
            return promise;
        });
    });
});
