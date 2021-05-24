import * as React from 'react';

interface ArrowRightProps {
    className?: string;
}

export const ArrowRight: React.FC<ArrowRightProps> = (props: ArrowRightProps) => (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M8.50073 16.5313L13.2716 11.75L8.50073 6.96875L9.96948 5.5L16.2195 11.75L9.96948 18L8.50073 16.5313Z" fill="var(--icons)"/>
    </svg>
);
