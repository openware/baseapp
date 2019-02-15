// tslint:disable-next-line
import { put, select } from 'redux-saga/effects';
import { PrivateTrade, PrivateTradeEvent } from '../../';
import { defaultStorageLimit } from '../../../api';
import { localeDate } from '../../../helpers/localeDate';
import { getTimezone } from '../../../helpers/timezone';
import { kindToMakerType } from '../../helpers';
import { HistoryPush, pushHistoryFinish } from '../actions';
import { selectHistory } from '../selectors';

export function* historyPushSaga(action: HistoryPush) {
    const tradeEventToTrade = (tradeEvent: PrivateTradeEvent): PrivateTrade => {
        const { id, at, market, kind, price, volume } = tradeEvent;
        const funds = Number(price) * Number(volume);
        return {
            id,
            price,
            volume,
            funds: `${funds}`,
            market,
            created_at: localeDate(at, getTimezone(), ''),
            maker_type: kindToMakerType(kind),
        };
    };

    const actualList = yield select(selectHistory);
    const updatedTrades = [...[tradeEventToTrade(action.payload)], ...actualList].slice(0, defaultStorageLimit());

    yield put(pushHistoryFinish(updatedTrades));
}
