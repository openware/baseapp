import * as actions from './actions';
import {
    IEO_DATA,
    IEO_ERROR,
    IEO_FETCH,
    IEO_SET_CURRENT_IEO,
    IEO_UPDATE,
} from './constants';

describe('IEO actions', () => {
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

    const fakeIEO = [
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

    it('should check fetchIEO action creator', () => {
        const expectedAction = { type: IEO_FETCH };
        expect(actions.fetchIEO()).toEqual(expectedAction);
    });

    it('should check ieoData action creator', () => {
        const expectedAction = { type: IEO_DATA, payload: fakeIEO };
        expect(actions.ieoData(fakeIEO)).toEqual(expectedAction);
    });

    it('should check ieoError action creator', () => {
        const payload = { code: 500, message: ['Server error'] };
        const expectedAction = { type: IEO_ERROR, payload };
        expect(actions.ieoError(payload)).toEqual(expectedAction);
    });

    it('should check setCurrentIEO action creator', () => {
        const expectedAction = { type: IEO_SET_CURRENT_IEO, payload: fakeIEO[0] };
        expect(actions.setCurrentIEO(fakeIEO[0])).toEqual(expectedAction);
    });

    it('should check ieoRangerData action creator', () => {
        const expectedAction = { type: IEO_UPDATE, payload: fakeIEO[0] };
        expect(actions.ieoUpdate(fakeIEO[0])).toEqual(expectedAction);
    });
});
