import * as React from 'react';
import { areEqualProps } from '../../helpers/areEqualProps';

export interface PercentageButtonProps {
    /**
     * Number that will be displayed as the name on the button
     */
    value: number;
    /**
     * Number that will be used for calculations
     */
    calcValue?: number;
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

export const PercentageButton: React.FunctionComponent<PercentageButtonProps> = React.memo((props: PercentageButtonProps) => {
  return (
    <button className={props.className || 'cr-percentage-button'} onClick={() => props.onClick(props.calcValue || props.value)}>
      {`${props.value * 100}%`}
    </button>
  );
}, areEqualProps);
