import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LogoIcon } from '../../assets/images/LogoIcon';
import { selectApplyWindowEnvsTriggerState } from '../../modules';
import { ThemeInterface, ThemeLogoInterface } from '../../themes';


const DEFAULT_IMAGE: ThemeLogoInterface = {
    url: '',
    width: '',
};

export const Logo: FC = (): ReactElement => {
    const applyWindowEnvsTrigger = useSelector(selectApplyWindowEnvsTriggerState);
    const [image, setImage] = useState<ThemeLogoInterface | undefined>(DEFAULT_IMAGE);

    const handleGetImageFromConfig = (): ThemeLogoInterface | undefined => {
        const themeFromConfig: ThemeInterface | undefined =
            window.env?.theme ? JSON.parse(window.env.theme) : undefined;

        return themeFromConfig?.['logo'];
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
