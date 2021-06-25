import React from 'react';
import { Tooltip as BootstrapTooltip } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

interface Props {
    title: string;
    id?: string | number;
    className?: string;
}

const TooltipComponent = React.forwardRef(({ id = 'tooltip', ...rest }: Props, ref?: React.Ref<HTMLDivElement>) => (
    <BootstrapTooltip id={`${id}`} className="tooltip" {...rest} ref={ref}>
        <div className="tooltip__content">
            <FormattedMessage id={rest.title} />
        </div>
    </BootstrapTooltip>
));

export const Tooltip = React.memo(TooltipComponent);
