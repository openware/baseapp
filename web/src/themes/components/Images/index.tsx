import React, { FC, ReactElement } from 'react';
import { ThemeLogoInterface } from '../../../themes';
import { ThemesImagesItem } from './Item';

interface ParentProps {
    translate: (key: string) => string;
    resetToDefault: boolean;
    handleUpdateImage: (key: string) => (value: ThemeLogoInterface) => void;
}

type Props = ParentProps;

export const ThemesImages: FC<Props> = (props: Props): ReactElement => (
    <div className="pg-themes-images">
        <ThemesImagesItem
            {...props}
            handleUpdateImage={props.handleUpdateImage('logo')}
            imageTitle="logo"
            maxWidth={136}
        />
    </div>
);
