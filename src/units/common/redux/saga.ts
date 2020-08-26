import { SagaIterator } from 'redux-saga';
import { takeLatest, all, select, call, put } from 'redux-saga/effects';

import { CommonActionTypes } from './types';
import { SagaHandler } from '../../../redux/utils/saga-handler';
import { ReduxState } from 'src/redux/interfaces';

import { AppMoment } from 'lib/app-moment';
import { LocalizationSagaActions } from 'src/units/localization/redux';
import { CommonActions } from './actions';

function* init(): SagaIterator {
    try {
        const locale = yield select((_: ReduxState) => _.keep.locale);
        AppMoment.locale(locale);
        yield call(LocalizationSagaActions.refresh, locale);
        yield put(CommonActions.setInitialized(true));
    } catch (exception) {
        yield all(SagaHandler.handleException(exception));
    }
}

export function* commonSaga(): SagaIterator {
    yield takeLatest(CommonActionTypes.INIT, init);
}
