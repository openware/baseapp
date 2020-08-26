import * as React from 'react';

interface ChevronIconProps {
    className?: string;
}

export const ChevronIcon: React.FC<ChevronIconProps> = (props: ChevronIconProps) => (
    <svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M1.71875 0.697998L6.5 5.46883L11.2812 0.697998L12.75 2.16675L6.5 8.41675L0.25 2.16675L1.71875 0.697998Z" fill="var(--icons)"/>
    </svg>
);
