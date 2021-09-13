import '@openware/cryptofont';
import classnames from 'classnames';
import * as React from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { CustomInput } from '../';
import { MouseEventHandler } from "react";
import { CopyIcon } from 'src/assets/images/CopyIcon';

const InputWithButton = ({
    value,
    className,
    fieldId = '',
    disabled = false,
    readOnly = false,
    buttonText = '',
    label = '',
    type = "text",
    handleClickInput = () => {},
    handleClickButton = () => {},
    handleChangeInput = () => {},
    buttonClassName = '',
}: {
    value: any;
    className: string;
    fieldId?: string | number;
    disabled?: boolean;
    buttonText?: string;
    label?: string;
    type?: string;
    readOnly?: boolean;
    buttonClassName?: string;
    handleClickInput?: MouseEventHandler;
    handleClickButton?: MouseEventHandler;
    handleChangeInput?: (value: string) => void;
}) => {
    const cx = classnames('cr-input-with-button-field', className);

    return (
        <div className={cx}>
            <InputGroup>
                <CustomInput
                    id={String(fieldId)}
                    readOnly={readOnly}
                    inputValue={value}
                    handleClick={handleClickInput}
                    type={type}
                    isDisabled={disabled}
                    label={label}
                    defaultLabel={label}
                    placeholder={label}
                    handleChangeInput={handleChangeInput}
                    classNameInput={"cr-input-with_button_input"}
                />
                <InputGroup.Append>
                    <div className="cr-input-with-button_wrapper">
                        <Button
                            onClick={handleClickButton}
                            disabled={disabled}
                            className={buttonClassName || "cr-input-with-button"}
                        >
                            <CopyIcon />
                            {buttonText}
                        </Button>
                    </div>
                </InputGroup.Append>
            </InputGroup>
        </div>
    )
}

export {
    InputWithButton,
}
