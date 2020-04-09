import * as React from 'react';
import {
    CustomizationCurrentDataInterface,
    CustomizationDataInterface,
} from '../../../modules';
import { ImageSettings } from './ImageSettings';

interface OwnProps {
    translate: (key: string) => string;
    resetToDefault: boolean;
    handleSetCurrentCustomization: (key: string, value: string | number) => void;
    currentCustomization?: CustomizationCurrentDataInterface;
    customization?: CustomizationDataInterface;
}

type Props = OwnProps;

export class CustomizationImages extends React.PureComponent<Props> {
    public render() {
        return (
            <div className="pg-customization-images">
                <ImageSettings
                    {...this.props}
                    targetImage="header_logo"
                    maxWidth={136}
                />
            </div>
        );
    }
}
