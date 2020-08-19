import { all, call } from 'redux-saga/effects';
import { rootBlocklistAccessSaga } from '../modules/public/blocklistAccess';
import { rootConfigsSaga } from '../modules/public/configs';
import { rootCurrenciesSaga } from '../modules/public/currencies';
import { rootCustomizationSaga } from '../modules/public/customization';
import { rootMarketsSaga } from '../modules/public/markets';
import { rootKlineFetchSaga } from '../modules/public/kline';
import { rootMemberLevelsSaga } from '../modules/public/memberLevels';
import {
    rootOrderBookSaga,
} from '../modules/public/orderBook';
import { rootRecentTradesSaga } from '../modules/public/recentTrades';
import { rootApiKeysSaga } from '../modules/user/apiKeys/sagas';
import { rootAuthSaga } from '../modules/user/auth';
import { rootBeneficiariesSaga } from '../modules/user/beneficiaries';
import { rootGeetestCaptchaSaga } from '../modules/user/captcha';
import { rootCustomizationUpdateSaga } from '../modules/user/customization';
import { rootEmailVerificationSaga } from '../modules/user/emailVerification';
import { rootHistorySaga } from '../modules/user/history';
import { rootSendAddressesSaga } from '../modules/user/kyc/addresses';
import { rootSendDocumentsSaga } from '../modules/user/kyc/documents';
import { rootSendIdentitySaga } from '../modules/user/kyc/identity';
import { rootLabelSaga } from '../modules/user/kyc/label';
import { rootSendCodeSaga } from '../modules/user/kyc/phone';
import { rootNewHistorySaga } from '../modules/user/newHistory';
import { rootOpenOrdersSaga } from '../modules/user/openOrders';
import { rootOrdersSaga } from '../modules/user/orders';
import { rootOrdersHistorySaga } from '../modules/user/ordersHistory';
import { rootPasswordSaga } from '../modules/user/password';
import { rootProfileSaga } from '../modules/user/profile';
import { rootUserActivitySaga } from '../modules/user/userActivity';
import { rootWalletsSaga } from '../modules/user/wallets';
import { rootWithdrawLimitSaga } from '../modules/user/withdrawLimit';
import { rootHandleAlertSaga } from '../modules/public/alert';


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
        call(rootSendAddressesSaga),
        call(rootSendDocumentsSaga),
        call(rootSendIdentitySaga),
        call(rootUserActivitySaga),
        call(rootWalletsSaga),
        call(rootWithdrawLimitSaga),
    ]);
}
