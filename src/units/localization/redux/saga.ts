import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, all } from 'redux-saga/effects';

import { LocalizationActionTypes } from './types';
import { LocalizationContainer } from '../interfaces';
import { LocalizationActions } from './actions';
import { LocalizationParser } from '../components/localization-parser';
import { SagaHandler } from '../../../redux/utils/saga-handler';
import { ActionWith } from 'lib/interfaces';
import { KeepActions } from 'src/units/keep/redux';

function* refresh(locale: string): SagaIterator {
    const localeResponse: Response = yield call(fetch, `/localization/${locale}.json?${__webpack_hash__}`, {
        headers: { 'Content-Type': 'application/json' },
    });
    const localization: LocalizationContainer = LocalizationParser.parse(localeResponse.json());
    yield put(LocalizationActions.loadSuccess(localization));
}

export const LocalizationSagaActions = {
    refresh,
};

export function* setLocale({ payload }: ActionWith<string>): SagaIterator {
    try {
        yield call(refresh, payload);
        yield put(KeepActions.saveLocale(payload));
    } catch (exception) {
        yield all(SagaHandler.handleException(exception));
    }
}

export function* localizationSaga(): SagaIterator {
    yield takeLatest(LocalizationActionTypes.SET_LOCALE, setLocale);
}
