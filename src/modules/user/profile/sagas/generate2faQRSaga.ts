import { call, put } from 'redux-saga/effects';

import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { ChangePasswordFetch, generate2faQRData, generate2faQRError } from '../actions';

const generate2faQROptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

interface GenerateQRResponse {
    data: {
        barcode: string;
        url: string;
    };
}

export function* generate2faQRSaga(action: ChangePasswordFetch) {
    try {
        const qrData: GenerateQRResponse = yield call(
            API.post(generate2faQROptions(getCsrfToken())),
            '/resource/otp/generate_qrcode'
        );
        const { barcode, url } = qrData.data;
        yield put(generate2faQRData({ barcode, url }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: generate2faQRError,
                },
            })
        );
    }
}
