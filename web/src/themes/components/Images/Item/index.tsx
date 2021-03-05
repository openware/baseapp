import React, { FC, ReactElement, useEffect, useState } from 'react';
import { LogoIcon } from '../../../../assets/images/LogoIcon';
import { CustomInput } from '../../../../components';
import {
    ThemeInterface,
    ThemeLogoInterface,
} from '../../../../themes';

interface ParentProps {
    resetToDefault: boolean;
    imageTitle: string;
    maxWidth: number;
    handleUpdateImage: (value: ThemeLogoInterface) => void;
    translate: (key: string) => string;
}

type Props = ParentProps;

const DEFAULT_IMAGE: ThemeLogoInterface = {
    url: '',
    width: '',
};

export const ThemesImagesItem: FC<Props> = (props: Props): ReactElement => {
    const [image, setImage] = useState<ThemeLogoInterface>(DEFAULT_IMAGE);

    useEffect(() => {
        handleSetImageFromConfig();
    }, []);

    useEffect(() => {
        if (props.resetToDefault) {
            handleSetImageFromConfig();
        }
    }, [props.resetToDefault]);

    const handleSetImageFromConfig = () => {
        const themeFromConfig: ThemeInterface | undefined =
        window.env?.theme ? JSON.parse(window.env.theme) : undefined;

        const imageFromConfig: ThemeLogoInterface = themeFromConfig?.[props.imageTitle];

        setImage(imageFromConfig || DEFAULT_IMAGE);
    };

    const handleUpdateImage = (field: string) => (value: string | number) => {
        const updatedImage = {
            ...image,
            [field]: value,
        }

        setImage(updatedImage);
        props.handleUpdateImage(updatedImage);
    }

    return (
        <div key={props.imageTitle} className="pg-themes-images-item">
            <h2>{props.translate(`page.body.customization.images.${props.imageTitle}.title`)}</h2>
            <div className="pg-themes-images-item__preview">
                {image.url ? (
                    <img
                        src={image.url} alt={`${props.imageTitle}`}
                        style={image.width ? { width: `${image.width}px`} : null}
                    />
                ) : (
                    <LogoIcon
                        styles={image.width ? { width: `${image.width}px`} : null}
                    />
                )}
            </div>
            <div className="pg-themes-images-item__url">
                <label>{props.translate('page.body.customization.images.field.url.label')}</label>
                <CustomInput
                    type="text"
                    label=""
                    placeholder={props.translate('page.body.customization.images.field.url.placeholder')}
                    defaultLabel=""
                    handleChangeInput={handleUpdateImage('url')}
                    inputValue={image.url}
                    autoFocus={false}
                />
            </div>
            <div className="pg-themes-images-item__width">
                <label>{props.translate('page.body.customization.images.field.width.label')}</label>
                <CustomInput
                    type="number"
                    label=""
                    placeholder={props.translate('page.body.customization.images.field.width.placeholder')}
                    defaultLabel=""
                    handleChangeInput={handleUpdateImage('width')}
                    inputValue={image.width}
                    autoFocus={false}
                />
            </div>
        </div>
    );
}
