import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { memberLevelsData, memberLevelsError, MemberLevelsFetch } from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* memberLevelsSaga(action: MemberLevelsFetch) {
    try {
        const data = yield call(API.get(requestOptions), '/public/member-levels');
        yield put(memberLevelsData(data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: memberLevelsError,
                },
            }),
        );
    }
}
