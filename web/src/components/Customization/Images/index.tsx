import * as React from 'react';
import { LogoInterface } from '../../../themes';
import { ImageSettings } from './ImageSettings';

interface ParentProps {
    translate: (key: string) => string;
    resetToDefault: boolean;
    handleSetHeaderLogo: (value: LogoInterface) => void;
}

type Props = ParentProps;

export const CustomizationImages: React.FC<Props> = (props: Props) => (
    <div className="pg-customization-images">
        <ImageSettings {...props} imageTitle="header_logo" maxWidth={136} />
    </div>
);
