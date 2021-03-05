declare global {
    interface Config {
        api: {
            authUrl: string;
            tradeUrl: string;
            applogicUrl: string;
            rangerUrl: string;
            finexUrl: string;
        };
        finex: string | boolean;
        withCredentials: string | boolean;
        incrementalOrderBook: string | boolean;
        isResizable: string | boolean;
        isDraggable: string | boolean;
        showLanding: string | boolean;
        sentryEnabled: string | boolean;
        captchaLogin: string | boolean;
        usernameEnabled: string | boolean;
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
        password_min_entropy: string | number;
        theme?: string;
        wizard_step?: string;
    }

    interface Window {
        env: Config;
    }
}

export {};
