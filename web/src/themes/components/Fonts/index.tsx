import React, { FC, ReactElement, useState } from 'react';
import { DropdownComponent } from '../../../components';
import { FONT_PRESETS, ThemeFontInterface } from '../../../themes';

interface ParentProps {
    translate: (key: string) => string;
    resetToDefault: boolean;
    handleSetFont: (value: ThemeFontInterface) => void;
}

type Props = ParentProps;

export const ThemesFonts: FC<Props> = ({
    handleSetFont,
    translate,
}): ReactElement => {
    const [currentFontIndex, setCurrentFontIndex] = useState<number>(0);
    const handleGetThemesTitlesList = (): string[] => 
        FONT_PRESETS.map(item => item.title);

    const handleChangeCurrentTheme = (index: number) => {
        setCurrentFontIndex(index);
        handleSetFont(FONT_PRESETS[index]);
    }

    return (
        <div className="pg-themes-fonts">
            <div className="pg-themes-fonts__font-family">
                <label className="pg-themes-themes__font-family__dropdown-label">
                    {translate('page.body.customization.fonts.fontFamily.selector.label')}
                </label>
                <DropdownComponent
                    className="pg-themes-themes__font-family__dropdown"
                    list={handleGetThemesTitlesList()}
                    onSelect={handleChangeCurrentTheme}
                    placeholder={FONT_PRESETS[currentFontIndex].title}
                />
            </div>
        </div>
    )
};
