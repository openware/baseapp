function fetchConfigs() {
    const fetchConfig = new XMLHttpRequest();
    const hostUrl = window.location.hostname === 'localhost' ? 'http://localhost:9002' : window.location.origin;
    
    fetchConfig.open('GET', `${hostUrl}/api/v2/sonic/public/config`, false);
    fetchConfig.send(null);

    const UnavailableServiceErrors = new Set([472, 503, 513]);

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (window.location.pathname === '/magic-link') {
        if (token) {
            const sendAccessToken = new XMLHttpRequest();

            sendAccessToken.open('POST', `${hostUrl}/api/v2/barong/identity/users/access`, false)
            sendAccessToken.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            sendAccessToken.send(JSON.stringify({ whitelink_token: token }));
        } else {
            window.location.replace(window.location.origin);
        }
    } else {
        if (fetchConfig.status === 200) {
            window.env = JSON.parse(fetchConfig.responseText);

            if (['/restriction', '/maintenance'].includes(window.location.pathname)) {
                window.location.replace(`${window.location.origin}/`);
            }
        } else if (fetchConfig.status === 471 && window.location.pathname !== '/restriction') {
            window.location.replace(`${window.location.origin}/restriction`);
        } else if (UnavailableServiceErrors.has(fetchConfig.status) && window.location.pathname !== '/maintenance') {
            window.location.replace(`${window.location.origin}/maintenance`);
        }
    }
}
  
fetchConfigs();
