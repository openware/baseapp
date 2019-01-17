export interface Config {
    api: {
        gatewayUrl: string;
        rangerUrl: string;
    };
    minutesUntilAutoLogout: string;
    withCredentials: boolean;
}
