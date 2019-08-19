import * as actions from './actions';


describe('Guard actions', () => {
    it('should check openGuardModal action creator', () => {
        const expectedAction = { type: 'guard/OPEN_GUARD_MODAL' };
        expect(actions.openGuardModal()).toEqual(expectedAction);
    });

    it('should check closeGuardModal action creator', () => {
        const expectedAction = { type: 'guard/CLOSE_GUARD_MODAL' };
        expect(actions.closeGuardModal()).toEqual(expectedAction);
    });

    it('should check licenseFetch action creator', () => {
        const expectedAction = { type: 'guard/LICENSE_FETCH' };
        expect(actions.licenseFetch()).toEqual(expectedAction);
    });

    it('should check licenseData action creator', () => {
        const payload = { token: '12312edasfwfesrge' };
        const expectedAction = { type: 'guard/LICENSE_DATA', payload };
        expect(actions.licenseData(payload)).toEqual(expectedAction);
    });

    it('should check licenseError action creator', () => {
        const expectedAction = { type: 'guard/LICENSE_ERROR' };
        expect(actions.licenseError()).toEqual(expectedAction);
    });

    it('should check setLicenseExpiration action creator', () => {
        const payload = { expiresAt: 1566823108 };
        const expectedAction = { type: 'guard/SET_LICENSE_EXPIRATION', payload };
        expect(actions.setLicenseExpiration(payload)).toEqual(expectedAction);
    });
});
