import { InputGroup, FormControl } from 'react-bootstrap';
import * as React from 'react';

export interface CustomInputProps {
    type: string;
    label: string;
    defaultLabel?: string;
    handleChangeInput: (value: string) => void;
    inputValue: string;
    handleFocusInput?: () => void;
    classNameLabel?: string;
    classNameInput?: string;
    placeholder: string;
    autoFocus?: boolean;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}
type Props = CustomInputProps;

class CustomInput extends React.Component<Props> {
    public render() {
        const {
            label,
            placeholder,
            defaultLabel,
            inputValue,
            classNameLabel,
            classNameInput,
            type,
            autoFocus,
        } = this.props;

        return (
            <React.Fragment>
                <label className={classNameLabel}>
                    {inputValue && (label || defaultLabel)}
                </label>
                <InputGroup size="lg">
                    <FormControl
                        size="lg"
                        type={type}
                        value={inputValue}
                        placeholder={placeholder}
                        className={classNameInput}
                        autoFocus={autoFocus}
                        onFocus={this.props.handleFocusInput}
                        onBlur={this.props.handleFocusInput}
                        onChange={e => this.handleChangeValue(e)}
                    />
                </InputGroup>
            </React.Fragment>
        );
    }

    private handleChangeValue = (e: OnChangeEvent) => {
        this.props.handleChangeInput(e.target.value);
    }
}

export {
    CustomInput,
};
