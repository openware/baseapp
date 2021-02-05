import * as React from 'react';
import classNames from 'classnames';

import './index.scss';

interface Props {
    errorText?: string;
    className?: string;
}

export const FormError: React.FC<Props> = React.memo(
    ({ errorText, className }): JSX.Element =>
        errorText ? <div className={classNames('redux-form-error', className)}>{errorText}</div> : null
);
