// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { ieoFields } from '../../../constants';
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
        if (ieoFields.metadata) {
            const { currency_id, id } = action.payload;
            const details = yield call(
                API.get(requestOptions),
                `/public/metadata/search?key=IEO-${currency_id}-${id}`,
            );
            yield put(ieoDataMetadata({ metadata: details.value, id: action.payload.id }));
        }
    } catch (error) {
        yield put(ieoMetadataError(error));
    }
}
