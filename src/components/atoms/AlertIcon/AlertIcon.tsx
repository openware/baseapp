import * as React from 'react';
import { ErrorIcon } from './ErrorIcon';
import { SuccessIcon } from './SuccessIcon';

interface AlertIconProps {
    /**
     * Type of icon
     */
    type: 'success' | 'error';
}

const AlertIcon: React.FunctionComponent<AlertIconProps> = (props: AlertIconProps) => {
    const { type } = props;

    return type === 'success'
        ? <SuccessIcon />
        : <ErrorIcon />;
};

export {
    AlertIcon,
    AlertIconProps,
    ErrorIcon,
    SuccessIcon,
};
