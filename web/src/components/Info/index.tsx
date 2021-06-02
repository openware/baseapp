import React from 'react';
import { InfoIcon } from 'src/assets/images/InfoIcon';

interface Props {
    text: string;
    className?: string;
    variant: string;
}

const InfoComponent = ({ text, variant, className }: Props) => (
    <div className={`info info-${variant} ${className}`}>
        <InfoIcon className="info-icon" /> <span>{text}</span>
    </div>
);

export const Info = React.memo(InfoComponent);
