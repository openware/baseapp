import * as React from 'react';

interface Props {
    className?: string;
}

export const PlusIcon: React.FC<Props> = (props: Props) => (
    <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={props.className}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17 11V16.6954V17H16.6954H11V19H16.6954H17V19.3046L17 25H19V19.3046V19H19.3046H25V17H19.3046H19V16.6954V11H17Z"
            fill="var(--icons)"
        />
    </svg>
);
