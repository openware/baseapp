import '@openware/cryptofont';
import classnames from 'classnames';
import * as React from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';


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
}

type CopyTypes = HTMLInputElement | null;


const copy = (id: string) => {
    const copyText: CopyTypes = document.querySelector(`#${id}`);

    if (copyText) {
        copyText.select();

        document.execCommand('copy');
        (window.getSelection() as any).removeAllRanges(); // tslint:disable-line
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
                <InputGroup>
                    <FormControl
                        id={String(fieldId)}
                        readOnly={true}
                        value={value}
                        type="text"
                        onClick={doCopy}
                        disabled={disabled}
                    />
                    <InputGroup.Append>
                        <Button
                            onClick={doCopy}
                            disabled={disabled}
                            size="lg"
                            variant="primary"
                        >
                            {copyButtonText ? copyButtonText : 'Copy'}
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        );
    }
}

export {
    CopyableTextField,
};
