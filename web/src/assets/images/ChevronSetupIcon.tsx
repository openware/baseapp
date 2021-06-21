import * as React from 'react';

interface ChevronSetupIconProps {
    className?: string;
}

export const ChevronSetupIcon: React.FC<ChevronSetupIconProps> = (props: ChevronSetupIconProps) => (
    <svg width="19" height="35" viewBox="0 0 19 35" fill="none" className={props.className} xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.48" d="M2 2L17.5 17.5L2 33" stroke="#212121" strokeWidth="3" strokeLinejoin="round"/>
    </svg>
);
