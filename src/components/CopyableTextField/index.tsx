import '@openware/cryptofont';
import classnames from 'classnames';
import * as React from 'react';
import { Button } from '../../components/atoms/Button/Button';


interface CopyableTextFieldProps {
    /**
     * Text value that will be copied to the clipboard
     */
    value: string;
    /**
     * Additional class name for styling. By default element receives `cr-button` class
     * @default empty
     */
    className?: string;
    /**
     * String value that makes copy field be unique
     */
    fieldId: string;
    /**
     * @default 'Copy'
     *  Renders text of the label of copy button component
     */
    copyButtonText?: string;
    /**
     * @default 'false'
     * If true, Button will be disabled.
     */
    disabled?: boolean;
}

type CopyTypes = HTMLInputElement | null;

const copy = (id: string) => {
    const copyText: CopyTypes = document.querySelector(`#${id}`);

    if (copyText) {
        copyText.select();

        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    }
};

/**
 * Text field component with ability to copy inner text.
 */
class CopyableTextField extends React.Component<CopyableTextFieldProps> {
    public componentDidMount() {
        if (!this.props.fieldId) {
            throw new Error('CopyableTextField must contain `fieldId` prop');
        }
    }

    public render() {
        const {
            value,
            className,
            disabled,
            fieldId,
            copyButtonText,
        } = this.props;
        const doCopy = () => copy(fieldId);
        const cx = classnames('cr-copyable-text-field', className);
        return (
            <div className={cx}>
                <div className="cr-copyable-text-field__input">
                    <input
                        id={String(fieldId)}
                        readOnly={true}
                        type="text"
                        value={value}
                        onClick={doCopy}
                        disabled={disabled}
                    />
                    <Button
                        className="cr-copyable-text-field__button"
                        label={copyButtonText ? copyButtonText : 'Copy'}
                        type={'text'}
                        onClick={doCopy}
                        disabled={disabled}
                        noMargin={true}
                    />
                </div>
            </div>
        );
    }
}

export {
    CopyableTextField,
    CopyableTextFieldProps,
};
