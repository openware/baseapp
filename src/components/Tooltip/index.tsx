import * as React from 'react';
import { Tooltip as BootstrapTooltip } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

interface Props {
    title: string;
    id?: string | number;
    className?: string;
}

export const Tooltip = (props: Props) => (
    <BootstrapTooltip id="tooltip" className="tooltip" {...props}>
        <div className="tooltip__content">
            <FormattedMessage id={props.title} />
        </div>
    </BootstrapTooltip>
);
