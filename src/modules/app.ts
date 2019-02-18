import { combineReducers } from 'redux';
import { alertReducer  } from './public/alert';
import { changeLanguageReducer  } from './public/i18n';
import { klineReducer  } from './public/kline';
import { marketsReducer } from './public/markets';
import { depthReducer, orderBookReducer  } from './public/orderBook';
import { rangerReducer  } from './public/ranger/reducer';
import { recentTradesReducer  } from './public/recentTrades';
import { authReducer  } from './user/auth';
import { sendEmailVerificationReducer } from './user/emailVerification';
import { historyReducer  } from './user/history';
import {
    documentsReducer,
    identityReducer,
    labelReducer,
    phoneReducer,
} from './user/kyc';
import { openOrdersReducer } from './user/openOrders';
import { ordersReducer  } from './user/orders';
import { ordersHistoryReducer  } from './user/ordersHistory';
import { passwordReducer  } from './user/password';
import { profileReducer  } from './user/profile';
import { userActivityReducer  } from './user/userActivity';
import { walletsReducer  } from './user/wallets';

export const publicReducer = combineReducers({
    recentTrades: recentTradesReducer,
    markets: marketsReducer,
    orderBook: orderBookReducer,
    depth: depthReducer,
    ranger: rangerReducer,
    i18n: changeLanguageReducer,
    kline: klineReducer,
    alert: alertReducer,
});

export const userReducer = combineReducers({
    auth: authReducer,
    label: labelReducer,
    orders: ordersReducer,
    password: passwordReducer,
    profile: profileReducer,
    wallets: walletsReducer,
    phone: phoneReducer,
    identity: identityReducer,
    documents: documentsReducer,
    history: historyReducer,
    userActivity: userActivityReducer,
    ordersHistory: ordersHistoryReducer,
    openOrders: openOrdersReducer,
    sendEmailVerification: sendEmailVerificationReducer,
});
