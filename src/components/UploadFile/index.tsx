import classnames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { TipIcon } from '../../assets/images/TipIcon';
import { changeElementPosition } from '../../helpers/changeElementPosition';

interface OwnPropsTranslations {
    title?: string;
    label?: string;
    buttonText?: string;
    sizesText?: string;
    formatsText?: string;
    tipText?: string;
}

interface OwnProps extends OwnPropsTranslations {
    handleUploadScan: (e) => void;
    id?: string;
    exampleImagePath?: string;
    uploadedFile?: string;
}

interface State {
    isMouseTooltipVisible: boolean;
}

type Props = OwnProps;

export class UploadFile extends React.Component<Props, State> {
    public state = {
        isMouseTooltipVisible: false,
    };

    public renderTitle() {
        const { tipText, title } = this.props;

        return (
            <div className="pg-upload-file__content__title">
                {tipText ? (
                    <div
                        className="pg-upload-file__content__title__tip-icon"
                        onMouseEnter={e => this.handleHoverTooltipIcon()}
                        onMouseLeave={e => this.handleToggleTooltipVisible()}
                    >
                        <TipIcon />
                    </div>
                ) : null}
                {title ? <h3>{title}</h3> : null}
            </div>
        );
    }

    public render() {
        const {
            title,
            label,
            buttonText,
            sizesText,
            formatsText,
            tipText,
            exampleImagePath,
            id,
            uploadedFile,
        } = this.props;
        const { isMouseTooltipVisible } = this.state;

        const tooltipClass = classnames('pg-upload-file__tooltip tooltip-hover', {
            'tooltip-hover--visible': isMouseTooltipVisible,
        });

        return (
            <div className="pg-upload-file">
                <div className="pg-upload-file__content">
                    {tipText || title ? this.renderTitle() : null}
                    {label ? <label>{label}</label> : null}
                    <div className="pg-upload-file__content__form">
                        <input
                            className="pg-upload-file__content__form__input"
                            data-multiple-caption="files selected"
                            draggable={true}
                            multiple={false}
                            name="files[]"
                            type="file"
                            id={id || 'file'}
                            onChange={this.props.handleUploadScan}
                        />
                        <div className="pg-upload-file__content__form__info">
                            {buttonText ? <span className="pg-upload-file__content__form__info__button btn-primary">{buttonText}</span> : null}
                            {sizesText ? <span className="pg-upload-file__content__form__info__text">{sizesText}</span> : null}
                            {formatsText ? <span className="pg-upload-file__content__form__info__text">{formatsText}</span> : null}
                            {uploadedFile ? <span className="pg-upload-file__content__form__info__text file">{uploadedFile}</span> : null}
                        </div>
                    </div>
                </div>
                {exampleImagePath ? (
                    <div className="pg-upload-file__doc-image">
                        <img
                            src={exampleImagePath}
                            alt={`${label} example`}
                        />
                    </div>
                ) : null}
                {tipText ? (
                    <span className={tooltipClass}>
                        <FormattedMessage id={tipText} />
                    </span>
                ) : null}
            </div>
        );
    }

    private handleToggleTooltipVisible = () => {
        this.setState(prevState => ({
            isMouseTooltipVisible: !prevState.isMouseTooltipVisible,
        }));
    };

    private handleHoverTooltipIcon = () => {
        changeElementPosition('pg-upload-file__tooltip', 0, -100, 20);
        this.handleToggleTooltipVisible();
    };
}
