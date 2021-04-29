// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { buildQueryString } from '../../../../../helpers';
import { ieoFields } from '../../../constants';
import {
    FetchIEO,
    ieoData,
    ieoError,
} from '../actions';
import { DataIEOInterface } from '../types';

const ieoOptions: RequestOptions = {
    apiVersion: 'applogic',
    withHeaders: false,
};

export function* ieoSaga(action: FetchIEO) {
    try {
        let endPoint = '/public/ieo/sales';

        if (action.payload) {
            endPoint = `${endPoint}?${buildQueryString(action.payload, 'state')}`;
        }

        const payload = yield call(API.get(ieoOptions), endPoint);
        let list: DataIEOInterface[] = [];

        if (payload && payload.length && ieoFields.metadata) {
            for (const i of payload) {
                try {
                    const metadata = yield call(
                        API.get(ieoOptions),
                        `/public/metadata/search?key=IEO-${i.currency_id}-${i.id}`,
                    );
                    list.push({ ...i, metadata: metadata.value });
                } catch (error) {
                    list.push(i);
                }
            }
        } else {
            list = payload;
        }

        yield put(ieoData(list));
    } catch (error) {
        yield put(ieoError(error));
    }
}
