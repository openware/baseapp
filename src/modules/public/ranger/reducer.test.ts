import { rangerConnectData, rangerConnectFetch, rangerDisconnectData } from './actions';
import { rangerReducer, RangerState } from './reducer';

describe('Ranger reducer', () => {

    it('supports rangerConnectFetch', () => {
        expect(rangerReducer(undefined, rangerConnectFetch({withAuth: false}))).toEqual({
            withAuth: false,
            connected: false,
            subscriptions: [],
        });

        expect(rangerReducer(undefined, rangerConnectFetch({withAuth: true}))).toEqual({
            withAuth: true,
            connected: false,
            subscriptions: [],
        });
    });

    it('supports rangerConnectData', () => {
        expect(rangerReducer(undefined, rangerConnectData())).toEqual({
            withAuth: false,
            connected: true,
            subscriptions: [],
        });
    });

    it('supports rangerDisconnectData', () => {
        const initialState: RangerState = {
            withAuth: true,
            connected: true,
            subscriptions: [],
        };
        expect(rangerReducer(initialState, rangerDisconnectData())).toEqual({
            withAuth: true,
            connected: false,
            subscriptions: [],
        });
    });

});
