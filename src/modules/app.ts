import { combineReducers } from 'redux';
import { authReducer, AuthState } from './auth';
import { contactReducer, ContactState } from './contact';
import { depositsReducer, DepositsState } from './history/deposits';
import { PrivateTradesState, tradesReducer } from './history/trades';
import { withdrawsReducer, WithdrawsState } from './history/withdraws';
import {
    documentsReducer,
    DocumentsState,
    identityReducer,
    IdentityState,
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
import { passwordReducer, PasswordState } from './password';
import { profileReducer, ProfileState } from './profile';
import { recentTradesReducer, RecentTradesState } from './recentTrades';
import { walletsReducer, WalletsState } from './wallets';

export interface AppState {
    auth: AuthState;
    contact: ContactState;
    deposits: DepositsState;
    trades: PrivateTradesState;
    recentTrades: RecentTradesState;
    withdraws: WithdrawsState;
    orders: OrdersState;
    password: PasswordState;
    profile: ProfileState;
    wallets: WalletsState;
    documents: DocumentsState;
    identity: IdentityState;
    phone: PhoneState;
    markets: MarketsState;
    orderBook: OrderBookState;
    depth: DepthState;
}

export const appReducer = combineReducers({
    auth: authReducer,
    contact: contactReducer,
    deposits: depositsReducer,
    trades: tradesReducer,
    recentTrades: recentTradesReducer,
    withdraws: withdrawsReducer,
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
});
