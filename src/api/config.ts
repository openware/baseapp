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
    usernameEnabled: false,
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
    ],
    captcha_type: 'none',
    password_min_entropy: '0',
    wizard_step: 1,
};

export const Cryptobase = {
    config: defaultConfig,
};

Cryptobase.config = { ...defaultConfig, ...window.env };
Cryptobase.config.storage = { ...defaultConfig.storage, ...Cryptobase.config.storage };

const convertToBoolean = (value: any): boolean => {
    return String(value) === 'true';
}

export const tradeUrl = () => Cryptobase.config.api.tradeUrl;
export const authUrl = () => Cryptobase.config.api.authUrl;
export const applogicUrl = () => Cryptobase.config.api.applogicUrl;
export const rangerUrl = () => Cryptobase.config.api.rangerUrl;
export const finexUrl = () => Cryptobase.config.api.finexUrl || tradeUrl();
export const withCredentials = () => convertToBoolean(Cryptobase.config.withCredentials);
export const incrementalOrderBook = () => convertToBoolean(Cryptobase.config.incrementalOrderBook);
export const isResizableGrid = () => convertToBoolean(Cryptobase.config.isResizable);
export const isDraggableGrid = () => convertToBoolean(Cryptobase.config.isDraggable);
export const isFinexEnabled = () => convertToBoolean(Cryptobase.config.finex);
export const showLanding = () => convertToBoolean(Cryptobase.config.showLanding);
export const sentryEnabled = () => convertToBoolean(Cryptobase.config.sentryEnabled);
export const captchaLogin = () => convertToBoolean(Cryptobase.config.captchaLogin);
export const minutesUntilAutoLogout = () => Cryptobase.config.minutesUntilAutoLogout;
export const sessionCheckInterval = () => Cryptobase.config.sessionCheckInterval;
export const balancesFetchInterval = () => Cryptobase.config.balancesFetchInterval;
export const gaTrackerKey = () => Cryptobase.config.gaTrackerKey;
export const msAlertDisplayTime = () => Cryptobase.config.msAlertDisplayTime;
export const defaultStorageLimit = () => Number(Cryptobase.config.storage.defaultStorageLimit);
export const orderBookSideLimit = () => Number(Cryptobase.config.storage.orderBookSideLimit);
export const passwordEntropyStep = () => Number(Cryptobase.config.passwordEntropyStep);
export const languages = (Cryptobase.config.languages && Cryptobase.config.languages.length > 0) ? Cryptobase.config.languages : ['en'];
export const kycSteps = () => Cryptobase.config.kycSteps;
export const isUsernameEnabled = () => convertToBoolean(Cryptobase.config.usernameEnabled);
export const captchaType = () => Cryptobase.config.captcha_type;
export const captchaId = () => Cryptobase.config.captcha_id;
export const passwordMinEntropy = () => Number(Cryptobase.config.password_min_entropy);
export const wizardStep = () => Cryptobase.config.wizard_step || 1;
