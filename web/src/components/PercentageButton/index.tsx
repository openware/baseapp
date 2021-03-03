import React from 'react';

export interface PercentageButtonProps {
    /**
     * Number that will be displayed as the name on the button
     */
    value: number;
    /**
     * Additional class name for styling. By default element receives `cr-percentage-button` class
     * @default empty
     */
    className?: string;
    /**
     * Callback called on button click
     */
    onClick: (index: number) => void;
}

export const PercentageButtonComponent: React.FC<PercentageButtonProps> = ({ className, onClick, value }) => {
    return (
        <button className={className || 'cr-percentage-button'} onClick={() => onClick(value)}>{`${
            value * 100
        }%`}</button>
    );
};

export const PercentageButton = React.memo(PercentageButtonComponent);
