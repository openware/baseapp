export interface Config {
    api: {
        authUrl: string;
        tradeUrl: string;
        applogicUrl: string;
        rangerUrl: string;
    };
    minutesUntilAutoLogout?: string;
    withCredentials: boolean;
    storage: {
        defaultStorageLimit?: number;
    };
    captcha: {
        captchaType: 'recaptcha' | 'geetest' | 'none';
        siteKey: string;
    };
    msAlertDisplayTime?: string;
}
