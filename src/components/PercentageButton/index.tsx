import * as React from 'react';

export interface PercentageButtonProps {
    /**
     * String that will be displayed as the name on the button
     */
    label: string;
    /**
     * Additional class name for styling. By default element receives `cr-percentage-button` class
     * @default empty
     */
    className?: string;
    /**
     * Callback called on button click
     */
    onClick: () => void;
}

export const PercentageButton: React.FunctionComponent<PercentageButtonProps> = (props: PercentageButtonProps) => (
    <button className={props.className || 'cr-percentage-button'} onClick={props.onClick}>{props.label}</button>
);
