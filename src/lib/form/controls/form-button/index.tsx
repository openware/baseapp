import React from 'react';
import classNames from 'classnames';

import './index.scss';

interface Props {
    children?: React.ReactNode | React.ReactNode[];
    className?: string;
}

export const FormButton: React.FC<Props> = ({ children, className }) => {
    return children ? (
        <div className={classNames('form-button', className)}>
            {typeof children === 'object' ? <div>{children}</div> : null}
            {Array.isArray(children) ? children.map((x, i) => <div key={i}>{children}</div>) : null}
        </div>
    ) : null;
};
