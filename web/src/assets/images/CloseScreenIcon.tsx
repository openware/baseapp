import * as React from 'react';

interface CloseScreenIconProps {
    className?: string;
    onClick?: (e?: any) => void;
}

export const CloseScreenIcon: React.FC<CloseScreenIconProps> = (props: CloseScreenIconProps) => {
    return (
        <svg width="27" height="26" viewBox="0 0 27 26" className={props.className} onClick={props.onClick} fill="none">
            <path d="M0.250001 22.7721L9.99045 13.0104L0.25 3.2487L3.2487 0.25L16.0091 13.0104L3.2487 25.7708L0.250001 22.7721Z" fill="var(--icons)"/>
            <path d="M26.2174 22.7721L16.477 13.0104L26.2174 3.2487L23.2188 0.25L10.4583 13.0104L23.2188 25.7708L26.2174 22.7721Z" fill="var(--icons)"/>
        </svg>
        
    );
};
