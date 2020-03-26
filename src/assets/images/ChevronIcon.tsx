import * as React from 'react';

interface ChevronIconProps {
    className?: string;
}

export const ChevronIcon: React.FC<ChevronIconProps> = (props: ChevronIconProps) => (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M1.41 0.590088L6 5.17009L10.59 0.590088L12 2.00009L6 8.00009L0 2.00009L1.41 0.590088Z" fill="var(--icons)"/>
    </svg>
);
