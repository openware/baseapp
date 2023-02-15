import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
    P2P_CANCEL_OFFER_FETCH,
    P2P_CREATE_OFFER_FETCH,
    P2P_USER_OFFERS_FETCH,
    P2P_USER_OFFER_ORDERS_FETCH,
} from '../constants';
import { cancelOfferSaga } from './cancelOfferSaga';
import { createOfferSaga } from './createOfferSaga';
import { userOfferOrdersSaga, userOffersSaga } from './userOffersSaga';

export function* rootP2POffersSaga() {
    yield takeLatest(P2P_USER_OFFERS_FETCH, userOffersSaga);
    yield takeLatest(P2P_USER_OFFER_ORDERS_FETCH, userOfferOrdersSaga);
    yield takeLatest(P2P_CREATE_OFFER_FETCH, createOfferSaga);
    yield takeEvery(P2P_CANCEL_OFFER_FETCH, cancelOfferSaga);
}
