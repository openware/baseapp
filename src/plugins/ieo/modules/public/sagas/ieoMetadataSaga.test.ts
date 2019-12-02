import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { rootSaga } from '../../../../../modules/index';
import { ieoDataMetadata, ieoFetchMetadata, ieoMetadataError } from '../actions';

const debug = false;

describe('Get IEO item metadata', () => {
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

    describe('Fetch IEO metadata', () => {
        const payload = {
            id: 3,
            key: 'IEO-trst-3',
            value: {
                precision: '7',
                icon_url: 'https://cdn1.iconfinder.com/data/icons/flat-world-currency-1/432/Flat_Currency_Bitcoin-512.png',
            },
            created_at: '2019-11-27T09:59:06.397Z',
            updated_at: '2019-11-27T09:59:06.397Z',
        };

        const fakeId = 3;
        const fakeCurrencyId = 'trst';

        const mockIEOFetch = () => {
            mockAxios.onGet('/public/metadata/search?key=IEO-trst-3').reply(200, payload);
        };

        const expectedActionsFetch = [
            ieoFetchMetadata({ id: fakeId, currency_id: fakeCurrencyId }),
            ieoDataMetadata({ metadata: payload.value, id: fakeId }),
        ];

        const expectedActionsError = [
            ieoFetchMetadata({ id: fakeId, currency_id: fakeCurrencyId }),
            ieoMetadataError({ code: 500, message: ['Server error'] }),
        ];

        it('should fetch IEO metadata in success flow', async () => {
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
            store.dispatch(ieoFetchMetadata({ id: fakeId, currency_id: fakeCurrencyId }));
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
            store.dispatch(ieoFetchMetadata({ id: fakeId, currency_id: fakeCurrencyId }));
            return promise;
        });
    });
});
