// tslint:disable-next-line no-submodule-imports
import { AlertState } from './public/alert';
import { BlocklistAccessState } from './public/blocklistAccess';
import { ColorThemeState } from './public/colorTheme';
import { ConfigsState } from './public/configs';
import { CurrenciesState } from './public/currencies';
import { CustomizationState } from './public/customization';
import { GridLayoutState } from './public/gridLayout';
import { LanguageState } from './public/i18n';
import { MarketsState } from './public/markets';
import { KlineState } from './public/kline';
import { MemberLevelsState } from './public/memberLevels';
import {
    DepthIncrementState,
    DepthState,
    OrderBookState,
} from './public/orderBook';
import { RangerState } from './public/ranger/reducer';
import { RecentTradesState } from './public/recentTrades';
import { ApiKeysState } from './user/apiKeys';
import { AuthState } from './user/auth';
import { BeneficiariesState } from './user/beneficiaries';
import { GeetestCaptchaState } from './user/captcha';
import { CustomizationUpdateState } from './user/customization';
import { EmailVerificationState } from './user/emailVerification';
import { HistoryState } from './user/history';
import { AddressesState } from './user/kyc/addresses';
import { DocumentsState } from './user/kyc/documents';
import { IdentityState } from './user/kyc/identity';
import { LabelState } from './user/kyc/label';
import { PhoneState } from './user/kyc/phone';
import { NewHistoryState } from './user/newHistory';
import { OpenOrdersState } from './user/openOrders';
import { OrdersState } from './user/orders';
import { OrdersHistoryState } from './user/ordersHistory';
import { PasswordState } from './user/password';
import { ProfileState } from './user/profile';
import { UserActivityState } from './user/userActivity';
import { WalletsState } from './user/wallets';
import { WithdrawLimitState } from './user/withdrawLimit';

export * from './public/markets';
export * from './public/orderBook';
export * from './public/colorTheme';
export * from './public/configs';
export * from './public/currencies';
export * from './public/customization';
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
export * from './user/newHistory';
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
        captchaKeys: GeetestCaptchaState;
        customizationUpdate: CustomizationUpdateState;
        sendEmailVerification: EmailVerificationState;
        history: HistoryState;
        documents: DocumentsState;
        addresses: AddressesState;
        identity: IdentityState;
        label: LabelState;
        phone: PhoneState;
        newHistory: NewHistoryState;
        openOrders: OpenOrdersState;
        orders: OrdersState;
        ordersHistory: OrdersHistoryState;
        password: PasswordState;
        profile: ProfileState;
        userActivity: UserActivityState;
        wallets: WalletsState;
        withdrawLimit: WithdrawLimitState;
    };
}
