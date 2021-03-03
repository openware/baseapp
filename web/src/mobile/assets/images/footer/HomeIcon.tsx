import * as React from 'react';

interface Props {
    className?: string;
}

export const HomeIcon: React.FC<Props> = (props: Props) => {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" className={props.className} fill="none">
            <rect width="28" height="28" fill="none"/>
            <path d="M11.3529 25V17.2353H16.5294V25H23V14.6471H26.8824L13.9412 3L1 14.6471H4.88235V25H11.3529Z" fill="var(--icons)"/>
        </svg>
    );
};
