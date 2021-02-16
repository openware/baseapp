import * as React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { SettingsIcon } from '../../../assets/images/customization/SettingsIcon';
import { DropdownComponent, TabPanel } from '../../../components';
import {
    CustomizationCurrentDataInterface,
    CustomizationDataInterface,
} from '../../../modules';
import {
    AVAILABLE_COLOR_THEMES,
    AVAILABLE_COLORS_TITLES,
    ThemeColorTitleInterface,
} from '../../../themes';
import { ColorSettings } from './ColorSettings';

export const handleConvertColorCode = (value: string, fromRGB?: boolean) => (
    fromRGB ? `--grb-${value.slice(2)}` :  `--${value.slice(6)}`
);

interface OwnProps {
    colorTheme: string;
    resetToDefault: boolean;
    handleSetCurrentColorTheme: (value: string) => void;
    translate: (key: string) => string;
    handleSetCurrentCustomization: (key: string, value: string | number) => void;
    handleTriggerChartRebuild?: () => void;
    currentCustomization?: CustomizationCurrentDataInterface;
    customization?: CustomizationDataInterface;
}

type Props = OwnProps;

interface State {
    colorSettingsItem: ThemeColorTitleInterface;
    currentTabIndex: number;
    currentThemeIndex: number;
}

const defaultColorSettingsItem = {
    key: '',
    title: '',
};

export class CustomizationThemes extends React.Component<Props, State> {
    public state = {
        colorSettingsItem: defaultColorSettingsItem,
        currentThemeIndex: 0,
        currentTabIndex: 0,
    };

    public componentDidMount() {
        const {
            colorTheme,
            currentCustomization,
            customization,
        } = this.props;

        if (currentCustomization && currentCustomization.theme_id >= 0) {
            const themeIndexToSet = AVAILABLE_COLOR_THEMES.findIndex(item => item.id === currentCustomization.theme_id);

            if (themeIndexToSet >= 0) {
                this.handleSetCurrentTheme(themeIndexToSet);
            }
        } else {
            if (customization) {
                this.handleApplyCustomizationSettings(customization);
            }
        }

        if (colorTheme) {
            if (colorTheme === 'light') {
                this.setState({ currentTabIndex: 1 });
            } else {
                this.setState({ currentTabIndex: 0 });
            }
        }
    }

    public componentDidUpdate(prevProps: Props) {
        const {
            colorTheme,
            customization,
            resetToDefault,
        } = this.props;

        if (customization && customization !== prevProps.customization) {
            this.handleApplyCustomizationSettings(customization);
        }

        if (resetToDefault !== prevProps.resetToDefault) {
            if (customization && customization.settings) {
                this.handleResetCustomizationSettings(customization);
            } else {
                this.handleChangeCurrentTheme(0);
            }
        }

        if (colorTheme !== prevProps.colorTheme) {
            if (colorTheme === 'light') {
                this.setState({ currentTabIndex: 1 });
            } else {
                this.setState({ currentTabIndex: 0 });
            }
        }
    }

    public renderThemesDropdown() {
        const { translate } = this.props;
        const { currentThemeIndex } = this.state;

        return (
            <div className="pg-customization-themes__themes">
                <label className="pg-customization-themes__themes__dropdown-label">
                    {translate('page.body.customization.themes.selector.label')}
                </label>
                <DropdownComponent
                    className="pg-customization-themes__themes__dropdown"
                    list={this.handleGetThemesTitlesList()}
                    onSelect={this.handleChangeCurrentTheme}
                    placeholder={translate(AVAILABLE_COLOR_THEMES[currentThemeIndex].title)}
                />
            </div>
        );
    }

    public renderColorsItem(item: ThemeColorTitleInterface, index: number) {
        const { translate } = this.props;
        const grbItemKey = handleConvertColorCode(item.key);

        return (
            <div key={index} className="pg-customization-themes__colors__item" onClick={e => this.handleSetColorSettingsItem(item)}>
                <div className="pg-customization-themes__colors__item__content">
                    <span
                        className="pg-customization-themes__colors__item__content__circle"
                        style={{backgroundColor: `var(${grbItemKey})`}}
                    />
                    <span className="pg-customization-themes__colors__item__content__title">{translate(item.title)}</span>
                </div>
                <div className="pg-customization-themes__colors__item__settings-icon">
                    <SettingsIcon />
                </div>
            </div>
        );
    }

    public renderColors() {
        return (
            <div className="pg-customization-themes__colors">
                <PerfectScrollbar>
                    {AVAILABLE_COLORS_TITLES.map((item, index) => this.renderColorsItem(item, index))}
                </PerfectScrollbar>
            </div>
        );
    }

    public renderTabs = () => {
        const { translate } = this.props;
        const { currentTabIndex } = this.state;

        return [
            {
                content: currentTabIndex === 0 ? this.renderColors() : null,
                label: translate('page.body.customization.themes.tabs.dark'),
            },
            {
                content: currentTabIndex === 1 ? this.renderColors() : null,
                label: translate('page.body.customization.themes.tabs.light'),
            },
        ];
    };

    public render() {
        const { handleTriggerChartRebuild, translate } = this.props;
        const { colorSettingsItem, currentTabIndex } = this.state;

        return (
            <div className="pg-customization-themes">
                {this.renderThemesDropdown()}
                <TabPanel
                    panels={this.renderTabs()}
                    onTabChange={this.handleChangeTab}
                    currentTabIndex={currentTabIndex}
                />
                <ColorSettings
                    handleCloseColorSettings={this.handleSetColorSettingsItem}
                    item={colorSettingsItem}
                    translate={translate}
                    handleTriggerChartRebuild={handleTriggerChartRebuild}
                />
            </div>
        );
    }

    private handleChangeTab = (index: number) => {
        const { handleSetCurrentColorTheme } = this.props;

        if (index === 1) {
            handleSetCurrentColorTheme('light');
        } else {
            handleSetCurrentColorTheme('dark');
        }

        this.setState({
            currentTabIndex: index,
        });
    };

    private handleGetThemesTitlesList = () => {
        const { translate } = this.props;

        return AVAILABLE_COLOR_THEMES.map(item => translate(item.title));
    };

    private handleSetColorSettingsItem = (item?: ThemeColorTitleInterface) => {
        let newSettings: ThemeColorTitleInterface = defaultColorSettingsItem;

        if (item) {
            newSettings = item;
        }

        this.setState({ colorSettingsItem: newSettings });
    };

    private handleChangeCurrentTheme = (index: number) => {
        const { handleTriggerChartRebuild } = this.props;
        const rootElement = document.documentElement;
        const lightModeBodyElement = document.querySelector<HTMLElement>('.light-mode')!;
        const themeToSet = AVAILABLE_COLOR_THEMES[index];

        this.handleClearCustomizationSettings();

        if (rootElement) {    
            AVAILABLE_COLORS_TITLES.reduce((result, item) => {
                const newItemColor = AVAILABLE_COLOR_THEMES[index].themes.dark ?
                    AVAILABLE_COLOR_THEMES[index].themes.dark.find(theme => theme.key === item.key) : null;

                if (newItemColor) {
                    rootElement.style.setProperty(item.key, newItemColor.value);
                }

                return result;
            }, {});
        }

        if (lightModeBodyElement) {    
            AVAILABLE_COLORS_TITLES.reduce((result, item) => {
                const newItemColor = AVAILABLE_COLOR_THEMES[index].themes.light ?
                    AVAILABLE_COLOR_THEMES[index].themes.light.find(theme => theme.key === item.key) : null;

                if (newItemColor) {
                    lightModeBodyElement.style.setProperty(item.key, newItemColor.value);
                }

                return result;
            }, {});
        }

        this.handleSetCurrentTheme(index);

        if (themeToSet) {
            this.props.handleSetCurrentCustomization('theme_id', themeToSet.id);
        }

        handleTriggerChartRebuild && handleTriggerChartRebuild();
    };

    private handleSetCurrentTheme = (themeIndex: number) => {
        this.setState({ currentThemeIndex: themeIndex });
    };

    private handleApplyCustomizationSettings = (customization: CustomizationDataInterface) => {
        const parsedSettings = customization.settings ? JSON.parse(customization.settings) : null;

        if (parsedSettings && parsedSettings.theme_id) {
            const themeIndexToSet = AVAILABLE_COLOR_THEMES.findIndex(theme => theme.id === +parsedSettings.theme_id);

            if (themeIndexToSet >= 0) {
                this.handleSetCurrentTheme(themeIndexToSet);
                this.props.handleSetCurrentCustomization('theme_id', +parsedSettings.theme_id);
            }
        }
    };

    private handleResetCustomizationSettings = (customization: CustomizationDataInterface) => {
        const { handleTriggerChartRebuild } = this.props;
        const rootElement = document.documentElement;
        const lightModeBodyElement = document.querySelector<HTMLElement>('.light-mode')!;
        const parsedSettings = customization && customization.settings ? JSON.parse(customization.settings) : null;
        let shouldRebuildChart = false;

        this.handleClearCustomizationSettings();
        this.handleApplyCustomizationSettings(customization);

        window.console.log('parsedSettings: ', parsedSettings);

        if (lightModeBodyElement && parsedSettings?.theme_colors && parsedSettings?.theme_colors?.light) {
            parsedSettings.theme_colors.light.reduce((result, item) => {
                const newItemColor = item.value;

                if (newItemColor) {
                    lightModeBodyElement.style.setProperty(item.key, item.value);
                }

                return result;
            }, {});

            shouldRebuildChart = true;
        }

        if (rootElement && parsedSettings?.theme_colors && parsedSettings?.theme_colors?.dark) {
            parsedSettings.theme_colors.dark.reduce((result, item) => {
                const newItemColor = item.value;

                if (newItemColor) {
                    rootElement.style.setProperty(item.key, item.value);
                }

                return result;
            }, {});

            shouldRebuildChart = true;
        }

        if (shouldRebuildChart && handleTriggerChartRebuild) {
            handleTriggerChartRebuild();
        }
    };

    private handleClearCustomizationSettings = () => {
        const rootElement = document.documentElement;
        const bodyElement = document.querySelector<HTMLElement>('body')!;

        if (rootElement) {    
            AVAILABLE_COLORS_TITLES.reduce((result, item) => {
                rootElement.style.removeProperty(item.key);

                if (bodyElement) {
                    bodyElement.style.removeProperty(item.key);
                }

                return result;
            }, {});
        }
    }
}
