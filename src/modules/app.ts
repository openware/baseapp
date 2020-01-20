import { combineReducers } from 'redux';
import { alertReducer  } from './public/alert';
import { changeColorThemeReducer  } from './public/colorTheme';
import { configsReducer } from './public/configs';
import { currenciesReducer } from './public/currencies';
import { gridLayoutReducer } from './public/gridLayout/reducer';
import { changeLanguageReducer  } from './public/i18n';
import { klineReducer  } from './public/kline';
import { marketsReducer } from './public/markets';
import { memberLevelsReducer } from './public/memberLevels';
import {
    depthReducer,
    incrementDepthReducer,
    orderBookReducer,
} from './public/orderBook';
import { rangerReducer  } from './public/ranger/reducer';
import { recentTradesReducer  } from './public/recentTrades';
import { apiKeysReducer } from './user/apiKeys';
import { authReducer  } from './user/auth';
import { beneficiariesReducer } from './user/beneficiaries';
import { getGeetestCaptchaReducer } from './user/captcha';
import { sendEmailVerificationReducer } from './user/emailVerification';
import { historyReducer  } from './user/history';
import {
    documentsReducer,
    identityReducer,
    labelReducer,
    phoneReducer,
} from './user/kyc';
import { newHistoryReducer } from './user/newHistory';
import { openOrdersReducer } from './user/openOrders';
import { ordersReducer  } from './user/orders';
import { ordersHistoryReducer  } from './user/ordersHistory';
import { passwordReducer  } from './user/password';
import { profileReducer  } from './user/profile';
import { userActivityReducer  } from './user/userActivity';
import { walletsReducer  } from './user/wallets';
import { withdrawLimitReducer  } from './user/withdrawLimit';

export const publicReducer = combineReducers({
    colorTheme: changeColorThemeReducer,
    configs: configsReducer,
    currencies: currenciesReducer,
    recentTrades: recentTradesReducer,
    markets: marketsReducer,
    orderBook: orderBookReducer,
    depth: depthReducer,
    incrementDepth: incrementDepthReducer,
    ranger: rangerReducer,
    i18n: changeLanguageReducer,
    kline: klineReducer,
    alerts: alertReducer,
    rgl: gridLayoutReducer,
    memberLevels: memberLevelsReducer,
});

export const userReducer = combineReducers({
    auth: authReducer,
    beneficiaries: beneficiariesReducer,
    label: labelReducer,
    orders: ordersReducer,
    password: passwordReducer,
    profile: profileReducer,
    wallets: walletsReducer,
    phone: phoneReducer,
    identity: identityReducer,
    documents: documentsReducer,
    history: historyReducer,
    newHistory: newHistoryReducer,
    apiKeys: apiKeysReducer,
    userActivity: userActivityReducer,
    ordersHistory: ordersHistoryReducer,
    openOrders: openOrdersReducer,
    sendEmailVerification: sendEmailVerificationReducer,
    captchaKeys: getGeetestCaptchaReducer,
    withdrawLimit: withdrawLimitReducer,
});
