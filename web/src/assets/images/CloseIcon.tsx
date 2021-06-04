import * as React from 'react';

interface CloseIconProps {
    className?: string;
    onClick?: (e?: any) => void;
}

export const CloseIcon: React.FC<CloseIconProps> = (props: CloseIconProps) => {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" className={props.className} onClick={props.onClick} fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.58434 6.99901L0.875873 11.7079L2.29003 13.1221L6.99849 8.41328L11.707 13.1221L13.1211 11.7079L8.41265 6.99901L13.704 1.7072L12.2899 0.292927L6.99849 5.58474L1.70712 0.292932L0.292969 1.7072L5.58434 6.99901Z" fill="var(--icons)"/>
        </svg>
    );
};

export const HugeCloseIcon: React.FC<CloseIconProps> = (props: CloseIconProps) => {
    return (
        <svg width="26" height="25" viewBox="0 0 26 25" className={props.className} onClick={props.onClick} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.35978e-07 22.0625L9.54167 12.5L0 2.9375L2.9375 0L15.4375 12.5L2.9375 25L8.35978e-07 22.0625Z" fill="var(--icons)"/>
            <path d="M25.4375 22.0625L15.8958 12.5L25.4375 2.9375L22.5 0L10 12.5L22.5 25L25.4375 22.0625Z" fill="var(--icons)"/>
        </svg>
    );
};
