import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { feeGroupData, feeGroupError, FeeGroupFetch } from '../actions';

const FeeGroupOption: RequestOptions = {
    apiVersion: 'peatio',
};

export function* feeGroupSaga(action: FeeGroupFetch) {
    try {
        const feeGroup = yield call(API.get(FeeGroupOption), '/account/members/me');
        yield put(feeGroupData(feeGroup));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: feeGroupError,
                },
            }),
        );
    }
}
