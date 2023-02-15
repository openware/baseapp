import UAParser from 'ua-parser-js';

interface AgentContext {
    name: string;
    version: string;
    major?: string;
}

// tslint:disable-next-line
export const getUserAgent = (userAgentData: string) => {
    const parser = new UAParser();
    parser.setUA(userAgentData);
    const userBrowserData = parser.getResult().browser as AgentContext;
    const userOSData = parser.getResult().os as AgentContext;
    const userAgent =
        userBrowserData.name && userOSData.name
            ? `${userBrowserData.name} ${userBrowserData.major ? userBrowserData.major : ''} ${userOSData.name} ${
                  userOSData.version ? userOSData.version : ''
              }`
            : parser.getResult().ua;

    return userAgent;
};
