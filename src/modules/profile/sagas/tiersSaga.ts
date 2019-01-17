// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import {
    tiersData,
    tiersDisable,
    tiersError,
    TiersFetch,
} from '../actions';

const tiersOptions: RequestOptions = {
    apiVersion: 'applogic',
};

export function* tiersSaga(action: TiersFetch) {
    try {
        const { uid, currency } = action.payload;
        const tier = yield call(API.get(tiersOptions), `/tiers/${uid}?currency=${currency}`);
        yield put(tiersData(tier));
    } catch (error) {
        const tiersDisabled = error.code === 204;
        if (tiersDisabled) {
            yield put(tiersDisable());
        } else {
            yield put(tiersError(error));
        }
    }
}
