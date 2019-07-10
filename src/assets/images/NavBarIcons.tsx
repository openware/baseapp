import * as React from 'react';

export const CloseAvatar = ({fillColor}) => {
    return (
        <svg width="40" height="40" viewBox="1 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.7" cx="20.9897" cy="20" r="19.5" stroke={fillColor}/>
            <circle opacity="0.7" cx="20.9898" cy="15" r="6.16667" fill={fillColor} stroke={fillColor}/>
            <path opacity="0.7" d="M33.823 30C33.823 30.5154 33.5382 31.1626 32.9025 31.8733C32.275 32.5751 31.3481 33.2893 30.1776 33.9303C27.838 35.2117 24.5872 36.1667 20.9897 36.1667C17.3922 36.1667 14.1414 35.2117 11.8018 33.9303C10.6313 33.2893 9.70443 32.5751 9.07687 31.8733C8.44123 31.1626 8.15637 30.5154 8.15637 30C8.15637 29.504 8.42265 28.9716 9.03587 28.4279C9.64852 27.8847 10.5635 27.3727 11.7372 26.9326C14.0807 26.0538 17.3519 25.5 20.9897 25.5C24.6275 25.5 27.8987 26.0538 30.2422 26.9326C31.4159 27.3727 32.3309 27.8847 32.9435 28.4279C33.5568 28.9716 33.823 29.504 33.823 30Z" fill={fillColor} stroke={fillColor}/>
        </svg>
    );
};

export const OpenAvatar = ({fillColor}) => {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19.5" stroke={fillColor}/>
            <circle cx="20" cy="15" r="6.66667" fill={fillColor}/>
            <path d="M33.3333 30C33.3333 32.7614 27.3638 36.6667 20 36.6667C12.6362 36.6667 6.66663 32.7614 6.66663 30C6.66663 27.2386 12.6362 25 20 25C27.3638 25 33.3333 27.2386 33.3333 30Z" fill={fillColor}/>
        </svg>
    );
};

export const CloseIcon = ({fillColor}) => {
    return (
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.655151 1.34485L4.99998 5.34485L9.34481 1.34485" stroke={fillColor}/>
        </svg>
    );
};

export const OpenIcon = ({fillColor}) => {
    return (
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.34479 5.34485L4.99996 1.34485L0.655132 5.34485" stroke={fillColor}/>
        </svg>
    );
};
