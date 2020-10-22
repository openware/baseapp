import { combineReducers } from 'redux';
import { alertReducer  } from './public/alert';
import { blocklistAccessReducer } from './public/blocklistAccess';
import { configsReducer } from './public/configs';
import { currenciesReducer } from './public/currencies';
import { customizationReducer } from './public/customization';
import { changeColorThemeReducer  } from './public/globalSettings';
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
import { customizationUpdateReducer } from './user/customization';
import { sendEmailVerificationReducer } from './user/emailVerification';
import { historyReducer  } from './user/history';
import {
    addressesReducer,
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
    blocklistAccess: blocklistAccessReducer,
    colorTheme: changeColorThemeReducer,
    configs: configsReducer,
    currencies: currenciesReducer,
    customization: customizationReducer,
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
    customizationUpdate: customizationUpdateReducer,
    label: labelReducer,
    orders: ordersReducer,
    password: passwordReducer,
    profile: profileReducer,
    wallets: walletsReducer,
    addresses: addressesReducer,
    documents: documentsReducer,
    identity: identityReducer,
    phone: phoneReducer,
    history: historyReducer,
    newHistory: newHistoryReducer,
    apiKeys: apiKeysReducer,
    userActivity: userActivityReducer,
    ordersHistory: ordersHistoryReducer,
    openOrders: openOrdersReducer,
    sendEmailVerification: sendEmailVerificationReducer,
    captcha: getGeetestCaptchaReducer,
    withdrawLimit: withdrawLimitReducer,
});
