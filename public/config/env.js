window.env = {
    api: {
      authUrl: 'http://localhost:9002/api/v2/barong',
      tradeUrl: 'http://localhost:9002/api/v2/peatio',
      applogicUrl: 'http://www.app.local/api/v2/applogic',
      rangerUrl: 'ws://localhost:9011/api/v2/ranger',
    },
    minutesUntilAutoLogout: '5',
    withCredentials: false,
    captcha: {
        captchaType: 'none',
        siteKey: '',
    },
    rangerReconnectPeriod: '1',
    msAlertDisplayTime: '5000',
};
