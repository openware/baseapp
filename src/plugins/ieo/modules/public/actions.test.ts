import * as actions from './actions';
import {
    IEO_DATA,
    IEO_DATA_METADATA,
    IEO_ERROR,
    IEO_ERROR_METADATA,
    IEO_FETCH,
    IEO_FETCH_METADATA,
    IEO_ITEM_DATA,
    IEO_ITEM_ERROR,
    IEO_ITEM_FETCH,
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

    const fakeIEOList = [
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

    const fakeMetadata = {
        twitter: '',
        website: '',
        telegram: '',
        whitepaper: '',
        precision: '2',
        icon_url: 'https://cdn1.iconfinder.com/data/icons/flat-world-currency-1/432/Flat_Currency_Bitcoin-512.png',
    };

    const fakeIEOId = 331;

    const fakeIEOItem = fakeIEOList[0];

    it('should check fetchIEO action creator', () => {
        const expectedAction = { type: IEO_FETCH };
        expect(actions.fetchIEO()).toEqual(expectedAction);
    });

    it('should check ieoData action creator', () => {
        const expectedAction = { type: IEO_DATA, payload: fakeIEOList };
        expect(actions.ieoData(fakeIEOList)).toEqual(expectedAction);
    });

    it('should check ieoError action creator', () => {
        const payload = { code: 500, message: ['Server error'] };
        const expectedAction = { type: IEO_ERROR, payload };
        expect(actions.ieoError(payload)).toEqual(expectedAction);
    });

    it('should check fetchItemIEO action creator', () => {
        const expectedAction = { type: IEO_ITEM_FETCH, payload: fakeIEOId };
        expect(actions.fetchItemIEO(fakeIEOId)).toEqual(expectedAction);
    });

    it('should check ieoItemData action creator', () => {
        const expectedAction = { type: IEO_ITEM_DATA, payload: fakeIEOItem };
        expect(actions.ieoItemData(fakeIEOItem)).toEqual(expectedAction);
    });

    it('should check ieoItemError action creator', () => {
        const payload = { code: 500, message: ['Server error'] };
        const expectedAction = { type: IEO_ITEM_ERROR, payload };
        expect(actions.ieoItemError(payload)).toEqual(expectedAction);
    });

    it('should check setCurrentIEO action creator', () => {
        const expectedAction = { type: IEO_SET_CURRENT_IEO, payload: fakeIEOList[0] };
        expect(actions.setCurrentIEO(fakeIEOList[0])).toEqual(expectedAction);
    });

    it('should check ieoRangerData action creator', () => {
        const expectedAction = { type: IEO_UPDATE, payload: fakeIEOList[0] };
        expect(actions.ieoUpdate(fakeIEOList[0])).toEqual(expectedAction);
    });

    it('should check fetchIEOMetadata action creator', () => {
        const fakePayload =  { id: fakeIEOId, currency_id: fakeIEOItem.currency_id };
        const expectedAction = {
            type: IEO_FETCH_METADATA,
            payload: fakePayload,
        };
        expect(actions.ieoFetchMetadata(fakePayload)).toEqual(expectedAction);
    });

    it('should check ieoDataMetadata action creator', () => {
        const expectedAction = { type: IEO_DATA_METADATA, payload: { metadata: fakeMetadata, id: fakeIEOId} };
        expect(actions.ieoDataMetadata({ metadata: fakeMetadata, id: fakeIEOId})).toEqual(expectedAction);
    });

    it('should check ieoError action creator', () => {
        const payload = { code: 500, message: ['Server error'] };
        const expectedAction = { type: IEO_ERROR_METADATA, payload };
        expect(actions.ieoMetadataError(payload)).toEqual(expectedAction);
    });
});
