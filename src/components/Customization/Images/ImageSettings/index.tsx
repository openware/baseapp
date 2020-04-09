import * as React from 'react';
import { LogoIcon } from '../../../../assets/images/LogoIcon';
import {
    CustomizationCurrentDataInterface,
    CustomizationDataInterface,
} from '../../../../modules';
import { CustomInput } from '../../../index';

interface OwnProps {
    translate: (key: string) => string;
    resetToDefault: boolean;
    handleSetCurrentCustomization: (key: string, value: string | number) => void;
    currentCustomization?: CustomizationCurrentDataInterface;
    customization?: CustomizationDataInterface;
    targetImage: string;
    maxWidth: number;
}

type Props = OwnProps;

export class ImageSettings extends React.PureComponent<Props> {
    public componentDidUpdate(prevProps: Props) {
        const {
            customization,
            resetToDefault,
            targetImage,
        } = this.props;

        if (resetToDefault !== prevProps.resetToDefault) {
            this.handleResetCustomizationSettings(`${targetImage}_url`, customization);
            this.handleResetCustomizationSettings(`${targetImage}_width`, customization);
        }
    }

    public render() {
        const {
            currentCustomization,
            handleSetCurrentCustomization,
            translate,
            targetImage,
            maxWidth,
        } = this.props;
        const targetElementUrl = `${targetImage}_url`;
        const targetElementWidth = `${targetImage}_width`;
        const inputUrl = this.getCustomizationPropertyByKey(targetElementUrl, currentCustomization);
        const inputWidth = this.getCustomizationPropertyByKey(targetElementWidth, currentCustomization);
        const imageWidth = +inputWidth > 0 && +inputWidth < maxWidth ? inputWidth : maxWidth;

        return (
            <div key={targetImage} className="pg-customization-images__item">
                <h2>{translate(`page.body.customization.images.${targetImage}.title`)}</h2>
                <div className="pg-customization-images__item__image-settings">
                    <div className="pg-customization-images__item__image-settings__preview">
                        <div style={{ maxWidth: `${imageWidth}px`}}>
                            {inputUrl ? <img src={inputUrl} alt={`${targetImage}`}/> : <LogoIcon />}
                        </div>
                    </div>
                    <div className="pg-customization-images__item__image-settings__width">
                        <label>{translate('page.body.customization.images.field.width.label')}</label>
                        <CustomInput
                            type="number"
                            label=""
                            placeholder={translate('page.body.customization.images.field.width.placeholder')}
                            defaultLabel=""
                            handleChangeInput={value => handleSetCurrentCustomization(targetElementWidth, value)}
                            inputValue={inputWidth}
                            autoFocus={false}
                        />
                    </div>
                </div>
                <div className="pg-customization-images__item__url">
                    <label>{translate('page.body.customization.images.field.url.label')}</label>
                    <CustomInput
                        type="text"
                        label=""
                        placeholder={translate('page.body.customization.images.field.url.placeholder')}
                        defaultLabel=""
                        handleChangeInput={value => handleSetCurrentCustomization(targetElementUrl, value)}
                        inputValue={inputUrl}
                        autoFocus={false}
                    />
                </div>
            </div>
        );
    }

    private getCustomizationPropertyByKey = (targetField: string, currentCustomization?: CustomizationCurrentDataInterface) => {
        if (currentCustomization && currentCustomization[targetField]) {
            return currentCustomization[targetField];
        }

        return '';
    };

    private handleResetCustomizationSettings = (targetField: string, customization?: CustomizationDataInterface) => {
        const parsedSettings = customization && customization.settings ? JSON.parse(customization.settings) : null;

        if (parsedSettings && parsedSettings[targetField]) {
            this.props.handleSetCurrentCustomization(targetField, parsedSettings[targetField]);
        } else {
            this.props.handleSetCurrentCustomization(targetField, '');
        }
    };
}
