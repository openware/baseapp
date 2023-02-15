import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { toggle2faData, toggle2faError, Toggle2FAFetch, toggleUser2fa } from '../actions';

const enable2faOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* toggle2faSaga(action: Toggle2FAFetch) {
    try {
        const enable = action.payload.enable;
        const code = { code: action.payload.code };

        yield call(API.post(enable2faOptions(getCsrfToken())), `/resource/otp/${enable ? 'enable' : 'disable'}`, code);
        yield put(toggle2faData());
        yield put(toggleUser2fa());
        yield put(
            alertPush({
                message: [`success.otp.${enable ? 'enabled' : 'disabled'}`],
                type: 'success',
            }),
        );
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: toggle2faError,
                },
            }),
        );
    }
}
