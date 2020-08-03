import * as React from 'react';

interface Props {
    className?: string;
}

export const TradeIcon: React.FC<Props> = (props: Props) => {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" className={props.className} fill="none">
            <rect width="28" height="28" fill="none"/>
            <path d="M25 23.6523H2V25H25V23.6523Z" fill="var(--icons)"/>
            <path d="M18.9131 6.51465H14.1738V22.3047H18.9131V6.51465Z" fill="var(--icons)"/>
            <path d="M25 2H20.2607V22.3047H25V2Z" fill="var(--icons)"/>
            <path d="M12.8262 11.0293H8.08691V22.3047H12.8262V11.0293Z" fill="var(--icons)"/>
            <path d="M6.73926 15.5439H2V22.3047H6.73926V15.5439Z" fill="var(--icons)"/>
        </svg>
    );
};
