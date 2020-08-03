import { call, delay, put } from 'redux-saga/effects';
import { setBlocklistStatus, userReset } from '../../../';
import { msAlertDisplayTime } from '../../../../api';
import { alertData, alertDelete, AlertPush } from '../actions';

export function* handleAlertSaga(action: AlertPush) {
    if (action.payload.type === 'error') {
        switch (action.payload.code) {
            case 401:
                if (action.payload.message.indexOf('identity.session.not_active') > -1){
                    yield put(userReset());
                    localStorage.removeItem('csrfToken');
                    yield put(alertData(action.payload));

                    return;
                } else {
                    if (action.payload.message.indexOf('authz.invalid_session') > -1) {
                        yield put(userReset());
                        localStorage.removeItem('csrfToken');
                    } else {
                        if (action.payload.message.indexOf('authz.client_session_mismatch') > -1 ||
                            action.payload.message.indexOf('authz.csrf_token_mismatch') > -1) {
                            yield put(userReset());
                            localStorage.removeItem('csrfToken');
                            yield call(callAlertData, action);
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

function* callAlertData(action: AlertPush) {
    yield put(alertData(action.payload));
    yield delay(parseFloat(msAlertDisplayTime()));
    yield put(alertDelete());
}
