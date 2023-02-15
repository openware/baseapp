import * as actions from './actions';

describe('Abilities actions', () => {
    it('should check abilities action creator', () => {
        const expectedAction = { type: 'abilities/FETCH' };
        expect(actions.abilitiesFetch()).toEqual(expectedAction);
    });

    it('should check abilitiesData action creator', () => {
        const payload = [
            {
                read: ['Order', 'Trade', 'Member', 'Account', 'PaymentAddress'],
                update: ['Order'],
            },
        ];

        const expectedAction = { type: 'abilities/DATA', payload };
        expect(actions.abilitiesData(payload)).toEqual(expectedAction);
    });

    it('should check abilitiesError action creator', () => {
        const expectedAction = { type: 'abilities/ERROR' };
        expect(actions.abilitiesError()).toEqual(expectedAction);
    });
});
