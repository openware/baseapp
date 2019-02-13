import { combineReducers } from 'redux';
import { alertReducer, AlertState } from './alert';
import { authReducer, AuthState } from './auth';
import { contactReducer, ContactState } from './contact';
import { historyReducer, HistoryState } from './history';
import { changeLanguageReducer, LanguageState } from './i18n';
import { klineReducer, KlineState } from './kline';
import {
    documentsReducer,
    DocumentsState,
    identityReducer,
    IdentityState,
    labelReducer,
    LabelState,
    phoneReducer,
    PhoneState,
} from './kyc';
import { marketsReducer, MarketsState } from './markets';
import {
    depthReducer,
    DepthState,
    orderBookReducer,
    OrderBookState,
} from './orderBook';
import { ordersReducer, OrdersState } from './orders';
import { ordersHistoryReducer, OrdersHistoryState } from './ordersHistory';
import { passwordReducer, PasswordState } from './password';
import { profileReducer, ProfileState } from './profile';
import { rangerReducer, RangerState } from './ranger/reducer';
import { recentTradesReducer, RecentTradesState } from './recentTrades';
import { userActivityReducer, UserActivityState } from './userActivity';
import { walletsReducer, WalletsState } from './wallets';

export interface AppState {
    auth: AuthState;
    contact: ContactState;
    recentTrades: RecentTradesState;
    orders: OrdersState;
    password: PasswordState;
    profile: ProfileState;
    label: LabelState;
    wallets: WalletsState;
    documents: DocumentsState;
    identity: IdentityState;
    phone: PhoneState;
    markets: MarketsState;
    orderBook: OrderBookState;
    depth: DepthState;
    history: HistoryState;
    userActivity: UserActivityState;
    ranger: RangerState;
    i18n: LanguageState;
    alert: AlertState;
    kline: KlineState;
    ordersHistory: OrdersHistoryState;
}

export const appReducer = combineReducers({
    auth: authReducer,
    contact: contactReducer,
    label: labelReducer,
    recentTrades: recentTradesReducer,
    orders: ordersReducer,
    password: passwordReducer,
    profile: profileReducer,
    wallets: walletsReducer,
    phone: phoneReducer,
    identity: identityReducer,
    documents: documentsReducer,
    markets: marketsReducer,
    orderBook: orderBookReducer,
    depth: depthReducer,
    history: historyReducer,
    userActivity: userActivityReducer,
    ranger: rangerReducer,
    i18n: changeLanguageReducer,
    kline: klineReducer,
    alert: alertReducer,
    ordersHistory: ordersHistoryReducer,
});
