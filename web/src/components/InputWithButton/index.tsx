import '@openware/cryptofont';
import classnames from 'classnames';
import * as React from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { CustomInput } from '../';
import { MouseEventHandler } from "react";

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
}: {
  value: any;
  className: string;
  fieldId?: string | number;
  disabled?: boolean;
  buttonText?: string;
  label?: string;
  type?: string;
  readOnly?: boolean;
  handleClickInput?: MouseEventHandler;
  handleClickButton?: MouseEventHandler;
  handleChangeInput?: (value: string) => void;
}) => {
  const cx = classnames('cr-input-with-button-field', className);

  return (
    <fieldset>
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
                className="cr-input-with-button"
              >
                {buttonText}
              </Button>
            </div>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </fieldset>
  )
}

export {
  InputWithButton,
}
