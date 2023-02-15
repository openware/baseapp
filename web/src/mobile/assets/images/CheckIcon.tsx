import * as React from 'react';

interface Props {
    className?: string;
}

export const CheckIcon: React.FC<Props> = (props: Props) => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={props.className}>
        <path d="M1 6.24419L5.54301 12L14 1" stroke="var(--primary-cta-color)" strokeWidth="2.5" />
    </svg>
);
