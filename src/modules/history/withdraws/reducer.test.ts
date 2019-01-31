import * as actions from './actions';
import {
    initialWithdrawsState,
    withdrawsReducer,
} from './reducer';

describe('History - Withdraws reducer', () => {
    const withdraws = [
        {
            id: 339,
            currency: 'ltc',
            type: 'coin',
            amount: '1.0',
            fee: '0.001',
            blockchain_txid: '9206d219a8ccfb4fd777e3823283a28e43d5b2d5b3682bcb9b17364299540c03',
            rid: 'QVMUpgySfa5rg9Ah6iLtPJQoMPChdse6UH',
            state: 'succeed',
            created_at: '2018-12-03T18:03:15+01:00',
            updated_at: '2018-12-03T18:03:28+01:00',
            completed_at: '2018-12-03T18:03:28+01:00',
            done_at: '2018-12-03T18:03:28+01:00',
        },
        {
            id: 299,
            currency: 'btc',
            type: 'coin',
            amount: '0.01',
            fee: '0.0001',
            blockchain_txid: '3a2779e1b924f61a64d6227f5e9151ff18e601a819dd54717adfe271daff171d',
            rid: '2NEkoAbJuSBHDjiGqEtTbcVDyY884hZMTad',
            state: 'succeed',
            created_at: '2018-11-13T12:51:35+01:00',
            updated_at: '2018-11-13T12:51:44+01:00',
            completed_at: '2018-11-13T12:51:44+01:00',
            done_at: '2018-11-13T12:51:44+01:00',
        },
    ];

    const error = {
        code: 500,
        message: 'Server error',
    };

    it('should handle WITHDRAWS_FETCH', () => {
        const expectedState = {
            ...initialWithdrawsState,
            loading: true,
        };
        expect(withdrawsReducer(initialWithdrawsState, actions.withdrawsFetch())).toEqual(expectedState);
    });

    it('should handle WITHDRAWS_DATA', () => {
        const expectedState = {
            ...initialWithdrawsState,
            list: withdraws,
        };
        expect(withdrawsReducer(initialWithdrawsState, actions.withdrawsData(withdraws))).toEqual(expectedState);
    });

    it('should handle WITHDRAWS_ERROR', () => {
        const expectedState = {
            ...initialWithdrawsState,
            error: error,
        };
        expect(withdrawsReducer(initialWithdrawsState, actions.withdrawsError(error))).toEqual(expectedState);
    });
});
