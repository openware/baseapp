import * as actions from './actions';

describe('Profile actions', () => {
    const error: CommonError = {
        code: 401,
        message: ['Invalid Session'],
    };

    describe('User actions', () => {
        it('should check userFetch action creator', () => {
            const expectedAction = { type: 'profile/GET_USER_FETCH' };
            expect(actions.userFetch()).toEqual(expectedAction);
        });

        it('should check userData action creator', () => {
            const payload = {
                user: {
                    email: 'admin@barong.io',
                    uid: 'ID26C901376F',
                    role: 'admin',
                    level: 3,
                    otp: false,
                    state: 'active',
                    profiles: [],
                    csrf_token: '31415926535897932384626433832795028841971',
                    referal_uid: '',
                    labels: [],
                    phone: [],
                    created_at: '',
                    updated_at: '',
                },
            };
            const expectedAction = { type: 'profile/GET_USER_DATA', payload };
            expect(actions.userData(payload)).toEqual(expectedAction);
        });

        it('should check userError action creator', () => {
            const expectedAction = { type: 'profile/GET_USER_ERROR', error };
            expect(actions.userError(error)).toEqual(expectedAction);
        });

        it('should check userReset action creator', () => {
            const expectedAction = { type: 'profile/RESET_USER' };
            expect(actions.userReset()).toEqual(expectedAction);
        });

        it('should change user level', () => {
            const expectedAction = {
                type: 'profile/CHANGE_USER_LEVEL',
                payload: {
                    level: 1,
                },
            };
            expect(actions.changeUserLevel({ level: 1 })).toEqual(expectedAction);
        });
    });

    describe('Change password actions', () => {
        it('should check changePasswordFetch action creator', () => {
            const payload = {
                old_password: '123123',
                new_password: '123',
                confirm_password: '123',
            };
            const expectedAction = { type: 'profile/CHANGE_PASSWORD_FETCH', payload };
            expect(actions.changePasswordFetch(payload)).toEqual(expectedAction);
        });

        it('should check changePasswordData action creator', () => {
            const expectedAction = { type: 'profile/CHANGE_PASSWORD_DATA' };
            expect(actions.changePasswordData()).toEqual(expectedAction);
        });

        it('should check changePasswordError action creator', () => {
            const expectedAction = { type: 'profile/CHANGE_PASSWORD_ERROR', error };
            expect(actions.changePasswordError(error)).toEqual(expectedAction);
        });
    });

    describe('2FA actions', () => {
        it('should check toggle2faFetch action creator', () => {
            const payload = {
                code: 'code',
                enable: true,
            };
            const expectedAction = { type: 'profile/TOGGLE_2FA_FETCH', payload };
            expect(actions.toggle2faFetch(payload)).toEqual(expectedAction);
        });

        it('should check toggle2faData action creator', () => {
            const expectedAction = { type: 'profile/TOGGLE_2FA_DATA' };
            expect(actions.toggle2faData()).toEqual(expectedAction);
        });

        it('should check toggle2faError action creator', () => {
            const expectedAction = { type: 'profile/TOGGLE_2FA_ERROR', error };
            expect(actions.toggle2faError(error)).toEqual(expectedAction);
        });

        it('should check generate2faQRFetch action creator', () => {
            const expectedAction = { type: 'profile/GENERATE_2FA_QRCODE_FETCH' };
            expect(actions.generate2faQRFetch()).toEqual(expectedAction);
        });

        it('should check generate2faQRData action creator', () => {
            const payload = {
                barcode: 'barcode',
                url: 'test_url',
            };
            const expectedAction = { type: 'profile/GENERATE_2FA_QRCODE_DATA', payload };
            expect(actions.generate2faQRData(payload)).toEqual(expectedAction);
        });

        it('should check generate2faQRError action creator', () => {
            const expectedAction = { type: 'profile/GENERATE_2FA_QRCODE_ERROR', error };
            expect(actions.generate2faQRError(error)).toEqual(expectedAction);
        });

        it('should check changeUserDataFetch action creator', () => {
            const payload = {
                user: {
                    email: 'admin@barong.io',
                    uid: 'ID26C901376F',
                    role: 'admin',
                    level: 3,
                    otp: false,
                    state: 'active',
                    profiles: [],
                    csrf_token: '31415926535897932384626433832795028841971',
                    data: '{\"language\":\"en\"}',
                    referal_uid: '',
                    labels: [],
                    phone: [],
                    created_at: '',
                    updated_at: '',
                },
            };
            const expectedAction = { type: 'profile/CHANGE_USER_FETCH', payload };
            expect(actions.changeUserDataFetch(payload)).toEqual(expectedAction);
        });

        it('should check changeUserData action creator', () => {
            const payload = {
                user: {
                    email: 'admin@barong.io',
                    uid: 'ID26C901376F',
                    role: 'admin',
                    level: 3,
                    otp: false,
                    state: 'active',
                    profiles: [],
                    csrf_token: '31415926535897932384626433832795028841971',
                    data: '{\"language\":\"en\"}',
                    referal_uid: '',
                    labels: [],
                    phone: [],
                    created_at: '',
                    updated_at: '',
                },
            };
            const expectedAction = { type: 'profile/CHANGE_USER_DATA', payload };
            expect(actions.changeUserData(payload)).toEqual(expectedAction);
        });
    });
});
