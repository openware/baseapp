import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, all, delay } from 'redux-saga/effects';

import { LocalizationActionTypes } from './types';
import { LocalizationContainer } from '../interfaces';
import { LocalizationActions } from './actions';
import { LocalizationParser } from '../components/localization-parser';
import { SagaHandler } from '../../../redux/utils/saga-handler';
import { ActionWith } from 'lib/interfaces';
import { KeepActions } from 'src/units/keep/redux';

async function fetchJson(locale: string): Promise<object> {
    let localeResponse: Response = await fetch(`/localization/${locale}.json?${__webpack_hash__}`, {
        headers: { 'Content-Type': 'application/json' },
    });
    if (localeResponse.ok) {
        return await localeResponse.json();
    } else {
        throw Error(localeResponse.statusText);
    }
}

function* refresh(locale: string): SagaIterator {
    const jsonObject = yield call(fetchJson, locale);
    const localization: LocalizationContainer = LocalizationParser.parse(jsonObject);
    yield put(LocalizationActions.loadSuccess(localization));
}

export const LocalizationSagaActions = {
    refresh,
};

export function* setLocale({ payload }: ActionWith<string>): SagaIterator {
    try {
        yield call(refresh, payload);
        // yield call(delay, 1000);
        yield put(KeepActions.saveLocale(payload));
    } catch (exception) {
        yield all(SagaHandler.handleException(exception));
    }
}

export function* localizationSaga(): SagaIterator {
    yield takeLatest(LocalizationActionTypes.SET_LOCALE, setLocale);
}
