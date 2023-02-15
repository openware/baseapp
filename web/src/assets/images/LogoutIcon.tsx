import * as React from 'react';

interface LogoutIconProps {
    className?: string;
    onClick?: () => void;
    fillColor: string;
}

export const LogoutIcon: React.FC<LogoutIconProps> = (props: LogoutIconProps) => {
    return (
        <div className={props.className} onClick={props.onClick}>
            <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.3">
                    <path d="M11.6364 4.33333V1H1V16H11.6364V11.8333" stroke={props.fillColor} />
                    <path
                        d="M8.36365 6.83329H14.0909V4.16992L19 8.49996L14.0909 12.83V10.1666H8.36365"
                        stroke={props.fillColor}
                    />
                </g>
            </svg>
        </div>
    );
};
