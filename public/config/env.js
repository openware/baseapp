window.env = {
    api: {
        authUrl: 'https://dapi.bitzlato.bz/api/v2/barong',
        tradeUrl: 'https://dapi.bitzlato.bz/api/v2/peatio',
        applogicUrl: 'http://localhost:9002/api/v2/applogic',
        rangerUrl: 'ws://dapi.bitzlato.bz/api/v2/ranger'
    },
    auth0: {
      domain: 'bitzlato-dev.auth0.com',
      client_id: 'KuP3bhpe9NVb6GcWmVeXgkTZPGm76wRh',
      redirect_uri: 'https://dapi.bitzlato.bz/success_signin',
      auth_url: 'https://dapi.bitzlato.bz/api/v2/barong/identity/sessions/auth0',
      signedin_url: 'https://dapi.bitzlato.bz/wallets'
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
