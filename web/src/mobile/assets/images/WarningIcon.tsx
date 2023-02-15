import * as React from 'react';

interface WarningIconProps {
    className?: string;
}

export const WarningIcon: React.FC<WarningIconProps> = (props: WarningIconProps) => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={props.className}>
        <path
            d="M14 4L3 23H25L14 4ZM14 8L21.53 21H6.47L14 8ZM13 12V16H15V12H13ZM13 18V20H15V18"
            fill="var(--system-yellow)"
        />
    </svg>
);
