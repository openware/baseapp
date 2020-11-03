import * as React from 'react';

import { LockIcon } from '../../assets/images/LockIcon';

export interface Props {
    className?: string;
    text?: string;
}

export const Blur: React.FC<Props> = (props) => {
    const { text, className } = props;

    return (
        <div className={`pg-blur ${className ? className : ''}`}>
            <div className="pg-blur__content">
                <LockIcon className="pg-blur__content__icon" />
                <span className="pg-blur__content__text">{text}</span>
            </div>
        </div>
    );
};
