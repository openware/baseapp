declare global {
    interface Config {
        api: {
            authUrl: string;
            tradeUrl: string;
            applogicUrl: string;
            rangerUrl: string;
            finexUrl: string;
        };
        finex: boolean;
        withCredentials: boolean;
        incrementalOrderBook: boolean;
        isResizable: boolean;
        isDraggable: boolean;
        showLanding: boolean;
        sentryEnabled: boolean;
        captchaLogin: boolean;
        usernameEnabled: boolean;
        gaTrackerKey: string;
        minutesUntilAutoLogout: string;
        msAlertDisplayTime: string;
        sessionCheckInterval: string;
        balancesFetchInterval: string;
        passwordEntropyStep: string | number;
        storage: {
            defaultStorageLimit: string | number;
            orderBookSideLimit: string | number;
        };
        languages: string[];
        kycSteps: string[];
        captcha_type: 'recaptcha' | 'geetest' | 'none';
        captcha_id?: string;
        password_min_entropy: number;
    }

    interface Window {
        env: Config;
    }
}

export {};
