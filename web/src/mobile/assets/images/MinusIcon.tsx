import * as React from 'react';

interface Props {
    className?: string;
}

export const MinusIcon: React.FC<Props> = (props: Props) => (
    <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={props.className}>
        <path d="M19.3046 17H25V19H19.3046H16.6954H11V17H16.6954H19.3046Z" fill="var(--icons)" />
    </svg>
);
