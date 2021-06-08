import { call, put } from 'redux-saga/effects';
import { sendError } from 'src/modules';
import { API, RequestOptions } from '../../../../api';
import {
    OrganizationAbilitiesFetch,
    organizationAbilitiesData,
    organizationAbilitiesError,
} from '../actions';

const apiOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* organizationAbilitiesSaga(action: OrganizationAbilitiesFetch) {
    try {
        const abilities = yield call(API.get(apiOptions), `/organization/abilities`);
        yield put(organizationAbilitiesData(abilities));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: organizationAbilitiesError,
            },
        }));
    }
}
