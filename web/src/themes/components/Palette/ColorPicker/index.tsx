import classnames from 'classnames';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import { handleConvertColorCode } from '../';
import { ArrowIcon } from '../../../../assets/images/customization/ArrowIcon';
import { ColorVariablePresetInterface } from '../../../../themes';

interface ParentProps {
    item: ColorVariablePresetInterface;
    handleCloseColorSettings: () => void;
    translate: (key: string) => string;
    handleTriggerChartRebuild?: () => void;
}

type Props = ParentProps;

export const ColorPicker: FC<Props> = ({
    item,
    handleCloseColorSettings,
    translate,
    handleTriggerChartRebuild,
}): ReactElement => {
    const [selectedColor, setSelectedColor] = useState<string | undefined>();

    useEffect(() => {
        handleSetCurrentItemColor();
    }, [item]);

    const handleSetCurrentItemColor = (colorToSet?: string) => {
        if (colorToSet) {
            setSelectedColor(`rgb(${colorToSet})`);
        } else {
            setSelectedColor('');
        }
    };

    const onChangeSelectedColor = color => {
        const rootElement = document.documentElement;
        const newItemColor = color && color.rgb && `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`;

        if (rootElement && newItemColor) {
            const lightModeBodyElement = document.querySelector<HTMLElement>('.light-mode')!;
            handleSetCurrentItemColor(newItemColor);

            if (lightModeBodyElement) {
                lightModeBodyElement.style.setProperty(item.key, newItemColor);
            } else {
                rootElement.style.setProperty(item.key, newItemColor);
            }

            handleTriggerChartRebuild && handleTriggerChartRebuild();
        }
    };

    const getItemColor = (color: ColorVariablePresetInterface) => {
        const bodyStyles = window.getComputedStyle(document.body);
        const grbItemColor = handleConvertColorCode(color.key);

        return selectedColor || bodyStyles.getPropertyValue(grbItemColor);
    };

    const componentClass = classnames('pg-themes-color-picker', {
        'pg-themes-color-picker--open': item.key,
    });

    return (
        <div className={componentClass}>
            <div className="pg-themes-color-picker__header">
                <div
                    className="pg-themes-color-picker__header__chevron"
                    onClick={e => handleCloseColorSettings()}
                >
                    <ArrowIcon />
                </div>
                {item.title ? (
                    <span
                        className="pg-themes-color-picker__header__title"
                    >
                        {translate(item.title)}
                    </span>
                ) : null}
            </div>
            <div className="pg-themes-color-picker__body">
                <SketchPicker
                    color={getItemColor(item)}
                    onChangeComplete={onChangeSelectedColor}
                />
            </div>
        </div>
    );
}
