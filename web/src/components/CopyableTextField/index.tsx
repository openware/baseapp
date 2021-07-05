import '@openware/cryptofont';
import classnames from 'classnames';
import * as React from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { CustomInput } from '../';
import { copy } from '../../helpers';
import { InputWithButton } from "src/components/InputWithButton";


export interface CopyableTextFieldProps {
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
    label?: string;
}

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
            label,
        } = this.props;
        const doCopy = () => copy(fieldId);
        const cx = classnames('cr-copyable-text-field', className);

        return (
<<<<<<< HEAD
          <InputWithButton
            value={value}
            className={cx}
            fieldId={fieldId}
            readOnly
            handleClickInput={doCopy}
            handleClickButton={doCopy}
            type="text"
            disabled={disabled}
            label={label}
            buttonText={copyButtonText || 'Copy'}
          />
=======
            <div className={cx}>
                <InputGroup>
                    <CustomInput
                        id={String(fieldId)}
                        readOnly={true}
                        inputValue={value}
                        handleClick={doCopy}
                        type="text"
                        isDisabled={disabled}
                        label={label || ''}
                        defaultLabel={label || ''}
                        placeholder={label || ''}
                    />
                    <InputGroup.Append>
                        <Button
                            onClick={doCopy}
                            disabled={disabled}
                            size="lg"
                            variant="primary"
                            className="cr-copyable-text-field__button"
                        >
                            {copyButtonText ? copyButtonText : 'Copy'}
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </div>
>>>>>>> origin/master
        );
    }
}

export {
    CopyableTextField,
    copy,
};
