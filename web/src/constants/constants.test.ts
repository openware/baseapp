import { PG_TITLE_PREFIX, pgRoutes } from "./";

describe("Constants", () => {
    const expectedRoutesForLoggedInUser = [
        ["page.header.navbar.trade", "/trading/", "trade"],
        ["page.header.navbar.wallets", "/wallets", "wallets"],
        ["page.header.navbar.openOrders", "/orders", "orders"],
        ["page.header.navbar.history", "/history", "history"],
        ["page.header.navbar.internal.transfer", "/internal-transfer", "internal_transfer"],
        ["page.header.navbar.api", "/docs", "api"],
    ];

    const expectedRoutesForNotLoggedInUser = [
        ["page.header.navbar.signIn", "/signin", "signin"],
        ["page.header.signUp", "/signup", "signup"],
        ["page.header.navbar.trade", "/trading/", "trade"],
        ["page.header.navbar.api", "/docs", "api"],
    ];

    it("Rendering correct title prefix", () => {
        expect(PG_TITLE_PREFIX).toBe("Cryptobase");
    });

    it("Rendering correct correct routes if user is not logged in", () => {
        expect(pgRoutes(false, {}, false)).toEqual(expectedRoutesForNotLoggedInUser);
    });

    it("Rendering correct correct routes if user is logged in", () => {
        expect(pgRoutes(true, {}, false)).toEqual(expectedRoutesForLoggedInUser);
    });
});
