import * as React from 'react';

interface ArrowProps {
    className?: string;
}

export const LeftArrowIcon: React.FC<ArrowProps> = (props: ArrowProps) => {
    return (
        <svg
            className={props.className}
            width="26"
            height="43"
            viewBox="0 0 26 43"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M26 37.1581L9.92983 21.0528L26 4.94757L21.0526 0.000209592L9.2024e-07 21.0528L21.0526 42.1055L26 37.1581Z"
                fill="var(--icons)"
            />
        </svg>
    );
};

export const RightArrowIcon: React.FC<ArrowProps> = (props: ArrowProps) => {
    return (
        <svg
            className={props.className}
            width="26"
            height="43"
            viewBox="0 0 26 43"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3.1914e-07 37.1581L16.0702 21.0528L-1.08883e-06 4.94757L4.94737 0.000209592L26 21.0528L4.94737 42.1055L3.1914e-07 37.1581Z"
                fill="var(--icons)"
            />
        </svg>
    );
};
