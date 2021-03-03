import * as React from 'react';

interface ArrowAllLeftIconProps {
    className?: string;
}

export const ArrowAllLeftIcon: React.FC<ArrowAllLeftIconProps> = (props: ArrowAllLeftIconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z" fill="#3C78E0"/>
        <path d="M13.7187 16.5312L8.94792 11.75L13.7187 6.96875L12.25 5.5L6 11.75L12.25 18L13.7187 16.5312Z" fill="white"/>
        <path d="M18.7187 16.5312L13.9479 11.75L18.7187 6.96875L17.25 5.5L11 11.75L17.25 18L18.7187 16.5312Z" fill="white"/>
    </svg>
);
