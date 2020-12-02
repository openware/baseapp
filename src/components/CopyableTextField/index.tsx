import '@openware/cryptofont';
import classnames from 'classnames';
import React, { useCallback } from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import copyToClipboard from 'copy-to-clipboard';

import { CustomInput } from '../';

import './index.scss';

interface Props {
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
    fieldId?: string;
    afterCopy?: () => void;
}

/**
 * Text field component with ability to copy inner text.
 */
export const CopyableTextField: React.FC<Props> = ({
    value,
    className,
    disabled,
    copyButtonText,
    label = '',
    afterCopy,
}) => {
    const hanldeCopy = useCallback(() => {
        if (!disabled) {
            copyToClipboard(value);
            if (afterCopy) {
                afterCopy();
            }
        }
    }, [value, disabled, afterCopy]);

    return (
        <InputGroup className={classnames('n-copyable-text-field', className)}>
            <CustomInput
                readOnly={true}
                inputValue={value}
                handleClick={hanldeCopy}
                type="text"
                isDisabled={disabled}
                label={label}
                defaultLabel={label}
                placeholder={label}
            />
            <InputGroup.Append>
                <Button onClick={hanldeCopy} disabled={disabled} size="lg" variant="primary">
                    {copyButtonText ? copyButtonText : 'Copy'}
                </Button>
            </InputGroup.Append>
        </InputGroup>
    );
};
