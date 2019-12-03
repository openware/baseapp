import '@openware/cryptofont';

import classnames from 'classnames';
import * as React from 'react';

export type ButtonClickHandler = (label?: string, e?: React.FormEvent<HTMLInputElement>) => void;

interface ButtonProps {
    /**
     * String that will be displayed as the name on the button
     */
    label: string;
    /**
     * Button click callback
     */
    onClick: ButtonClickHandler;
    /**
     * Additional class name for styling. By default element receives `cr-button` class
     * @default empty
     */
    className?: string;
    /**
     * Remove button margin if true
     */
    noMargin?: boolean;
    /**
     * If true, component will be disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * Value for defining type of button
     * @default "button"
     */
    type?: string;
}

/**
 * Сr-Button overrides default button.
 */
const Button: React.FunctionComponent<ButtonProps> = props => {
    const { disabled, label, noMargin, className, onClick, type = 'button' } = props;
    const cx = classnames('cr-button', {
        'cr-button--disabled': disabled,
        'cr-button--no-margin': noMargin,
    }, className);
    const value = label.toLocaleUpperCase();
    const handler = !disabled ? (e: React.FormEvent<HTMLInputElement>) => onClick(label, e) : undefined;

    return (
        <input
            readOnly={true}
            type={type}
            className={cx}
            disabled={disabled}
            value={value}
            onClick={handler}
        />
    );
};

export {
    Button,
    ButtonProps,
};
