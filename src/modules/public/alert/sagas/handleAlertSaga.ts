import { SagaIterator } from 'redux-saga';
import { call, delay, put, select } from 'redux-saga/effects';

import { resetHistory, setBlocklistStatus, signInRequire2FA, userOpenOrdersReset, userReset } from '../../../';
import { msAlertDisplayTime } from '../../../../api';
import { selectUserInfo } from '../../../user/profile';
import { alertData, alertDelete, AlertPush } from '../actions';

export function* handleAlertSaga(action: AlertPush): SagaIterator {
    if (action.payload.type === 'error') {
        switch (action.payload.code) {
            case 401:
                if (
                    action.payload.message.indexOf('identity.session.not_active') > -1 ||
                    action.payload.message.indexOf('authz.invalid_session') > -1 ||
                    action.payload.message.indexOf('authz.client_session_mismatch') > -1 ||
                    action.payload.message.indexOf('authz.csrf_token_mismatch') > -1
                ) {
                    yield put(userReset());
                    localStorage.removeItem('csrfToken');
                    yield put(userOpenOrdersReset());
                    yield put(signInRequire2FA({ require2fa: false }));
                    yield put(resetHistory());
                }

                if (action.payload.message.indexOf('identity.session.not_active') > -1) {
                    yield put(alertData(action.payload));

                    return;
                } else {
                    if (
                        action.payload.message.indexOf('authz.client_session_mismatch') > -1 ||
                        action.payload.message.indexOf('authz.csrf_token_mismatch') > -1
                    ) {
                        yield call(callAlertData, action);
                    } else {
                        const user = yield select(selectUserInfo);

                        if (!user.email.length && action.payload.message.indexOf('authz.invalid_session') > -1) {
                            break;
                        } else {
                            yield call(callAlertData, action);
                            break;
                        }
                    }
                }
                break;
            case 403:
                if (action.payload.message.indexOf('identity.session.invalid_otp') > -1) {
                    yield call(callAlertData, action);
                }
                if (action.payload.message.indexOf('jwt.decode_and_verify') > -1) {
                    yield call(callAlertData, action);
                }

                return;
            case 422:
                if (action.payload.message.indexOf('value.taken') > -1) {
                    window.location.replace('/');
                } else {
                    yield call(callAlertData, action);
                }
                break;
            case 471:
                yield put(setBlocklistStatus({ status: 'restricted' }));
                break;
            case 472:
                yield put(setBlocklistStatus({ status: 'maintenance' }));
                break;
            default:
                yield call(callAlertData, action);
        }
    } else {
        yield call(callAlertData, action);
    }
}

function* callAlertData(action: AlertPush): SagaIterator {
    yield put(alertData(action.payload));
    yield delay(parseFloat(msAlertDisplayTime()));
    yield put(alertDelete());
}
