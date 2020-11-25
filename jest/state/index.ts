import { layouts } from 'src/helpers/layout';
// export function useSelector<TState = DefaultRootState, TSelected = unknown>(
//     selector: (state: TState) => TSelected,
//     equalityFn?: (left: TSelected, right: TSelected) => boolean
// ): TSelected;

import { Beneficiary, RootState } from 'src/modules';

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    data: {
        address: '',
    },
};

const defaultUser = {
    email: '',
    level: 0,
    otp: false,
    role: '',
    state: '',
    uid: '',
    profiles: [],
    referal_uid: '',
    labels: [],
    phone: [],
    created_at: '',
    updated_at: '',
};

export const TEST_STATE: RootState = {
    public: {
        alerts: {
            alerts: [],
        },
        blocklistAccess: {
            loading: false,
            error: false,
            success: false,
            status: '',
        },
        colorTheme: {
            color: 'dark',
            chartRebuild: false,
            marketSelectorActive: false,
            isMobileDevice: false,
            sideBarActive: false,
        },
        configs: {
            loading: false,
            success: false,
            data: {
                captcha_type: 'none',
                password_min_entropy: 0,
            },
        },
        currencies: {
            list: [],
            loading: false,
        },
        customization: {
            loading: false,
            success: false,
        },
        rgl: {
            layouts: layouts,
        },
        i18n: {
            lang: 'en',
        },
        kline: {
            last: undefined,
            marketId: undefined,
            period: undefined,
            loading: false,
            data: [],
            range: {
                from: 0,
                to: 0,
            },
        },
        errorHandler: {
            processing: false,
        },
        markets: {
            list: [],
            filters: {},
            currentMarket: undefined,
            tickers: {},
            tickerLoading: false,
            loading: false,
        },
        memberLevels: {
            loading: false,
        },
        orderBook: {
            asks: [],
            bids: [],
            loading: false,
        },
        ranger: {
            withAuth: false,
            connected: false,
            connecting: false,
            subscriptions: [],
        },
        recentTrades: {
            list: [],
            loading: false,
        },
        depth: {
            asks: [],
            bids: [],
            loading: false,
        },
        incrementDepth: {
            asks: [],
            bids: [],
            sequence: null,
            loading: false,
        },
    },
    user: {
        apiKeys: {
            apiKeys: [],
            dataLoaded: false,
            modal: {
                active: false,
            },
            pageIndex: 0,
            nextPageExists: false,
        },
        auth: {
            require2FA: false,
            requireVerification: false,
            emailVerified: false,
            current_password_entropy: 0,
            signInLoading: false,
            signUpLoading: false,
        },
        beneficiaries: {
            activate: {
                data: defaultBeneficiary,
                fetching: false,
                success: false,
            },
            create: {
                data: defaultBeneficiary,
                fetching: false,
                success: false,
            },
            fetch: {
                data: [],
                fetching: false,
                success: false,
            },
            delete: {
                data: {
                    id: 0,
                },
                fetching: false,
                success: false,
            },
            resendPin: {
                data: {
                    id: 0,
                },
                fetching: false,
                success: false,
            },
        },
        captcha: {
            loading: false,
            getKeysSuccess: false,
            captcha_response: '',
            reCaptchaSuccess: false,
            geetestCaptchaSuccess: false,
            shouldGeetestReset: false,
        },
        customizationUpdate: {
            loading: false,
            success: false,
        },
        history: {
            list: [],
            fetching: false,
            page: 0,
            nextPageExists: false,
        },
        documents: { loading: false },
        addresses: { loading: false },
        identity: {
            send: {},
            edit: {},
        },
        label: {
            data: [],
            isFetching: false,
        },
        phone: {
            codeSend: false,
        },
        openOrders: {
            fetching: false,
            list: [],
            cancelFetching: false,
            cancelError: false,
        },
        orders: {
            executeLoading: false,
            currentPrice: undefined,
            amount: '',
            orderType: '',
        },
        ordersHistory: {
            list: [],
            fetching: false,
            pageIndex: 0,
            cancelAllFetching: false,
            cancelAllError: false,
            cancelError: false,
            cancelFetching: false,
            nextPageExists: false,
        },
        password: {
            loading: false,
            forgotPasswordRequested: false,
            forgotPasswordChanged: false,
        },
        profile: {
            passwordChange: {
                success: false,
            },
            twoFactorAuth: {
                barcode: '',
                url: '',
            },
            userData: {
                user: defaultUser,
                isFetching: false,
            },
        },
        sendEmailVerification: {
            loading: false,
            success: false,
        },
        userActivity: {
            list: [],
            loading: false,
            page: 0,
            total: 0,
        },
        wallets: {
            wallets: {
                list: [],
                loading: false,
                // deprecated
                withdrawSuccess: false,
                mobileWalletChosen: '',
                selectedWalletCurrency: '',
                selectedWalletAddress: '',
            },
        },
        withdrawLimit: {
            data: {
                limit: '0.0',
                period: 0,
                withdrawal_amount: '0.0',
                currency: '',
            },
            loading: false,
            success: false,
        },
    },
};
