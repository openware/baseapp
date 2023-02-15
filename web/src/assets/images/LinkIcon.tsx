import * as React from 'react';

interface LinkIconProps {
    className?: string;
}

export const LinkIcon: React.FC<LinkIconProps> = (props: LinkIconProps) => (
    <svg
        className={props.className}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M11.4448 7.59029e-06L6.7348 0.0311148C6.43068 0.0326692 6.18545 0.281139 6.18739 0.584819C6.18934 0.888499 6.4377 1.13307 6.74261 1.13073L10.1086 1.10857L5.569 5.63577C5.35338 5.8508 5.35338 6.1984 5.569 6.41342C5.78461 6.62845 6.13319 6.62847 6.3488 6.41344L10.8884 1.88624L10.8662 5.24303C10.8639 5.5471 11.1095 5.79439 11.4136 5.79674C11.5672 5.79752 11.7068 5.73608 11.8074 5.63575C11.9064 5.53698 11.968 5.40091 11.9688 5.2508L12 0.553676C12.0008 0.4067 11.9431 0.265156 11.8386 0.160955C11.7341 0.05679 11.593 -0.000760489 11.4448 7.59029e-06Z"
            fill="var(--icons)"
        />
        <path
            d="M1.67612 10.9002C1.37174 10.9002 1.12473 10.6539 1.12473 10.3504L1.10281 1.75909C1.10281 1.45555 1.34985 1.20921 1.6542 1.20921H3.29746C3.60238 1.20921 3.84885 0.963416 3.84885 0.659328C3.84885 0.355239 3.60238 0.109393 3.29746 0.109393H1.6542C0.742181 0.109393 0 0.84957 0 1.75909L0.0219187 10.3503C0.0219187 11.2598 0.764099 12 1.67612 12L10.3148 11.9996C11.2268 11.9996 11.969 11.2595 11.969 10.35V8.57736C11.969 8.27328 11.7225 8.02748 11.4176 8.02748C11.1127 8.02748 10.8662 8.27328 10.8662 8.57736V10.35C10.8662 10.6535 10.6192 10.8999 10.3148 10.8999L1.67612 10.9002Z"
            fill="var(--icons)"
        />
    </svg>
);
