import * as React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { SettingsIcon } from '../../../assets/images/customization/SettingsIcon';
import { DropdownComponent, TabPanel } from '../../../components';
import { applyCustomizationSettingsColors } from '../../../helpers';
import {
    AVAILABLE_THEME_PRESETS,
    AVAILABLE_COLOR_TITLES,
    CustomizationSettingsInterface,
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
    handleSetThemeId: (value: number) => void;
    translate: (key: string) => string;
    handleTriggerChartRebuild?: () => void;
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
        const { colorTheme } = this.props;
        const defaultTheme = this.handleGetDefaultTheme();

        if (colorTheme === 'light') {
            this.setState({ currentTabIndex: 1 });
        } else {
            this.setState({ currentTabIndex: 0 });
        }

        this.handleSetCurrentTheme(defaultTheme);
    }

    public componentDidUpdate(prevProps: Props) {
        const { colorTheme, resetToDefault } = this.props;

        if (colorTheme !== prevProps.colorTheme) {
            if (colorTheme === 'light') {
                this.setState({ currentTabIndex: 1 });
            } else {
                this.setState({ currentTabIndex: 0 });
            }
        }

        if (resetToDefault !== prevProps.resetToDefault) {
            this.handleChangeCurrentTheme(this.handleGetDefaultTheme());
            this.handleChangeTab(0);
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
                    placeholder={translate(AVAILABLE_THEME_PRESETS[currentThemeIndex].title)}
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
                    {AVAILABLE_COLOR_TITLES.map((item, index) => this.renderColorsItem(item, index))}
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

        return AVAILABLE_THEME_PRESETS.map(item => translate(item.title));
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
        const themeToSet = AVAILABLE_THEME_PRESETS[index];        
        const settingsToSet = {
            theme_id: themeToSet.theme_id,
            theme_colors: {
                dark: themeToSet.theme_colors.dark,
                light: themeToSet.theme_colors.light,
            }
        }

        this.handleSetCurrentTheme(index);
        applyCustomizationSettingsColors(settingsToSet, handleTriggerChartRebuild);
    };

    private handleSetCurrentTheme = (themeIndex: number) => {
        const { handleSetThemeId } = this.props;
        this.setState({ currentThemeIndex: themeIndex });
        handleSetThemeId(themeIndex);
    };

    private handleGetDefaultTheme = (): number => {
        const settingsFromConfig: CustomizationSettingsInterface | null | undefined =
            window.env?.settings ? JSON.parse(window.env.settings) : null;

        const themeIndexToSet = AVAILABLE_THEME_PRESETS.findIndex(theme => theme.theme_id === settingsFromConfig?.theme_id);

        if (themeIndexToSet > 0) {
            return themeIndexToSet;
        }        

        return 0;
    }
}
