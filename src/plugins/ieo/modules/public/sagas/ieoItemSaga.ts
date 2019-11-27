// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { pluginsList } from '../../../../../api/config';
import {
    FetchIEOItem,
    ieoItemData,
    ieoItemError,
} from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'applogic',
    withHeaders: false,
};

export function* ieoItemSaga(action: FetchIEOItem) {
    try {
        const data = yield call(API.get(requestOptions), `/public/ieo/sales/${action.payload}`);
        const ieoPlugin = pluginsList().find(item => item.name === 'ieo');

        if (ieoPlugin && ieoPlugin.config.metadata) {
            const details = yield call(
                API.get(requestOptions),
                `/public/metadata/search?key=IEO-${data.currency_id}-${data.id}`,
            );

            yield put(ieoItemData({ ieo: data, details: details.value }));
        } else {
            yield put(ieoItemData({ ieo: data }));
        }
    } catch (error) {
        yield put(ieoItemError(error));
    }
}
