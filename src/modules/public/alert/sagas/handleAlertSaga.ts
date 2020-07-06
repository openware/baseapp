import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { userReset } from '../../../';
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
            case 471:
                localStorage.setItem('restricted', 'true');
                window.location.replace('/404');
                break;
            case 472:
                localStorage.setItem('maintenance', 'true');
                window.location.replace('/500');
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
