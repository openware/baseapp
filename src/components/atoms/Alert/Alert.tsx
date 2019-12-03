import cx from 'classnames';
import * as React from 'react';
import { AlertIcon } from '../AlertIcon/AlertIcon';

interface AlertProps {
    /**
     * Additional message
     */
    description: string;
    /**
     * Alert message
     */
    title: string;
    /**
     * Type of message
     */
    type: 'success' | 'error';
}

const Alert: React.FunctionComponent<AlertProps> = props => {
    const { description, type, title } = props;
    const className = cx('cr-alert', {
        'cr-alert--error': type === 'error',
        'cr-alert--success': type === 'success',
    });

    return (
        <div className={className}>
            <AlertIcon type={type} />
            <div className="cr-alert-text">
                <p className="cr-alert__title">{title}</p>
                <p className="cr-alert__description">{description}</p>
            </div>
        </div>
    );
};

export {
    Alert,
    AlertProps,
};
