import React, { FC, useState } from 'react';
import { LogoIcon } from '../../../../assets/images/LogoIcon';
import { CustomizationSettingsInterface, LogoInterface } from '../../../../themes';
import { CustomInput } from '../../../index';

interface ParentProps {
    resetToDefault: boolean;
    imageTitle: string;
    maxWidth: number;
    handleSetHeaderLogo: (value: LogoInterface) => void;
    translate: (key: string) => string;
}

type Props = ParentProps;

const DEFAULT_IMAGE: LogoInterface = {
    url: '',
    width: '',
};

export const ImageSettings: FC<Props> = (props: Props) => {
    const [imageFromConfig, setImageFromConfig] = useState<LogoInterface>(DEFAULT_IMAGE);

    React.useEffect(() => {
        handleSetImageFromConfig();
    }, []);

    React.useEffect(() => {
        if (props.resetToDefault) {
            handleSetImageFromConfig();
        }
    }, [props.resetToDefault]);

    const handleSetImageFromConfig = () => {
        const settingsFromConfig: CustomizationSettingsInterface | undefined = window.env?.palette
            ? JSON.parse(window.env.palette)
            : undefined;

        const imageFromSettings: LogoInterface = settingsFromConfig?.[props.imageTitle];

        setImageFromConfig(imageFromSettings || DEFAULT_IMAGE);
    };

    const handleUpdateHeaderLogo = (field: string) => (value: string | number) => {
        const updatedImage = {
            ...imageFromConfig,
            [field]: value,
        };

        setImageFromConfig(updatedImage);
        props.handleSetHeaderLogo(updatedImage);
    };

    return (
        <div key={props.imageTitle} className="pg-customization-images__item">
            <h2>{props.translate(`page.body.customization.images.${props.imageTitle}.title`)}</h2>
            <div className="pg-customization-images__item__preview">
                {imageFromConfig.url ? (
                    <img
                        src={imageFromConfig.url}
                        alt={`${props.imageTitle}`}
                        style={imageFromConfig.width ? { width: `${imageFromConfig.width}px` } : null}
                    />
                ) : (
                    <LogoIcon styles={imageFromConfig.width ? { width: `${imageFromConfig.width}px` } : null} />
                )}
            </div>
            <div className="pg-customization-images__item__url">
                <label>{props.translate('page.body.customization.images.field.url.label')}</label>
                <CustomInput
                    type="text"
                    label=""
                    placeholder={props.translate('page.body.customization.images.field.url.placeholder')}
                    defaultLabel=""
                    handleChangeInput={handleUpdateHeaderLogo('url')}
                    inputValue={imageFromConfig.url}
                    autoFocus={false}
                />
            </div>
            <div className="pg-customization-images__item__width">
                <label>{props.translate('page.body.customization.images.field.width.label')}</label>
                <CustomInput
                    type="number"
                    label=""
                    placeholder={props.translate('page.body.customization.images.field.width.placeholder')}
                    defaultLabel=""
                    handleChangeInput={handleUpdateHeaderLogo('width')}
                    inputValue={imageFromConfig.width}
                    autoFocus={false}
                />
            </div>
        </div>
    );
};
