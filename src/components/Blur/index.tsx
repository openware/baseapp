import React from 'react';
import classNames from 'classnames';

import { LockIcon } from '../../assets/images/LockIcon';

import './index.scss';

export interface Props {
    className?: string;
    text?: string;
}

export const Blur: React.FC<Props> = ({ text, className }) => {
    return (
        <div className={classNames('pg-blur', className)}>
            <div className="pg-blur__content">
                <LockIcon className="pg-blur__content-icon" />
                <div className="pg-blur__content-text">{text}</div>
            </div>
        </div>
    );
};
