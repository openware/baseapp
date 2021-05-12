import * as React from 'react';

interface ConfirmationIconProps {
    className?: string;
    onClick?: (e?: any) => void;
}

export const ConfirmationIcon: React.FC<ConfirmationIconProps> = (props: ConfirmationIconProps) => {
    return (
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M36 0C16.2 0 0 16.2 0 36C0 55.8 16.2 72 36 72C55.8 72 72 55.8 72 36C72 16.2 55.8 0 36 0ZM28.7988 53.9986L10.7988 35.9986L15.8388 30.9586L28.7988 43.9186L56.1588 16.5586L61.1988 21.5986L28.7988 53.9986Z" fill="var(--system-green)"/>
        </svg>
    );
};
