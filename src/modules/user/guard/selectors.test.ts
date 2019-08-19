import { createStore } from 'redux';
import { rootReducer } from '../../index';
import {
    selectAppVersion,
    selectBuildExpire,
    selectGuardModalOpened,
    selectLicenseExpiration,
    selectTenkoPublicKey,
    selectToken,
    selectTokenFetching,
} from './selectors';

describe('Guard selectors', () => {
    const state = createStore(rootReducer).getState();

    it('should select app version', () => {
        expect(selectAppVersion(state)).toEqual(state.user.guard.version);
    });

    it('should select guard modal state', () => {
        expect(selectGuardModalOpened(state)).toEqual(state.user.guard.versionModalOpened);
    });

    it('should select build expiration time', () => {
        expect(selectBuildExpire(state)).toEqual(state.user.guard.buildExpire);
    });

    it('should select tenko public key', () => {
        expect(selectTenkoPublicKey(state)).toEqual(state.user.guard.tenkoPublicKey);
    });

    it('should select token fetching', () => {
        expect(selectTokenFetching(state)).toEqual(state.user.guard.tokenFetching);
    });

    it('should select token', () => {
        expect(selectToken(state)).toEqual(state.user.guard.token);
    });

    it('should select license expiration', () => {
        expect(selectLicenseExpiration(state)).toEqual(state.user.guard.expiresAt);
    });
});
