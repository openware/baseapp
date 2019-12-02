// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { pluginsList } from '../../../../../api/config';
import {
    FetchIEOMetadata,
    ieoDataMetadata,
    ieoMetadataError,
} from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'applogic',
    withHeaders: false,
};

export function* ieoMetadataSaga(action: FetchIEOMetadata) {
    try {
        const ieoPlugin = pluginsList().find(item => item.name === 'ieo');

        if (ieoPlugin && ieoPlugin.config.metadata) {
            const { currency_id, id } = action.payload;
            const details = yield call(
                API.get(requestOptions),
                `/public/metadata/search?key=IEO-${currency_id}-${id}`,
            );
            yield put(ieoDataMetadata(details.value));
        }
    } catch (error) {
        yield put(ieoMetadataError(error));
    }
}
