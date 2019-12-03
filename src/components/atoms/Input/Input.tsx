import classnames from 'classnames';
import * as React from 'react';
import { OnChangeEvent } from '../../types/index';

interface InputProps {
    /**
     * Function for monitoring changes of input value
     * @default ''
     */
    onChangeValue: (text: string) => void;
    /**
     * Function for handling input focus
     */
    onFocus?: () => void;
    /**
     * Function for handling input blur
     */
    onBlur?: () => void;
    /**
     * The text string to use for the type of the input component.
     */
    value: string | number;
    /**
     * Additional class name for styling. By default element receives `cr-input` class
     * @default empty
     */
    className?: string;
    /**
     * The string to use for as a placeholder for the input
     * @default empty
     */
    placeholder?: string;
    /**
     * Sets type of the input
     * @default 'text'
     */
    type?: string;
    /**
     * Input field name
     */
    name?: string;
    /**
     * Set autofocus on field
     */
    autoFocus?: boolean;
    /**
     * Function for handling 'Enter' key
     */
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Cryptobase Input that overrides default input
 */
class Input extends React.PureComponent<InputProps> {

    private inputElem = React.createRef<HTMLInputElement>();
    public render() {
        const {
            placeholder,
            type,
            className,
            value,
            name,
            autoFocus,
            onKeyPress,
        } = this.props;

        const cx = classnames('cr-input', {
            'cr-input__number': type === 'number',
        }, className);

        const autoComplete = type === 'password' ? 'current-password' : '';
        return (
            <div className={cx}>
                <input
                    min="0"
                    name={name}
                    autoComplete={autoComplete}
                    type={type}
                    ref={this.inputElem}
                    placeholder={placeholder}
                    value={value}
                    onChange={this.handleChange}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    autoFocus={autoFocus}
                    onKeyPress={onKeyPress}
                />
            </div>
        );
    }

    private handleChange = (e: OnChangeEvent) => {
        this.props.onChangeValue(e.target.value);
    };
}

export {
    Input,
    InputProps,
};
