import { all, fork } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

import { localizationSaga } from 'src/units/localization/redux';
import { keepSaga } from 'src/units/keep/redux';
import { commonSaga } from 'src/units/common/redux';

export function* rootSaga(): SagaIterator {
    yield all([fork(localizationSaga)]);
    yield all([fork(keepSaga)]);
    yield all([fork(commonSaga)]);
}
