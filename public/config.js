const fetchConfig = new XMLHttpRequest();
const hostUrl = window.location.hostname === 'localhost' ? 'http://localhost:9002' : window.location.origin;

fetchConfig.open('GET', `${hostUrl}/api/v2/sonic/public/config`, false);
fetchConfig.send(null);

if (fetchConfig.status === 200) {
    window.env = JSON.parse(fetchConfig.responseText);
}
