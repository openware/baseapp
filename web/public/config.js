function fetchConfigs() {
    const fetchConfig = new XMLHttpRequest();
    const hostUrl = window.location.hostname === 'localhost' ? 'http://localhost:9002' : window.location.origin;
    
    fetchConfig.open('GET', `${hostUrl}/api/v2/sonic/public/config`, false);
    fetchConfig.send(null);

    const UnavailableServiceErrors = new Set([472, 503, 513]);

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
  
fetchConfigs();
