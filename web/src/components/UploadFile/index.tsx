import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TipIcon } from '../../assets/images/TipIcon';
import { changeElementPosition } from '../../helpers';

interface OwnPropsTranslations {
    title?: string;
    label?: string;
    buttonText?: string;
    sizesText?: string;
    formatsText?: string;
    tipText?: string;
    isMobileDevice?: boolean;
    fileSizeErrorMessage?: string;
}

interface OwnProps extends OwnPropsTranslations {
    handleUploadScan: (e: any) => void;
    id?: string;
    exampleImagePath?: string;
    uploadedFile?: string;
    accept?: string;
}

type Props = OwnProps;

const UploadFileComponent: React.FC<Props> = ({
    title,
    label,
    buttonText,
    sizesText,
    formatsText,
    tipText,
    exampleImagePath,
    id,
    isMobileDevice,
    uploadedFile,
    accept = 'image/jpg,image/jpeg,image/png,image/heic,.pdf',
    handleUploadScan,
    fileSizeErrorMessage,
}) => {
    const [isMouseTooltipVisible, setIsMouseTooltipVisible] = useState<boolean>(false);

    const handleToggleTooltipVisible = useCallback(() => {
        setIsMouseTooltipVisible((prevState) => !prevState);
    }, []);

    const handleHoverTooltipIcon = useCallback(() => {
        changeElementPosition('pg-upload-file__tooltip', 0, -100, 20);
        handleToggleTooltipVisible();
    }, [handleToggleTooltipVisible]);

    const renderTitle = useCallback(() => {
        return (
            <div className="pg-upload-file__content__title">
                {tipText ? (
                    <div
                        className="pg-upload-file__content__title__tip-icon"
                        onMouseEnter={handleHoverTooltipIcon}
                        onMouseLeave={handleToggleTooltipVisible}>
                        <TipIcon />
                    </div>
                ) : null}
                {title ? <h3>{title}</h3> : null}
            </div>
        );
    }, [handleHoverTooltipIcon, handleToggleTooltipVisible, tipText, title]);

    const uploadCls = classnames('pg-upload-file__content__form__info', {
        'pg-upload-file__content__form__info__center': !exampleImagePath,
    });

    return (
        <div className="pg-upload-file">
            <div className="pg-upload-file__content">
                {tipText || title ? renderTitle() : null}
                {label ? <label>{label}</label> : null}
                <div className="pg-upload-file__content__form">
                    <input
                        accept={accept}
                        className="pg-upload-file__content__form__input"
                        data-multiple-caption="files selected"
                        draggable={true}
                        multiple={false}
                        name="files[]"
                        type="file"
                        id={id || 'file'}
                        onChange={handleUploadScan}
                    />
                    <div className={uploadCls}>
                        {exampleImagePath ? (
                            <div className="pg-upload-file__doc-image">
                                <img src={exampleImagePath} alt={`${label} example`} />
                            </div>
                        ) : null}
                        <div>
                            {buttonText ? (
                                <span className="pg-upload-file__content__form__info__button btn-primary">
                                    {buttonText}
                                </span>
                            ) : null}
                            {fileSizeErrorMessage ? (
                                <span className="pg-upload-file__content__form__error__text">{fileSizeErrorMessage}</span>
                            ) : null }
                            {sizesText ? (
                                <span className="pg-upload-file__content__form__info__text">{sizesText}</span>
                            ) : null}
                            {formatsText ? (
                                <span className="pg-upload-file__content__form__info__text">{formatsText}</span>
                            ) : null}
                            {uploadedFile ? (
                                <span className="pg-upload-file__content__form__info__text file">{uploadedFile}</span>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            {tipText ? (
                <span
                    className={classnames('pg-upload-file__tooltip tooltip-hover', {
                        'tooltip-hover--visible': isMouseTooltipVisible,
                    })}>
                    <FormattedMessage id={tipText} />
                </span>
            ) : null}
        </div>
    );
};

export const UploadFile = React.memo(UploadFileComponent);
