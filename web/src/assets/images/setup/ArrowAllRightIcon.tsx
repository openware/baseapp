import * as React from 'react';

interface ArrowAllRightIconProps {
    className?: string;
}

export const ArrowAllRightIcon: React.FC<ArrowAllRightIconProps> = (props: ArrowAllRightIconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z"
            fill="#E85E59"
        />
        <path d="M6 16.5312L10.7708 11.75L6 6.96875L7.46875 5.5L13.7187 11.75L7.46875 18L6 16.5312Z" fill="white" />
        <path d="M11 16.5312L15.7708 11.75L11 6.96875L12.4687 5.5L18.7187 11.75L12.4688 18L11 16.5312Z" fill="white" />
    </svg>
);
