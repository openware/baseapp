import * as React from 'react';

interface ChangeIconProps {
    className?: string;
}

export const ChangeIcon: React.FC<ChangeIconProps> = (props: ChangeIconProps) => (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M8.7539 19.0312L5.03516 15.3044H13.0352V13.1956H5.03516L8.7539 9.46875L7.28516 8L1.03516 14.25L7.28515 20.5L8.7539 19.0312Z" fill="var(--icons)"/>
        <path d="M14.3164 5.46875L18.0352 9.19562L10.0352 9.19562L10.0352 11.3044L18.0352 11.3044L14.3164 15.0312L15.7852 16.5L22.0352 10.25L15.7852 4L14.3164 5.46875Z" fill="var(--icons)"/>
    </svg>
);
