import * as actions from './actions';
import {
    guardReducer,
    initialGuardState,
} from './reducer';

describe('UserActivity reducer', () => {
    it('should handle OPEN_GUARD_MODAL', () => {
        const expectedState = { ...initialGuardState, versionModalOpened: true };
        expect(guardReducer(initialGuardState, actions.openGuardModal())).toEqual(expectedState);
    });

    it('should handle CLOSE_GUARD_MODAL', () => {
        const expectedState = { ...initialGuardState, versionModalOpened: false };
        expect(guardReducer(initialGuardState, actions.closeGuardModal())).toEqual(expectedState);
    });

    it('should handle license fetch', () => {
        const expectedState = { ...initialGuardState, tokenFetching: true };
        expect(guardReducer(initialGuardState, actions.licenseFetch())).toEqual(expectedState);
    });

    it('should handle license data', () => {
        const payload: actions.LicenseData['payload'] = {
            token: 'foo',
        };
        const expectedState = { ...initialGuardState, token: 'foo', tokenFetching: false };
        expect(guardReducer(initialGuardState, actions.licenseData(payload))).toEqual(expectedState);
    });

    it('should set license expiration time', () => {
        const payload: actions.SetLicenseExpiration['payload'] = {
            expiresAt: 1566823108,
        };
        const expectedState = { ...initialGuardState, ...payload };
        expect(guardReducer(initialGuardState, actions.setLicenseExpiration(payload))).toEqual(expectedState);
    });
});
