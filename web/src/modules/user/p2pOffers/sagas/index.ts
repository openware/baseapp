import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
    P2P_ACTIVE_OFFERS_FETCH,
    P2P_CANCELLED_OFFERS_FETCH,
    P2P_CREATE_OFFER_FETCH,
    P2P_CANCEL_OFFER_FETCH,
    P2P_DONE_OFFERS_FETCH,
} from '../constants';
import { activeOffersSaga } from './activeOffersSaga';
import { cancelledOffersSaga } from './cancelledOffersSaga';
import { cancelOfferSaga } from './cancelOfferSaga';
import { createOfferSaga } from './createOfferSaga';
import { doneOffersSaga } from './doneOffersSaga';

export function* rootP2POffersSaga() {
    yield takeLatest(P2P_ACTIVE_OFFERS_FETCH, activeOffersSaga);
    yield takeLatest(P2P_CANCELLED_OFFERS_FETCH, cancelledOffersSaga);
    yield takeLatest(P2P_CREATE_OFFER_FETCH, createOfferSaga);
    yield takeEvery(P2P_CANCEL_OFFER_FETCH, cancelOfferSaga);
    yield takeEvery(P2P_DONE_OFFERS_FETCH, doneOffersSaga);
}
