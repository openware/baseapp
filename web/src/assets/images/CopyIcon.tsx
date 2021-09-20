import * as React from 'react';

interface CopyIconProps {
    className?: string;
}

export const CopyIcon: React.FC<CopyIconProps> = (props: CopyIconProps) => {
    return (
        <svg width="19" height="18" viewBox="0 0 19 18" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.4 7.2C10.4 6.70294 9.99706 6.3 9.5 6.3H3.2C2.70294 6.3 2.3 6.70294 2.3 7.2V15.3C2.3 15.7971 2.70294 16.2 3.2 16.2H9.5C9.99706 16.2 10.4 15.7971 10.4 15.3V7.2ZM1.4 4.5C0.902944 4.5 0.5 4.90294 0.5 5.4V17.1C0.5 17.5971 0.902944 18 1.4 18H11.3C11.7971 18 12.2 17.5971 12.2 17.1V5.4C12.2 4.90294 11.7971 4.5 11.3 4.5H1.4Z" fill="var(--icons)"/>
            <path d="M9.5 1.8H15.8C16.2971 1.8 16.7 2.20294 16.7 2.7V11.7C16.7 12.1971 16.2971 12.6 15.8 12.6H13.55V14.4H17.6C18.0971 14.4 18.5 13.9971 18.5 13.5V0.9C18.5 0.402944 18.0971 0 17.6 0H7.7C7.20294 0 6.8 0.402944 6.8 0.9V3.6L8.6 3.6V2.7C8.6 2.20294 9.00294 1.8 9.5 1.8Z" fill="var(--icons)"/>
        </svg>
        
    );
};
