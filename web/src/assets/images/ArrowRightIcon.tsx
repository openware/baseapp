import * as React from 'react';

interface ArrowRightIconProps {
    className?: string;
}

export const ArrowRightIcon: React.FC<ArrowRightIconProps> = (props: ArrowRightIconProps) => (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M5.58984 1.41L9.16984 5L5.58984 8.59L6.99984 10L11.9998 5L6.99984 6.1633e-08L5.58984 1.41Z" fill="#3C78E0"/>
        <rect x="6" y="4" width="2" height="6" transform="rotate(90 6 4)" fill="#3C78E0"/>
    </svg>
);
