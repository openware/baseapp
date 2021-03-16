import { rangerConnectData, rangerConnectFetch, rangerDisconnectData } from './actions';
import { rangerReducer, RangerState } from './reducer';

describe('Ranger reducer', () => {

    it('supports rangerConnectFetch', () => {
        expect(rangerReducer(undefined, rangerConnectFetch({withAuth: false}))).toEqual({
            withAuth: false,
            connected: false,
            connecting: true,
            subscriptions: [],
        });

        expect(rangerReducer(undefined, rangerConnectFetch({withAuth: true}))).toEqual({
            withAuth: true,
            connected: false,
            connecting: true,
            subscriptions: [],
        });
    });

    it('supports rangerConnectData', () => {
        expect(rangerReducer(undefined, rangerConnectData())).toEqual({
            withAuth: false,
            connected: true,
            connecting: false,
            subscriptions: [],
        });
    });

    it('supports rangerDisconnectData', () => {
        const initialState: RangerState = {
            withAuth: true,
            connected: true,
            connecting: false,
            subscriptions: [],
        };
        expect(rangerReducer(initialState, rangerDisconnectData())).toEqual({
            withAuth: true,
            connected: false,
            connecting: false,
            subscriptions: [],
        });
    });

});
