import { CommonError } from '../../types';
import * as actions from './actions';
import { initialStateProfile, profileReducer } from './reducer';
import { UserProfile } from './types';

describe('Profile reducer', () => {
    const fakeProfiles: UserProfile[] = [
        {
            first_name: '',
            last_name: '',
            dob: '',
            address: '',
            metadata: '',
            postcode: '',
            city: '',
            country: '',
            state: '',
            created_at: '',
            updated_at: '',
        },
    ];

    const userData = {
        user: {
            username: 'johnny1337',
            email: 'admin@barong.io',
            uid: 'ID26C901376F',
            role: 'admin',
            level: 3,
            otp: false,
            state: 'active',
            csrf_token: '31415926535897932384626433832795028841971',
            profiles: fakeProfiles,
            data: '{\"language\":\"en\"}',
            referal_uid: '',
            labels: [],
            phone: [],
            created_at: '',
            updated_at: '',
        },
    };

    const error: CommonError = {
        code: 401,
        message: ['Invalid Session'],
    };

    it('should handle GET_USER_FETCH', () => {
        const expectedState = {
            ...initialStateProfile,
            userData: { ...initialStateProfile.userData, isFetching: true },
        };
        expect(profileReducer(initialStateProfile, actions.userFetch())).toEqual(expectedState);
    });

    it('should handle GET_USER_DATA', () => {
        const actualState = {
            ...initialStateProfile,
            userData: { ...initialStateProfile.userData, isFetching: true },
        };
        const expectedState = {
            ...initialStateProfile,
            userData: { ...initialStateProfile.userData, isFetching: false, user: userData.user },
        };
        expect(profileReducer(actualState, actions.userData(userData))).toEqual(expectedState);
    });

    it('should handle GET_USER_ERROR', () => {
        const actualState = {
            ...initialStateProfile,
            userData: { ...initialStateProfile.userData, isFetching: true },
        };
        const expectedState = {
            ...initialStateProfile,
            userData: { ...initialStateProfile.userData, isFetching: false, error },
        };
        expect(profileReducer(actualState, actions.userError(error))).toEqual(expectedState);
    });

    it('should handle RESET_USER', () => {
        const actualState = {
            ...initialStateProfile,
            userData: { ...initialStateProfile.userData, isFetching: false, user: userData.user },
        };
        const expectedState = {
            ...initialStateProfile,
            userData: { ...initialStateProfile.userData, isFetching: false },
        };
        expect(profileReducer(actualState, actions.userReset())).toEqual(expectedState);
    });

    it('should handle CHANGE_USER_LEVEL', () => {
        const actualState = {
            ...initialStateProfile,
            userData: { ...initialStateProfile.userData, user: userData.user },
        };
        const expectedState = {
            ...initialStateProfile,
            userData: {
                ...initialStateProfile.userData,
                user: {
                    ...userData.user,
                    level: 2,
                },
            },
        };
        expect(profileReducer(actualState, actions.changeUserLevel({ level: 2 }))).toEqual(expectedState);
    });

    it('should handle CHANGE_PASSWORD_FETCH', () => {
        const payload = {
            old_password: '123123',
            new_password: '123',
            confirm_password: '123',
        };
        const expectedState = {
            ...initialStateProfile,
            passwordChange: { ...initialStateProfile.passwordChange, error: undefined },
        };
        expect(profileReducer(initialStateProfile, actions.changePasswordFetch(payload))).toEqual(expectedState);
    });

    it('should handle CHANGE_PASSWORD_DATA', () => {
        const actualState = {
            ...initialStateProfile,
            passwordChange: { ...initialStateProfile.passwordChange, error: undefined },
        };
        const expectedState = {
            ...initialStateProfile,
            passwordChange: { ...initialStateProfile.passwordChange, success: true, error: undefined },
        };
        expect(profileReducer(actualState, actions.changePasswordData())).toEqual(expectedState);
    });

    it('should handle CHANGE_PASSWORD_ERROR', () => {
        const actualState = {
            ...initialStateProfile,
            passwordChange: { ...initialStateProfile.passwordChange, error: undefined },
        };
        const expectedState = {
            ...initialStateProfile,
            passwordChange: { ...initialStateProfile.passwordChange, error },
        };
        expect(profileReducer(actualState, actions.changePasswordError(error))).toEqual(expectedState);
    });

    it('should handle GENERATE_2FA_QRCODE_FETCH', () => {
        const expectedState = {
            ...initialStateProfile,
            twoFactorAuth: {
                ...initialStateProfile.twoFactorAuth,
                success: false,
                error: undefined,
                barcode: '',
                url: '',
            },
        };
        expect(profileReducer(initialStateProfile, actions.generate2faQRFetch())).toEqual(expectedState);
    });

    it('should handle GENERATE_2FA_QRCODE_DATA', () => {
        const payload = {
            barcode: 'barcode',
            url: 'test_url',
        };
        const actualState = {
            ...initialStateProfile,
            twoFactorAuth: {
                ...initialStateProfile.twoFactorAuth,
                success: false,
                error: undefined,
                barcode: '',
                url: '',
            },
        };
        const expectedState = {
            ...initialStateProfile,
            twoFactorAuth: { ...actualState.twoFactorAuth, error: undefined, ...payload },
        };
        expect(profileReducer(actualState, actions.generate2faQRData(payload))).toEqual(expectedState);
    });

    it('should handle GENERATE_2FA_QRCODE_ERROR', () => {
        const actualState = {
            ...initialStateProfile,
            twoFactorAuth: {
                ...initialStateProfile.twoFactorAuth,
                success: false,
                error: undefined,
                barcode: '',
                url: '',
            },
        };
        const expectedState = {
            ...initialStateProfile,
            twoFactorAuth: {
                ...initialStateProfile.twoFactorAuth,
                error,
                success: false,
                barcode: '',
                url: '',
            },
        };
        expect(profileReducer(actualState, actions.generate2faQRError(error))).toEqual(expectedState);
    });

    it('should handle TOGGLE_2FA_FETCH', () => {
        const payload = {
            code: 'code',
            enable: true,
        };
        const expectedState = {
            ...initialStateProfile,
            twoFactorAuth: { ...initialStateProfile.twoFactorAuth, success: false, error: undefined },
        };
        expect(profileReducer(initialStateProfile, actions.toggle2faFetch(payload))).toEqual(expectedState);
    });

    it('should handle TOGGLE_2FA_DATA', () => {
        const actualState = {
            ...initialStateProfile,
            twoFactorAuth: { ...initialStateProfile.twoFactorAuth, success: false, error: undefined },
        };
        const expectedState = {
            ...initialStateProfile,
            twoFactorAuth: { ...initialStateProfile.twoFactorAuth, success: true, error: undefined },
        };
        expect(profileReducer(actualState, actions.toggle2faData())).toEqual(expectedState);
    });

    it('should handle TOGGLE_2FA_ERROR', () => {
        const actualState = {
            ...initialStateProfile,
            twoFactorAuth: { ...initialStateProfile.twoFactorAuth, success: false, error: undefined },
        };
        const expectedState = {
            ...initialStateProfile,
            twoFactorAuth: { ...initialStateProfile.twoFactorAuth, success: false, error },
        };
        expect(profileReducer(actualState, actions.toggle2faError(error))).toEqual(expectedState);
    });

    it('should handle CHANGE_USER_FETCH', () => {
        const actualState = {
            ...initialStateProfile,
            userData: { ...initialStateProfile.userData, user: userData.user },
        };
        const expectedState = {
            ...initialStateProfile,
            userData: {
                ...initialStateProfile.userData,
                user: {
                    ...userData.user,
                },
                success: false,
            },
        };
        expect(profileReducer(actualState, actions.changeUserDataFetch({ user: userData.user }))).toEqual(expectedState);
    });

    it('should handle CHANGE_USER_DATA', () => {
        const actualState = {
            ...initialStateProfile,
            userData: { ...initialStateProfile.userData, user: userData.user },
        };
        const expectedState = {
            ...initialStateProfile,
            userData: {
                ...initialStateProfile.userData,
                user: {
                    ...userData.user,
                },
                success: true,
            },
        };
        expect(profileReducer(actualState, actions.changeUserData({ user: userData.user }))).toEqual(expectedState);
    });
});
