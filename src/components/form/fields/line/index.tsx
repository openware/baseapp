import * as React from 'react';
import classNames from 'classnames';

import './index.scss';
import { InputGroup } from 'react-bootstrap';

export interface FormLineProps {
    label?: React.ReactNode;
    className?: string;
    touched: boolean;
    invalid: boolean;
    error: string;
}

export const FormLine: React.FC<FormLineProps> = ({ className, children, touched, invalid, error }): JSX.Element => {
    const hasError = touched && invalid;
    return (
        <div className={classNames('form-line', className)}>
            <InputGroup className="form-line__group">{children}</InputGroup>
            {error && hasError ? <div className="form-line__error">{error}</div> : null}
        </div>
    );
};
