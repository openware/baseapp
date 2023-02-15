import * as React from 'react';

interface SwipeIconProps {
    className?: string;
    onClick?: (e?: any) => void;
}

export const SwipeIcon: React.FC<SwipeIconProps> = (props: SwipeIconProps) => {
    return (
        <svg
            onClick={props.onClick}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M-8.74228e-07 20C-1.35705e-06 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 -3.91405e-07 20 -8.74228e-07C8.9543 -1.35705e-06 -3.91405e-07 8.9543 -8.74228e-07 20Z"
                fill="#3C78E0"
            />
            <path
                d="M26.2928 17.7071L27.707 16.2929L20.9999 9.58578L20.9999 26L22.9999 26L22.9999 14.4142L26.2928 17.7071Z"
                fill="white"
            />
            <path
                d="M13.7072 22.2829L12.293 23.6971L19.0001 30.4042L19.0001 13.99L17.0001 13.99L17.0001 25.5758L13.7072 22.2829Z"
                fill="white"
            />
        </svg>
    );
};
