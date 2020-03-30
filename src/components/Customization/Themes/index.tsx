import * as React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { SettingsIcon } from '../../../assets/images/customization/SettingsIcon';
import { DropdownComponent } from '../../../components';
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
    translate: (key: string) => string;
    resetToDefault: boolean;
    handleTriggerChartRebuild?: () => void;
    handleSetCurrentCustomization: (key: string, value: string | number) => void;
    currentCustomization?: CustomizationCurrentDataInterface;
    customization?: CustomizationDataInterface;
}

type Props = OwnProps;

interface State {
    colorSettingsItem: ThemeColorTitleInterface;
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
    };

    public componentDidMount() {
        const {
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
    }

    public componentDidUpdate(prevProps: Props) {
        const { customization, resetToDefault } = this.props;

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

    public render() {
        const { handleTriggerChartRebuild, translate } = this.props;
        const { colorSettingsItem } = this.state;

        return (
            <div className="pg-customization-themes">
                {this.renderThemesDropdown()}
                {this.renderColors()}
                <ColorSettings
                    handleCloseColorSettings={this.handleSetColorSettingsItem}
                    item={colorSettingsItem}
                    translate={translate}
                    handleTriggerChartRebuild={handleTriggerChartRebuild}
                />
            </div>
        );
    }

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
        const themeToSet = AVAILABLE_COLOR_THEMES[index];

        if (rootElement) {
            AVAILABLE_COLORS_TITLES.reduce((result, item) => {
                const newItemColor = AVAILABLE_COLOR_THEMES[index].theme.find(theme => theme.key === item.key);

                if (newItemColor) {
                    rootElement.style.setProperty(item.key, newItemColor.value);
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
        const parsedSettings = customization && customization.settings ? JSON.parse(customization.settings) : null;

        this.handleApplyCustomizationSettings(customization);

        if (rootElement && parsedSettings && parsedSettings.theme_colors) {
            parsedSettings.theme_colors.reduce((result, item) => {
                const newItemColor = item.value;

                if (newItemColor) {
                    rootElement.style.setProperty(item.key, item.value);
                }

                return result;
            }, {});

            handleTriggerChartRebuild && handleTriggerChartRebuild();
        }
    };
}
