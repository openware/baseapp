export interface Config {
    api: {
        gatewayUrl: string;
        rangerUrl: string;
    };
    minutesUntilAutoLogout: string;
    withCredentials: boolean;
    storage: {
        defaultStorageLimit?: number;
    };
    captcha: {
        captchaType: 'recaptcha' | 'geetest' | 'none';
        siteKey: string;
    };
}
