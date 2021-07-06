import * as React from 'react';
import { Link } from 'react-router-dom';
import { LockIcon } from '../../assets/images/LockIcon';

export interface Props {
    className?: string;
    text?: string;
    link?: string;
    linkText?: string;
}

export const Blur: React.FC<Props> = props => {
    const { text, link, linkText, className } = props;

    return (
        <div className={`pg-blur ${className ? className : ''}`}>
            <div className="pg-blur__content">
                <LockIcon className="pg-blur__content__icon" />
                <span className="pg-blur__content__text">{text}</span>
                {link ? (
                    <Link to={link} className="pg-blur__content__button">
                        <span>{linkText}</span>
                        <div className="pg-blur__content__arrow" />
                    </Link>
                ) : null}
            </div>
        </div>
    );
};
