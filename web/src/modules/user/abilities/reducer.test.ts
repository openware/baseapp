import * as actions from './actions';
import { abilitiesReducer, initialAbilitiesState } from './reducer';

describe('Abilities reducer', () => {
    it('should handle ABILITIES_FETCH', () => {
        const expectedState = {
            ...initialAbilitiesState,
            loading: true,
        };
        expect(abilitiesReducer(initialAbilitiesState, actions.abilitiesFetch())).toEqual(expectedState);
    });

    it('should handle ABILITIES_DATA', () => {
        const abilitiesResponse = [{
            read: [ 'Order', 'Trade', 'Member', 'Account', 'PaymentAddress' ],
            update: [ 'Order' ],
        }];
        const abilities = {
            read: [ 'Order', 'Trade', 'Member', 'Account', 'PaymentAddress' ],
            update: [ 'Order' ],
        };
        const expectedState = {
            ...initialAbilitiesState,
            loading: false,
            abilities,
        };
        expect(abilitiesReducer(
            initialAbilitiesState,
            actions.abilitiesData(abilitiesResponse),
        )).toEqual(expectedState);
    });

    it('should handle ABILITIES_ERROR', () => {
        const expectedState = {
            ...initialAbilitiesState,
            loading: false,
        };
        expect(abilitiesReducer(initialAbilitiesState, actions.abilitiesError())).toEqual(expectedState);
    });
});
