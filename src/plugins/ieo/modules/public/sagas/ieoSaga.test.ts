import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { rootSaga } from '../../../../../modules/index';
import { fetchIEO, ieoData, ieoError } from '../actions';

const debug = false;

describe('IEO', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;

    afterEach(() => {
        mockAxios.reset();
    });

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    describe('Fetch IEO data', () => {
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

        const mockIEOFetch = () => {
            mockAxios.onGet('/public/ieo/sales').reply(200, payload);
        };

        const expectedActionsFetch = [
            fetchIEO(),
            ieoData(payload),
        ];

        const expectedActionsError = [
            fetchIEO(),
            ieoError({ code: 500, message: ['Server error'] }),
        ];

        it('should fetch IEO in success flow', async () => {
            mockIEOFetch();

            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedActionsFetch.length) {
                        expect(actions).toEqual(expectedActionsFetch);
                        resolve();
                    }
                });
            });
            store.dispatch(fetchIEO());
            return promise;
        });

        it('should handle IEO error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedActionsError.length) {
                        expect(actions).toEqual(expectedActionsError);
                        resolve();
                    }
                });
            });
            store.dispatch(fetchIEO());
            return promise;
        });
    });
});
