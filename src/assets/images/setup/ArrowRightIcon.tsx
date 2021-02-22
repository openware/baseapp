import * as React from 'react';

interface ArrowRightIconProps {
    className?: string;
}

export const ArrowRightIcon: React.FC<ArrowRightIconProps> = (props: ArrowRightIconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z" fill="#E85E59"/>
        <path d="M8.00098 16.5313L12.7718 11.75L8.00098 6.96875L9.46973 5.5L15.7197 11.75L9.46973 18L8.00098 16.5313Z" fill="white"/>
    </svg>
);
