export interface LocalizationContainer {
    page: {
        header: {
            navbar: {
                signIn: string;
                trade: string;
                wallets: string;
                openOrders: string;
                history: string;
                profile: string;
                logout: string;
            };
        };
        sidebar: {
            group: {
                text: string;
                value: string;
            };
        };
        body: {
            trade: {
                header: {
                    market: string;
                    yours: string;
                };
            };
        };
    };
}
