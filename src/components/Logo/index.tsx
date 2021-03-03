import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LogoIcon } from '../../assets/images/LogoIcon';
import { selectApplyWindowEnvsTriggerState } from '../../modules';
import { CustomizationSettingsInterface, LogoInterface } from '../../themes';


const DEFAULT_IMAGE: LogoInterface = {
    url: '',
    width: '',
};

export const Logo: FC = (): ReactElement => {
    const applyWindowEnvsTrigger = useSelector(selectApplyWindowEnvsTriggerState);
    const [image, setImage] = useState<LogoInterface | undefined>(DEFAULT_IMAGE);

    const handleGetImageFromConfig = (): LogoInterface | undefined => {
        const settingsFromConfig: CustomizationSettingsInterface | undefined =
            window.env?.palette ? JSON.parse(window.env.palette) : undefined;

        return settingsFromConfig?.['header_logo'];
    };

    useEffect(() => {
        setImage(handleGetImageFromConfig());
    }, [applyWindowEnvsTrigger]);

    return (
        <div className="pg-logo">
            {image?.url ? (
                <img
                    src={image.url}
                    alt="Logo"
                    className="pg-logo__img"
                    style={{ width: image?.width ? `${image.width}px` : 'auto'}}
                />
            ) : (
                <LogoIcon
                    className="pg-logo__img"
                    styles={{ width: image?.width ? `${image.width}px` : 'auto'}}
                />
            )}
        </div>
    );
};
