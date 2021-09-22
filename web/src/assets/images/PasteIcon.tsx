import * as React from 'react';

interface PasteIconProps {
    className?: string;
}

export const PasteIcon: React.FC<PasteIconProps> = (props: PasteIconProps) => {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.89997 10.8C9.89997 11.297 9.49703 11.7 8.99997 11.7H2.69999C2.20294 11.7 1.79999 11.297 1.79999 10.8V2.69999C1.79999 2.20294 2.20294 1.79999 2.69999 1.79999H8.99997C9.49703 1.79999 9.89997 2.20294 9.89997 2.69999V10.8ZM0.899997 13.5C0.402943 13.5 0 13.097 0 12.6V0.899997C0 0.402943 0.402942 0 0.899997 0H10.8C11.297 0 11.7 0.402943 11.7 0.899997V12.6C11.7 13.097 11.297 13.5 10.8 13.5H0.899997Z" fill="var(--icons)"/>
            <path d="M16.2952 14.1627V16.2943H15.0635V17.9996H17.1478C17.6185 17.9996 18.0005 17.6176 18.0005 17.1469V14.1627H16.2952Z" fill="var(--icons)"/>
            <path d="M13.5002 16.2H10.8002V18H13.5002V16.2Z" fill="var(--icons)"/>
            <path d="M8.00544 16.2945V14.1627H6.29998V17.1472C6.29998 17.6179 6.682 17.9999 7.15271 17.9999H9.23728V16.2945H8.00544Z" fill="var(--icons)"/>
            <path d="M17.1469 3.59999H13.2627V5.3053H16.2943V7.43694H17.9996V4.45264C17.9996 3.98198 17.6176 3.59999 17.1469 3.59999Z" fill="var(--icons)"/>
            <path d="M18 9.00021H16.2V12.6002H18V9.00021Z" fill="var(--icons)"/>
        </svg>
    );
};
