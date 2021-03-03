import * as React from 'react';

interface SearchFieldCloseIconProps {
    className?: string;
    onClick?: (e?: any) => void;
}

export const SearchFieldCloseIcon: React.FC<SearchFieldCloseIconProps> = (props: SearchFieldCloseIconProps) => {
    return (
        <svg className={props.className} onClick={props.onClick} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 0C11.6475 0 15 3.3525 15 7.5C15 11.6475 11.6475 15 7.5 15C3.3525 15 0 11.6475 0 7.5C0 3.3525 3.3525 0 7.5 0ZM10.1925 3.75L7.5 6.4425L4.8075 3.75L3.75 4.8075L6.4425 7.5L3.75 10.1925L4.8075 11.25L7.5 8.5575L10.1925 11.25L11.25 10.1925L8.5575 7.5L11.25 4.8075L10.1925 3.75Z" fill="var(--icons)"/>
        </svg>
    );
};
