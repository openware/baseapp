


import * as React from 'react';

interface Props {
    className?: string;
}

export const RadioButton: React.FC<Props> = (props: Props) => (
    <svg className={props.className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle opacity="0.12" cx="10" cy="10" r="9" fill="var(--primary-cta-color)"/>
        <circle cx="10" cy="10" r="4" fill="var(--primary-cta-color)"/>
    </svg>
);
