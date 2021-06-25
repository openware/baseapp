import * as actions from './actions';
import { currenciesReducer, CurrenciesState, initialCurrenciesState } from './reducer';
import { Currency } from './types';

describe('Currencies reducer', () => {
    const fakeCurrencies: Currency[] = [
        {
            id: 'bch',
            name: 'Bitcoin Cash',
            symbol: '฿',
            type: 'coin',
            precision: 8,
            icon_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
            price: '1',
            networks: [],
            status: '',
        },

        {
            id: 'eur',
            name: 'Euro',
            symbol: '€',
            type: 'coin',
            precision: 8,
            icon_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
            price: '1',
            networks: [],
            status: '',
        },
    ];

    it('should handle CURRENCIES_DATA', () => {
        const expectedState: CurrenciesState = {
            ...initialCurrenciesState,
            list: fakeCurrencies,
        };
        expect(currenciesReducer(initialCurrenciesState, actions.currenciesData(fakeCurrencies))).toEqual(expectedState);
    });
});
