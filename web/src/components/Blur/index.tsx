import * as React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LockIcon } from '../../assets/images/LockIcon';

export interface Props {
    className?: string;
    text?: string;
    linkText?: string;
    onClick?: () => void;
}

export const Blur: React.FC<Props> = props => {
    const { text, onClick, linkText, className } = props;

    return (
        <div className={`pg-blur ${className ? className : ''}`}>
            <div className="pg-blur__content">
                <LockIcon className="pg-blur__content__icon" />
                <span className="pg-blur__content__text">{text}</span>
                {onClick ? (
                    <Button onClick={onClick} className="pg-blur__content__button">
                        <span>{linkText}</span>
                        <div className="pg-blur__content__arrow" />
                    </Button>
                ) : null}
            </div>
        </div>
    );
};
