import classnames from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { IntlProps } from '../../';
import { PaletteIcon } from '../../assets/images/customization/PaletteIcon';
import {
    CustomizationFonts,
    CustomizationImages,
    CustomizationSpacing,
    CustomizationThemes,
    TabPanel,
} from '../../components';
import { applyCustomizationSettings } from '../../helpers';
import {
    changeColorTheme,
    configUpdate,
    RootState,
    selectCurrentColorTheme,
    selectUserLoggedIn,
    toggleChartRebuild,
} from '../../modules';
import {
    AVAILABLE_COLOR_TITLES,
    CustomizationSettingsInterface,
    ThemeColorInterface,
} from '../../themes';

import './customization.pcss';

interface ReduxProps {
    colorTheme: string;
    userLoggedIn: boolean;
}

interface DispatchProps {
    changeColorTheme: typeof changeColorTheme;
    configUpdate: typeof configUpdate;
    toggleChartRebuild: typeof toggleChartRebuild;
}

type Props = ReduxProps & RouterProps & DispatchProps & IntlProps;

interface State {
    currentThemeId: number;
    currentTabIndex: number;
    isOpen: boolean;
    resetToDefault: boolean;
}

class CustomizationContainer extends React.Component<Props, State> {
    public state = {
        currentThemeId: -1,
        currentTabIndex: 0,
        isOpen: true,
        resetToDefault: false,
    };

    public renderTabs = () => {
        const { colorTheme, changeColorTheme } = this.props;
        const { currentTabIndex, resetToDefault } = this.state;

        return [
            {
                content: currentTabIndex === 0 ? (
                    <CustomizationThemes
                        colorTheme={colorTheme}
                        resetToDefault={resetToDefault}
                        handleSetCurrentColorTheme={changeColorTheme}
                        handleSetThemeId={this.handleSetThemeId}
                        handleTriggerChartRebuild={this.handleTriggerChartRebuild}
                        translate={this.translate}
                    />
                ) : null,
                label: this.translate('page.body.customization.tabs.themes'),
            },
            {
                content: currentTabIndex === 1 ? <CustomizationFonts translate={this.translate} /> : null,
                label: this.translate('page.body.customization.tabs.fonts'),
            },
            {
                content: currentTabIndex === 2 ? <CustomizationSpacing translate={this.translate} /> : null,
                label: this.translate('page.body.customization.tabs.spacing'),
            },
            {
                content: currentTabIndex === 3 ? <CustomizationImages translate={this.translate} /> : null,
                label: this.translate('page.body.customization.tabs.images'),
            },
        ];
    };

    public renderActionButtons() {
        return (
            <div className="pg-customization__action-buttons">
                <span className="pg-customization__action-buttons__button" onClick={this.handleClickResetButton}>
                    {this.translate('page.body.customization.actionButtons.reset')}
                </span>
                <span className="pg-customization__action-buttons__button" onClick={this.handleClickSaveButton}>
                    {this.translate('page.body.customization.actionButtons.save')}
                </span>
            </div>
        );
    }

    public render() {
        const { userLoggedIn } = this.props;
        const { currentTabIndex, isOpen } = this.state;

        if (!userLoggedIn || !this.handleCheckRoute()) {
            return null;
        }

        const customizationClassName = classnames('pg-customization', {
            'pg-customization--hidden': !isOpen,
        });

        return (
            <div className={customizationClassName}>
                <div className="pg-customization__toggler" onClick={e => this.handleToggleIsOpen()}>
                    <PaletteIcon />
                </div>
                <TabPanel
                    panels={this.renderTabs()}
                    onTabChange={this.handleChangeTab}
                    currentTabIndex={currentTabIndex}
                />
                {this.renderActionButtons()}
            </div>
        );
    }

    private handleClickResetButton = () => {
        this.setState({ resetToDefault: !this.state.resetToDefault });
        applyCustomizationSettings(null, this.props.toggleChartRebuild);
    };

    private handleClickSaveButton = () => {
        const { currentThemeId } = this.state;
        const settingsFromConfig: CustomizationSettingsInterface | null | undefined =
            window.env?.settings ? JSON.parse(window.env.settings) : null;
        const rootElement = document.documentElement;
        const bodyElement = document.querySelector<HTMLElement>('body')!;
        const currentColors: { [key: string]: ThemeColorInterface[] } = {
            dark: [],
            light: [],
        };

        AVAILABLE_COLOR_TITLES.reduce((result, item) => {
            if (rootElement) {
                const itemColor = rootElement.style.getPropertyValue(item.key);

                if (itemColor) {
                    currentColors.dark.push({
                        key: item.key,
                        value: itemColor,
                    });
                }
            }

            if (bodyElement) {
                const itemColor = bodyElement.style.getPropertyValue(item.key);

                if (itemColor) {
                    currentColors.light.push({
                        key: item.key,
                        value: itemColor,
                    });
                }
            }

            return result;
        }, {});

        let settings: CustomizationSettingsInterface = {
            ...settingsFromConfig,
            theme_colors: {
                ...settingsFromConfig?.theme_colors,
                dark: currentColors.dark,
                light: currentColors.light,
            },
        };

        if (currentThemeId >= 0 ) {
            settings = {
                ...settings,
                theme_id: currentThemeId,
            }
        }

        this.props.configUpdate({
            component: 'baseapp',
            scope: 'public',
            key: 'settings',
            value: JSON.stringify(settings),
        });
    };

    private handleChangeTab = (index: number) => {
        this.setState({
            currentTabIndex: index,
        });
    };

    private handleCheckRoute = () => {
        if (window.location.hash && window.location.hash.substring(1) === 'settings') {
            return true;
        }

        return false;
    };

    private handleSetThemeId = (value: number) => {
        this.setState({
            currentThemeId: value,
        });
    }

    private handleToggleIsOpen = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen,
        }));
    };

    private handleTriggerChartRebuild = () => {
        this.props.toggleChartRebuild();
    };

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeColorTheme: payload => dispatch(changeColorTheme(payload)),
        configUpdate: payload => dispatch(configUpdate(payload)),
        toggleChartRebuild: () => dispatch(toggleChartRebuild()),
    });

// tslint:disable no-any
export const Customization = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(CustomizationContainer) as any) as any);
