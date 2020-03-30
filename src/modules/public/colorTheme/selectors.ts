import { RootState } from '../../../modules';
import { ColorThemeState } from './reducer';

export const selectCurrentColorTheme = (state: RootState): ColorThemeState['color'] =>
    state.public.colorTheme.color;

export const selectChartRebuildState = (state: RootState): ColorThemeState['chartRebuild'] =>
    state.public.colorTheme.chartRebuild;

export const selectSidebarState = (state: RootState): ColorThemeState['sideBarActive'] =>
    state.public.colorTheme.sideBarActive;

export const selectMarketSelectorState = (state: RootState): ColorThemeState['marketSelectorActive'] =>
    state.public.colorTheme.marketSelectorActive;
