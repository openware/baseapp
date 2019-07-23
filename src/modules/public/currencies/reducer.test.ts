import * as actions from './actions';
import {
    currenciesReducer,
    CurrenciesState,
    initialCurrenciesState,
} from './reducer';
import { Currency } from './types';

describe('Currencies reducer', () => {
    const fakeCurrencies: Currency[] = [
        {
            id: 'bch',
            name: 'Bitcoin Cash',
            symbol: '฿',
            explorer_transaction: 'https://testnet.blockchain.info/tx/',
            explorer_address: 'https://testnet.blockchain.info/address/',
            type: 'coin',
            deposit_fee: '0.0',
            min_confirmations: 6,
            min_deposit_amount: '0.0000748',
            withdraw_fee: '0.0',
            min_withdraw_amount: '0.0',
            withdraw_limit_24h: '0.1',
            withdraw_limit_72h: '0.2',
            base_factor: 100000000,
            precision: 8,
            icon_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
        },

        {
            id: 'eur',
            name: 'Euro',
            symbol: '€',
            explorer_transaction: 'https://testnet.blockchain.info/tx/',
            explorer_address: 'https://testnet.blockchain.info/address/',
            type: 'coin',
            deposit_fee: '0.0',
            min_confirmations: 4,
            min_deposit_amount: '0.0000748',
            withdraw_fee: '0.0',
            min_withdraw_amount: '0.0',
            withdraw_limit_24h: '0.1',
            withdraw_limit_72h: '0.2',
            base_factor: 100000000,
            precision: 8,
            icon_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
        },
    ];

    it('should handle CURRENCIES_FETCH', () => {
        const expectedState: CurrenciesState = {
            ...initialCurrenciesState,
            loading: true,
        };
        expect(currenciesReducer(initialCurrenciesState, actions.currenciesFetch())).toEqual(expectedState);
    });

    it('should handle MARKETS_DATA', () => {
        const expectedState: CurrenciesState = {
            ...initialCurrenciesState,
            loading: false,
            list: fakeCurrencies,
        };
        expect(currenciesReducer(initialCurrenciesState, actions.currenciesData(fakeCurrencies))).toEqual(expectedState);
    });

    it('should handle MARKETS_ERROR', () => {
        const expectedState: CurrenciesState = {
            ...initialCurrenciesState,
            loading: false,
        };
        expect(currenciesReducer(initialCurrenciesState, actions.currenciesError())).toEqual(expectedState);
    });
});
