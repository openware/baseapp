import * as actions from "./actions";
import { changeGlobalSettingsReducer, initialChangeGlobalSettingsState } from "./reducer";

describe("Change color theme reducer", () => {
    it("should handle CHANGE_COLOR_THEME", () => {
        let expectedState = {
            color: "light",
            chartRebuild: false,
            sideBarActive: false,
            marketSelectorActive: false,
            isMobileDevice: false,
            applyWindowEnvsTrigger: false,
            ordersHideOtherPairs: true,
        };
        expect(
            changeGlobalSettingsReducer(initialChangeGlobalSettingsState, actions.changeColorTheme("light"))
        ).toEqual(expectedState);
        expect(localStorage.getItem("colorTheme")).toEqual("light");
        expectedState = {
            color: "dark",
            chartRebuild: false,
            sideBarActive: false,
            marketSelectorActive: false,
            isMobileDevice: false,
            applyWindowEnvsTrigger: false,
            ordersHideOtherPairs: true,
        };
        expect(changeGlobalSettingsReducer(initialChangeGlobalSettingsState, actions.changeColorTheme("dark"))).toEqual(
            expectedState
        );
        expect(localStorage.getItem("colorTheme")).toEqual("dark");
    });
});
