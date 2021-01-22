export const defaultConfig: Config = {
    api: {
        authUrl: '',
        tradeUrl: '',
        applogicUrl: '',
        rangerUrl: '',
        finexUrl: ''
    },
    finex: false,
    withCredentials: false,
    incrementalOrderBook: false,
    isResizable: false,
    isDraggable: false,
    showLanding: true,
    sentryEnabled: false,
    captchaLogin: false,
    nicknamesEnabled: false,
    gaTrackerKey: '',
    minutesUntilAutoLogout: '5',
    msAlertDisplayTime: '5000',
    sessionCheckInterval: '15000',
    balancesFetchInterval: '3000',
    passwordEntropyStep: '14',
    storage: {
        defaultStorageLimit: '50',
        orderBookSideLimit: '25'
    },
    languages: ['en', 'ru'],
    kycSteps: [
        'email',
        'phone',
        'profile',
        'document',
        'address'
    ]
};

export const Cryptobase = {
    config: defaultConfig,
};

Cryptobase.config = { ...defaultConfig, ...window.env };
Cryptobase.config.storage = { ...defaultConfig.storage, ...Cryptobase.config.storage };

export const tradeUrl = (): string => Cryptobase.config.api.tradeUrl;
export const authUrl = (): string => Cryptobase.config.api.authUrl;
export const applogicUrl = (): string => Cryptobase.config.api.applogicUrl;
export const rangerUrl = (): string => Cryptobase.config.api.rangerUrl;
export const finexUrl = (): string => Cryptobase.config.api.finexUrl || tradeUrl();
export const withCredentials = (): boolean => Cryptobase.config.withCredentials;
export const incrementalOrderBook = (): boolean => Cryptobase.config.incrementalOrderBook;
export const isResizableGrid = (): boolean => Cryptobase.config.isResizable;
export const isDraggableGrid = (): boolean => Cryptobase.config.isDraggable;
export const isFinexEnabled = (): boolean => Cryptobase.config.finex ;
export const showLanding = (): boolean => Cryptobase.config.showLanding;
export const sentryEnabled = (): boolean => Cryptobase.config.sentryEnabled;
export const captchaLogin = (): boolean => Cryptobase.config.captchaLogin;
export const minutesUntilAutoLogout = (): string => Cryptobase.config.minutesUntilAutoLogout;
export const sessionCheckInterval = (): string => Cryptobase.config.sessionCheckInterval;
export const balancesFetchInterval = (): string => Cryptobase.config.balancesFetchInterval;
export const gaTrackerKey = (): string => Cryptobase.config.gaTrackerKey;
export const msAlertDisplayTime = (): string => Cryptobase.config.msAlertDisplayTime;
export const defaultStorageLimit = (): number => Number(Cryptobase.config.storage.defaultStorageLimit);
export const orderBookSideLimit = (): number => Number(Cryptobase.config.storage.orderBookSideLimit);
export const passwordEntropyStep = (): number => Number(Cryptobase.config.passwordEntropyStep);
export const languages: string[] = (Cryptobase.config.languages && Cryptobase.config.languages.length > 0) ? Cryptobase.config.languages : ['en'];
export const kycSteps = (): string[] => Cryptobase.config.kycSteps;
export const isNicknamesEnabled = (): boolean => Cryptobase.config.nicknamesEnabled;
