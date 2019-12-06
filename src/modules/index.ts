import { combineReducers } from 'redux';
// tslint:disable-next-line no-submodule-imports
import { all, call } from 'redux-saga/effects';
import { publicReducer, userReducer } from './app';
import { AlertState, rootHandleAlertSaga } from './public/alert';
import { ColorThemeState } from './public/colorTheme';
import { CurrenciesState, rootCurrenciesSaga } from './public/currencies';
import { GridLayoutState } from './public/gridLayout';
import { LanguageState } from './public/i18n';
import { KlineState, rootKlineFetchSaga } from './public/kline';
import { MarketsState, rootMarketsSaga } from './public/markets';
import {
    DepthIncrementState,
    DepthState,
    OrderBookState,
    rootOrderBookSaga,
} from './public/orderBook';
import { RangerState } from './public/ranger/reducer';
import { RecentTradesState, rootRecentTradesSaga } from './public/recentTrades';
import { ApiKeysState } from './user/apiKeys';
import { rootApiKeysSaga } from './user/apiKeys/sagas';
import { AuthState, rootAuthSaga } from './user/auth';
import { BeneficiariesState, rootBeneficiariesSaga } from './user/beneficiaries';
import { GeetestCaptchaState, rootGeetestCaptchaSaga } from './user/captcha';
import { EmailVerificationState, rootEmailVerificationSaga } from './user/emailVerification';
import { HistoryState, rootHistorySaga } from './user/history';
import { DocumentsState, rootSendDocumentsSaga } from './user/kyc/documents';
import { IdentityState, rootSendIdentitySaga } from './user/kyc/identity';
import { LabelState, rootLabelSaga } from './user/kyc/label';
import { PhoneState, rootSendCodeSaga } from './user/kyc/phone';
import { NewHistoryState, rootNewHistorySaga } from './user/newHistory';
import { OpenOrdersState, rootOpenOrdersSaga } from './user/openOrders';
import { OrdersState, rootOrdersSaga } from './user/orders';
import { OrdersHistoryState, rootOrdersHistorySaga } from './user/ordersHistory';
import { PasswordState, rootPasswordSaga } from './user/password';
import { ProfileState, rootProfileSaga } from './user/profile';
import { rootUserActivitySaga, UserActivityState } from './user/userActivity';
import { rootWalletsSaga, WalletsState } from './user/wallets';
import { rootWithdrawLimitSaga, WithdrawLimitState } from './user/withdrawLimit';
import { MemberLevelsState, rootMemberLevelsSaga } from './public/memberLevels';

export * from './public/markets';
export * from './public/orderBook';
export * from './public/colorTheme';
export * from './public/currencies';
export * from './public/i18n';
export * from './public/kline';
export * from './public/alert';
export * from './user/apiKeys';
export * from './user/auth';
export * from './user/beneficiaries';
export * from './user/captcha';
export * from './user/wallets';
export * from './user/profile';
export * from './user/openOrders';
export * from './user/orders';
export * from './user/ordersHistory';
export * from './user/password';
export * from './user/userActivity';
export * from './user/history';
export * from './user/newHistory';
export * from './user/kyc';
export * from './user/emailVerification';
export * from './user/withdrawLimit';
export * from './public/memberLevels';

export interface RootState {
    public: {
        colorTheme: ColorThemeState;
        currencies: CurrenciesState;
        recentTrades: RecentTradesState;
        markets: MarketsState;
        orderBook: OrderBookState;
        depth: DepthState;
        incrementDepth: DepthIncrementState;
        ranger: RangerState;
        i18n: LanguageState;
        alerts: AlertState;
        kline: KlineState;
        rgl: GridLayoutState;
        memberLevels: MemberLevelsState;
    };
    user: {
        auth: AuthState;
        beneficiaries: BeneficiariesState;
        orders: OrdersState;
        password: PasswordState;
        profile: ProfileState;
        label: LabelState;
        wallets: WalletsState;
        documents: DocumentsState;
        identity: IdentityState;
        phone: PhoneState;
        history: HistoryState;
        newHistory: NewHistoryState;
        apiKeys: ApiKeysState;
        userActivity: UserActivityState;
        ordersHistory: OrdersHistoryState;
        openOrders: OpenOrdersState;
        sendEmailVerification: EmailVerificationState;
        captchaKeys: GeetestCaptchaState;
        withdrawLimit: WithdrawLimitState;
    };
}

export const rootReducer = combineReducers({
    public: publicReducer,
    user: userReducer,
});

export function* rootSaga() {
    yield all([
        call(rootApiKeysSaga),
        call(rootAuthSaga),
        call(rootBeneficiariesSaga),
        call(rootCurrenciesSaga),
        call(rootEmailVerificationSaga),
        call(rootGeetestCaptchaSaga),
        call(rootHandleAlertSaga),
        call(rootHistorySaga),
        call(rootKlineFetchSaga),
        call(rootLabelSaga),
        call(rootMarketsSaga),
        call(rootMemberLevelsSaga),
        call(rootNewHistorySaga),
        call(rootOpenOrdersSaga),
        call(rootOrderBookSaga),
        call(rootOrdersHistorySaga),
        call(rootOrdersSaga),
        call(rootPasswordSaga),
        call(rootProfileSaga),
        call(rootRecentTradesSaga),
        call(rootSendCodeSaga),
        call(rootSendDocumentsSaga),
        call(rootSendIdentitySaga),
        call(rootUserActivitySaga),
        call(rootWalletsSaga),
        call(rootWithdrawLimitSaga),
    ]);
}
