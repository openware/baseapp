import * as actions from './actions';
import { initialPublicIEOState, publicIEOReducer } from './reducer';

describe('IEO reducer', () => {
    const fakePairs = [
        {
            id: 104,
            sale_id: 331,
            quote_currency_id: 'btc',
            price: '2.4',
            created_at: '2019-09-19T10:30:02.000Z',
            updated_at: '2019-09-19T10:30:02.000Z',
        },
        {
            id: 105,
            sale_id: 331,
            quote_currency_id: 'usd',
            price: '1.4',
            created_at: '2019-09-19T10:30:02.000Z',
            updated_at: '2019-09-19T10:30:02.000Z',
        },
    ];

    const payload = [
        {
            id: 331,
            name: 'test',
            introduction_url: null,
            owner_uid: '946111b1-02cd-472d-8e12-38a321d20bb8',
            currency_id: 'eth',
            supply: '34.2',
            low_goal: '0.0',
            commission: '0.0',
            min_amount: '0.0',
            min_unit: '0.0',
            state: 'pending',
            collected_amount: '12.0',
            ratio: '6.4',
            starts_at: '2019-09-19T10:30:02.000Z',
            finishes_at: '2019-09-22T10:30:02.000Z',
            created_at: '2019-09-19T10:30:02.000Z',
            updated_at: '2019-09-19T10:30:02.000Z',
            pairs: fakePairs,
            type: 'proportional',
        },
    ];

    const error = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle IEO_FETCH', () => {
        const expectedState = {
            ...initialPublicIEOState,
            loading: true,
            success: false,
        };
        expect(publicIEOReducer(initialPublicIEOState, actions.fetchIEO())).toEqual(expectedState);
    });

    it('should handle IEO_DATA', () => {
        const expectedState = {
            ...initialPublicIEOState,
            list: payload,
            loading: false,
            success: true,
        };

        expect(publicIEOReducer(initialPublicIEOState, actions.ieoData(payload))).toEqual(expectedState);
    });

    it('should handle IEO_ERROR', () => {
        const expectedState = {
            loading: false,
            list: [],
            success: false,
            error: error,
        };

        expect(publicIEOReducer(initialPublicIEOState, actions.ieoError(error))).toEqual(expectedState);
    });

    describe('should handle IEO_SET_CURRENT_IEO', () => {
        it('set current ieo', () => {
            const expectedState = {
                ...initialPublicIEOState,
                currentIEO: payload[0],
            };
            expect(publicIEOReducer(initialPublicIEOState, actions.setCurrentIEO(payload[0]))).toEqual(expectedState);
        });
    });

    describe('should handle IEO_UPDATE event when list is empty', () => {
        it('set ieo with ranger', () => {
            const expectedState = {
                ...initialPublicIEOState,
                list: payload,
            };

            expect(publicIEOReducer(initialPublicIEOState, actions.ieoUpdate(payload[0]))).toEqual(expectedState);
        });
    });

    describe('should handle IEO_UPDATE event when list is initialized', () => {
        it('set ieo with ranger', () => {
            const ieo331 = {
                id: 331,
                name: 'test',
                introduction_url: null,
                owner_uid: '',
                currency_id: 'eth',
                supply: '34.2',
                low_goal: '0.0',
                commission: '0.0',
                min_amount: '0.0',
                min_unit: '0.0',
                state: 'somestate',
                collected_amount: '12.0',
                ratio: '6.4',
                starts_at: '2019-09-19T10:30:02.000Z',
                finishes_at: '2019-09-22T10:30:02.000Z',
                created_at: '2019-09-19T10:30:02.000Z',
                updated_at: '2019-09-19T10:30:02.000Z',
                pairs: fakePairs,
                type: 'proportional',
            };
            const ieo332 = {
                id: 332,
                name: 'test2',
                introduction_url: null,
                owner_uid: '',
                currency_id: 'eth',
                supply: '34.2',
                low_goal: '0.0',
                commission: '0.0',
                min_amount: '0.0',
                min_unit: '0.0',
                state: 'pending',
                collected_amount: '12.0',
                ratio: '6.4',
                starts_at: '2019-09-19T10:30:02.000Z',
                finishes_at: '2019-09-22T10:30:02.000Z',
                created_at: '2019-09-19T10:30:02.000Z',
                updated_at: '2019-09-19T10:30:02.000Z',
                pairs: fakePairs,
                type: 'proportional',
            };
            const state = {
                ...initialPublicIEOState,
                list: [ieo331, ieo332],
            };

            const expectedState = {
                ...initialPublicIEOState,
                list: [payload[0], ieo332],
            };

            expect(publicIEOReducer(state, actions.ieoUpdate(payload[0]))).toEqual(expectedState);
        });
    });

});
