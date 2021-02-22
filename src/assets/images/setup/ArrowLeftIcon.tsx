import * as React from 'react';

interface ArrowLeftIconProps {
    className?: string;
}

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = (props: ArrowLeftIconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z" fill="#3C78E0"/>
        <path d="M15.7187 16.5313L10.9479 11.75L15.7188 6.96875L14.25 5.5L8 11.75L14.25 18L15.7187 16.5313Z" fill="white"/>
    </svg>
);
