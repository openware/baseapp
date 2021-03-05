window.env = {
    api: {
        authUrl: 'https://peatio.brandymint.ru/api/v2/barong',
        tradeUrl: 'https://peatio.brandymint.ru/api/v2/peatio',
        applogicUrl: 'http://localhost:9002/api/v2/applogic',
        rangerUrl: 'ws://peatio.brandymint.ru/api/v2/ranger'
    },
    auth0: {
      domain: 'bitzlato-dev.auth0.com',
      client_id: 'KuP3bhpe9NVb6GcWmVeXgkTZPGm76wRh',
      redirect_uri: 'https://peatio.brandymint.ru/success_signin',
      auth_url: 'https://peatio.brandymint.ru/api/v2/barong/identity/sessions/auth0',
      signedin_url: 'https://peatio.brandymint.ru/wallets'
    },
    minutesUntilAutoLogout: '5',
    withCredentials: false,
    gaTrackerKey: '',
    rangerReconnectPeriod: '1',
    msAlertDisplayTime: '5000',
    incrementalOrderBook: true,
    finex: true,
    isResizable: false,
    isDraggable: false,
    languages: ['en', 'ru'],
    sessionCheckInterval: '15000',
    balancesFetchInterval: '3000',
    passwordEntropyStep: 14,
    showLanding: true,
    sentryEnabled: false,
    kycSteps: [
        'email',
        'phone',
        'profile',
        'document',
        'address',
    ],
    captchaLogin: false,
    usernameEnabled: false,
};
