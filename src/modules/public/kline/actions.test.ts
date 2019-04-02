import * as actions from './actions';

describe('Kline actions', () => {
    it('should check klineFetch action creator', () => {
        const expectedAction = {
            type: 'kline/KLINE_FETCH',
            payload: {
                market: '',
                resolution: 0,
                from: '',
                to: '',
            },
        };

        expect(actions.klineFetch(expectedAction.payload)).toEqual(expectedAction);
    });

    it('should check klineData action creator', () => {
        const expectedAction = {
            type: 'kline/KLINE_DATA',
            payload: {},
        };

        expect(actions.klineData(expectedAction.payload)).toEqual(expectedAction);
    });
});
