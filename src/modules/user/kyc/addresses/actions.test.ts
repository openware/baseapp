import { CommonError } from '../../../types';
import * as actions from './actions';
import { SEND_ADDRESSES_DATA, SEND_ADDRESSES_ERROR, SEND_ADDRESSES_FETCH } from './constants';

describe('KYC - addresses actions', () => {
    it('should check sendAddresses action creator', () => {
        const fakePayload = new FormData();
        const expectedAction = {type: SEND_ADDRESSES_FETCH, payload: fakePayload };
        expect(actions.sendAddresses(fakePayload)).toEqual(expectedAction);
    });

    it('should check sendAddressesData action creator', () => {
        const fakeResponse = { message: 'Success' };

        const expectedAction = { type: SEND_ADDRESSES_DATA, payload: fakeResponse };
        expect(actions.sendAddressesData(fakeResponse)).toEqual(expectedAction);
    });

    it('should check sendAddressesError action creator', () => {
        const fakeError: CommonError = {
            code: 500,
            message: ['Server error'],
        };
        const expectedAction = { type: SEND_ADDRESSES_ERROR, error: fakeError };
        expect(actions.sendAddressesError(fakeError)).toEqual(expectedAction);
    });
});
