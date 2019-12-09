export interface Config {
    api: {
        authUrl: string;
        tradeUrl: string;
        applogicUrl: string;
        rangerUrl: string;
        arkeUrl: string;
    };
    minutesUntilAutoLogout?: string;
    rangerReconnectPeriod?: string;
    withCredentials: boolean;
    storage: {
        defaultStorageLimit?: number;
    };
    captcha: {
        captchaType: 'recaptcha' | 'geetest' | 'none';
        siteKey: string;
    };
    gaTrackerKey?: string;
    msAlertDisplayTime?: string;
    incrementalOrderBook: boolean;
}
