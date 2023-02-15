import * as React from 'react';

interface CloseSetupIconProps {
    className?: string;
}

export const CloseSetupIcon: React.FC<CloseSetupIconProps> = (props: CloseSetupIconProps) => (
    <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.35978e-07 22.0625L9.54167 12.5L0 2.9375L2.9375 0L15.4375 12.5L2.9375 25L8.35978e-07 22.0625Z"
            fill="#5B6488"
        />
        <path d="M25.4375 22.0625L15.8958 12.5L25.4375 2.9375L22.5 0L10 12.5L22.5 25L25.4375 22.0625Z" fill="#5B6488" />
    </svg>
);
