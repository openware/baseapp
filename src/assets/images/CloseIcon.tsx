import * as React from 'react';

interface CloseIconProps {
    className?: string;
    onClick?: () => void;
}

export const CloseIcon: React.FC<CloseIconProps> = (props: CloseIconProps) => {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" className={props.className} onClick={props.onClick} fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.58434 6.99901L0.875873 11.7079L2.29003 13.1221L6.99849 8.41328L11.707 13.1221L13.1211 11.7079L8.41265 6.99901L13.704 1.7072L12.2899 0.292927L6.99849 5.58474L1.70712 0.292932L0.292969 1.7072L5.58434 6.99901Z" fill="var(--icons)"/>
        </svg>
    );
};
