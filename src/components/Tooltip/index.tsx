import * as React from 'react';
import { Tooltip as BootstrapTooltip } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

interface Props {
    title: string;
    id?: string | number;
    className?: string;
}

export const Tooltip = ({ id = 'tooltip', ...rest }: Props) => (
    <BootstrapTooltip id={`${id}`} className="tooltip" {...rest}>
        <div className="tooltip__content">
            <FormattedMessage id={rest.title} />
        </div>
    </BootstrapTooltip>
);
