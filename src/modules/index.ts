import { combineReducers } from 'redux';
import { all, call } from 'redux-saga/effects';
import { publicReducer, userReducer } from './app';
import { AlertState, rootHandleAlertSaga } from './public/alert';
import { BlocklistAccessState, rootBlocklistAccessSaga } from './public/blocklistAccess';
import { ConfigsState, rootConfigsSaga } from './public/configs';
import { CurrenciesState, rootCurrenciesSaga } from './public/currencies';
import { CustomizationState, rootCustomizationSaga } from './public/customization';
import { ErrorHandlerState, rootErrorHandlerSaga } from './public/errorHandler';
import { ColorThemeState } from './public/globalSettings';
import { GridLayoutState } from './public/gridLayout';
import { LanguageState } from './public/i18n';
import { KlineState, rootKlineFetchSaga } from './public/kline';
import { MarketsState, rootMarketsSaga } from './public/markets';
import { MemberLevelsState, rootMemberLevelsSaga } from './public/memberLevels';
import { DepthIncrementState, DepthState, OrderBookState, rootOrderBookSaga } from './public/orderBook';
import { RangerState } from './public/ranger/reducer';
import { RecentTradesState, rootRecentTradesSaga } from './public/recentTrades';
import { ApiKeysState } from './user/apiKeys';
import { rootApiKeysSaga } from './user/apiKeys/sagas';
import { AuthState, rootAuthSaga } from './user/auth';
import { BeneficiariesState, rootBeneficiariesSaga } from './user/beneficiaries';
import { GeetestCaptchaState, rootGeetestCaptchaSaga } from './user/captcha';
import { CustomizationUpdateState, rootCustomizationUpdateSaga } from './user/customization';
import { EmailVerificationState, rootEmailVerificationSaga } from './user/emailVerification';
import { HistoryState, rootHistorySaga } from './user/history';
import { AddressesState, rootSendAddressesSaga } from './user/kyc/addresses';
import { DocumentsState, rootSendDocumentsSaga } from './user/kyc/documents';
import { IdentityState, rootSendIdentitySaga } from './user/kyc/identity';
import { LabelState, rootLabelSaga } from './user/kyc/label';
import { PhoneState, rootSendCodeSaga } from './user/kyc/phone';
import { OpenOrdersState, rootOpenOrdersSaga } from './user/openOrders';
import { OrdersState, rootOrdersSaga } from './user/orders';
import { OrdersHistoryState, rootOrdersHistorySaga } from './user/ordersHistory';
import { PasswordState, rootPasswordSaga } from './user/password';
import { ProfileState, rootProfileSaga } from './user/profile';
import { rootUserActivitySaga, UserActivityState } from './user/userActivity';
import { rootWalletsSaga, WalletsState } from './user/wallets';
import { rootWithdrawLimitSaga, WithdrawLimitState } from './user/withdrawLimit';

export * from './public/markets';
export * from './public/orderBook';
export * from './public/globalSettings';
export * from './public/configs';
export * from './public/currencies';
export * from './public/customization';
export * from './public/errorHandler';
export * from './public/i18n';
export * from './public/kline';
export * from './public/alert';
export * from './user/apiKeys';
export * from './user/auth';
export * from './user/beneficiaries';
export * from './user/captcha';
export * from './user/customization';
export * from './user/wallets';
export * from './user/profile';
export * from './user/openOrders';
export * from './user/orders';
export * from './user/ordersHistory';
export * from './user/password';
export * from './user/userActivity';
export * from './user/history';
export * from './user/kyc';
export * from './user/emailVerification';
export * from './user/withdrawLimit';
export * from './public/memberLevels';
export * from './public/blocklistAccess';

export interface RootState {
    public: {
        alerts: AlertState;
        blocklistAccess: BlocklistAccessState;
        colorTheme: ColorThemeState;
        configs: ConfigsState;
        currencies: CurrenciesState;
        customization: CustomizationState;
        rgl: GridLayoutState;
        i18n: LanguageState;
        kline: KlineState;
        errorHandler: ErrorHandlerState;
        markets: MarketsState;
        memberLevels: MemberLevelsState;
        orderBook: OrderBookState;
        ranger: RangerState;
        recentTrades: RecentTradesState;
        depth: DepthState;
        incrementDepth: DepthIncrementState;
    };
    user: {
        apiKeys: ApiKeysState;
        auth: AuthState;
        beneficiaries: BeneficiariesState;
        captcha: GeetestCaptchaState;
        customizationUpdate: CustomizationUpdateState;
        history: HistoryState;
        documents: DocumentsState;
        addresses: AddressesState;
        identity: IdentityState;
        label: LabelState;
        phone: PhoneState;
        openOrders: OpenOrdersState;
        orders: OrdersState;
        ordersHistory: OrdersHistoryState;
        password: PasswordState;
        profile: ProfileState;
        sendEmailVerification: EmailVerificationState;
        userActivity: UserActivityState;
        wallets: WalletsState;
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
        call(rootBlocklistAccessSaga),
        call(rootConfigsSaga),
        call(rootCurrenciesSaga),
        call(rootCustomizationSaga),
        call(rootCustomizationUpdateSaga),
        call(rootErrorHandlerSaga),
        call(rootEmailVerificationSaga),
        call(rootGeetestCaptchaSaga),
        call(rootHandleAlertSaga),
        call(rootHistorySaga),
        call(rootKlineFetchSaga),
        call(rootLabelSaga),
        call(rootMarketsSaga),
        call(rootMemberLevelsSaga),
        call(rootOpenOrdersSaga),
        call(rootOrderBookSaga),
        call(rootOrdersHistorySaga),
        call(rootOrdersSaga),
        call(rootPasswordSaga),
        call(rootProfileSaga),
        call(rootRecentTradesSaga),
        call(rootSendCodeSaga),
        call(rootSendAddressesSaga),
        call(rootSendDocumentsSaga),
        call(rootSendIdentitySaga),
        call(rootUserActivitySaga),
        call(rootWalletsSaga),
        call(rootWithdrawLimitSaga),
    ]);
}
