import React, { FC, ReactElement, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { SettingsIcon } from '../../../assets/images/customization/SettingsIcon';
import { DropdownComponent, TabPanel } from '../../../components';
import { applyThemePaletteColors } from '../../../helpers';
import {
    COLOR_VARIABLE_PRESETS,
    ColorVariablePresetInterface,
    PALETTE_PRESETS,
    ThemeInterface,
    ThemePaletteInterface,
} from '../../../themes';
import { ColorPicker } from './ColorPicker';

export const handleConvertColorCode = (value: string, fromRGB?: boolean) => (
    fromRGB ? `--grb-${value.slice(2)}` :  `--${value.slice(6)}`
);

interface ParentProps {
    colorTheme: string;
    resetToDefault: boolean;
    handleSetCurrentColorTheme: (value: string) => void;
    handleSetThemeKey: (value: string) => void;
    translate: (key: string) => string;
    handleTriggerChartRebuild?: () => void;
}

type Props = ParentProps;

const defaultColorSettingsItem: ColorVariablePresetInterface = {
    key: '',
    title: '',
};

export const ThemesPalette: FC<Props> = ({
    colorTheme,
    resetToDefault,
    handleSetCurrentColorTheme,
    handleSetThemeKey,
    translate,
    handleTriggerChartRebuild,
}): ReactElement => {
    const [colorSettingsItem, setColorSettingsItem] = useState<ColorVariablePresetInterface>(defaultColorSettingsItem);
    const [currentPaletteIndex, setCurrentPaletteIndex] = useState<number>(0);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

    useEffect(() => {
        setCurrentPaletteIndex(handleGetDefaultPalette());
    }, []);

    useEffect(() => {
        handleChangeTab(0);
        setCurrentPaletteIndex(handleGetDefaultPalette());
    }, [resetToDefault]);

    useEffect(() => {
        if (colorTheme === 'light') {
            setCurrentTabIndex(1);
        } else {
            setCurrentTabIndex(0)
        }
    }, [colorTheme]);

    const handleGetDefaultPalette = (): number => {
        const themeFromConfig: ThemeInterface | undefined =
            window.env?.theme ? JSON.parse(window.env.theme) : undefined;

        const paletteIndexToSet = PALETTE_PRESETS.findIndex(palette => palette.key === themeFromConfig?.palette?.key);

        return (paletteIndexToSet > 0) ? paletteIndexToSet : 0;
    }

    const handleGetThemesTitlesList = () => PALETTE_PRESETS.map(item => translate(item.title));

    const handleChangeCurrentTheme = (index: number) => {
        const { title, ...themeToSet } = PALETTE_PRESETS[index];        
        const settingsToSet: ThemePaletteInterface = {
            ...themeToSet,
            colors: {
                dark: themeToSet.colors.dark,
                light: themeToSet.colors.light,
            }
        }

        setCurrentPaletteIndex(index);
        handleSetThemeKey(themeToSet.key);
        applyThemePaletteColors(settingsToSet, handleTriggerChartRebuild);
    };


    const handleChangeTab = (index: number) => {
        if (index === 1) {
            handleSetCurrentColorTheme('light');
        } else {
            handleSetCurrentColorTheme('dark');
        }

        setCurrentTabIndex(index);
    };

    const handleSetColorSettingsItem = (item?: ColorVariablePresetInterface) => {
        let updatedItem: ColorVariablePresetInterface = defaultColorSettingsItem;

        if (item) {
            updatedItem = item;
        }

        setColorSettingsItem(updatedItem);
    };

    const renderColorsItem = (item: ColorVariablePresetInterface, index: number) => {
        const grbItemKey = handleConvertColorCode(item.key);

        return (
            <div
                key={index}
                className="pg-themes-palette__colors__item"
                onClick={e => handleSetColorSettingsItem(item)}
            >
                <div className="pg-themes-palette__colors__item__content">
                    <span
                        className="pg-themes-palette__colors__item__content__circle"
                        style={{backgroundColor: `var(${grbItemKey})`}}
                    />
                    <span className="pg-themes-palette__colors__item__content__title">{translate(item.title)}</span>
                </div>
                <div className="pg-themes-palette__colors__item__settings-icon">
                    <SettingsIcon />
                </div>
            </div>
        );
    }

    const renderColors = () => (
        <div className="pg-themes-palette__colors">
            <PerfectScrollbar>
                {COLOR_VARIABLE_PRESETS.map((item, index) => renderColorsItem(item, index))}
            </PerfectScrollbar>
        </div>
    );

    const tabs = [
        {
            content: currentTabIndex === 0 ? renderColors() : null,
            label: translate('page.body.customization.themes.tabs.dark'),
        },
        {
            content: currentTabIndex === 1 ? renderColors() : null,
            label: translate('page.body.customization.themes.tabs.light'),
        },
    ];

    return (
        <div className="pg-themes-palette">
            <div className="pg-themes-palette__dropdown">
                <label className="pg-themes-palette__dropdown__label">
                    {translate('page.body.customization.themes.selector.label')}
                </label>
                <DropdownComponent
                    className="pg-themes-palette__dropdown__content"
                    list={handleGetThemesTitlesList()}
                    onSelect={handleChangeCurrentTheme}
                    placeholder={translate(PALETTE_PRESETS[currentPaletteIndex].title)}
                />
            </div>
            <TabPanel
                panels={tabs}
                onTabChange={handleChangeTab}
                currentTabIndex={currentTabIndex}
            />
            <ColorPicker
                handleCloseColorSettings={handleSetColorSettingsItem}
                item={colorSettingsItem}
                translate={translate}
                handleTriggerChartRebuild={handleTriggerChartRebuild}
            />
        </div>
    );
}
