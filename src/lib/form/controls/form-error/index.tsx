import React from 'react';
import classNames from 'classnames';

import './index.scss';

interface Props {
    children?: string;
    className?: string;
}

export const FormError: React.FC<Props> = ({ children, className }) => {
    return children ? <div className={classNames('form-error', className)}>{children}</div> : null;
};
