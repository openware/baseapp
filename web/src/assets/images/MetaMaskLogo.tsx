import * as React from 'react';

interface Props {
    className?: string;
    onClick?: () => void;
}

export const MetaMaskLogo: React.FC<Props> = (props: Props) => {
    return (
        <div className={props.className} onClick={props.onClick}>
            <svg width="35" height="33" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32.9583 1L19.8242 10.7183L22.2666 4.99099L32.9583 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.66309 1L15.6802 10.809L13.3548 4.99098L2.66309 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28.229 23.5332L24.7344 28.8718L32.2173 30.9321L34.3609 23.6499L28.229 23.5332Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.27246 23.6499L3.403 30.9321L10.873 28.8718L7.39129 23.5332L1.27246 23.6499Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.4702 14.5149L8.3916 17.6507L15.7966 17.9876L15.5498 10.0186L10.4702 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M25.1505 14.5148L19.9931 9.92773L19.8242 17.9875L27.2291 17.6506L25.1505 14.5148Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.873 28.8722L15.3549 26.7083L11.4966 23.7021L10.873 28.8722Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.2656 26.7083L24.7345 28.8722L24.1239 23.7021L20.2656 26.7083Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24.7345 28.8719L20.2656 26.708L20.6293 29.6105L20.5903 30.8415L24.7345 28.8719Z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.873 28.8719L15.0302 30.8415L15.0042 29.6105L15.3549 26.708L10.873 28.8719Z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.1081 21.7837L11.3926 20.6953L14.0168 19.4902L15.1081 21.7837Z" fill="#233447" stroke="#233447" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.5127 21.7837L21.604 19.4902L24.2412 20.6953L20.5127 21.7837Z" fill="#233447" stroke="#233447" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.8732 28.8718L11.5228 23.5332L7.3916 23.6499L10.8732 28.8718Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24.0981 23.5332L24.7347 28.8718L28.2293 23.6499L24.0981 23.5332Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M27.2291 17.6504L19.8242 17.9873L20.5127 21.784L21.604 19.4904L24.2412 20.6955L27.2291 17.6504Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.3926 20.6955L14.0168 19.4904L15.1081 21.784L15.7966 17.9873L8.3916 17.6504L11.3926 20.6955Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.39209 17.6504L11.497 23.7017L11.393 20.6955L8.39209 17.6504Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24.2409 20.6955L24.124 23.7017L27.2289 17.6504L24.2409 20.6955Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.797 17.9873L15.1084 21.784L15.9788 26.2673L16.1737 20.3586L15.797 17.9873Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.8242 17.9873L19.4604 20.3457L19.6423 26.2673L20.5127 21.784L19.8242 17.9873Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.513 21.7838L19.6426 26.2671L20.2662 26.7077L24.1246 23.7015L24.2415 20.6953L20.513 21.7838Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.3926 20.6953L11.4966 23.7015L15.3549 26.7077L15.9785 26.2671L15.1081 21.7838L11.3926 20.6953Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.5904 30.8417L20.6293 29.6107L20.2916 29.3256H15.329L15.0042 29.6107L15.0302 30.8417L10.873 28.8721L12.328 30.0642L15.277 32.0986H20.3305L23.2925 30.0642L24.7345 28.8721L20.5904 30.8417Z" fill="#C0AC9D" stroke="#C0AC9D" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.2658 26.7081L19.6422 26.2676H15.9787L15.3552 26.7081L15.0044 29.6107L15.3292 29.3256H20.2918L20.6296 29.6107L20.2658 26.7081Z" fill="#161616" stroke="#161616" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M33.5165 11.3532L34.6208 5.98873L32.9579 1L20.2656 10.3944L25.1502 14.5149L32.0485 16.5234L33.5685 14.7482L32.906 14.2687L33.9582 13.3099L33.1528 12.6879L34.2051 11.8845L33.5165 11.3532Z" fill="#763E1A" stroke="#763E1A" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 5.98873L2.11724 11.3532L1.40273 11.8845L2.468 12.6879L1.66255 13.3099L2.71483 14.2687L2.05228 14.7482L3.57225 16.5234L10.4706 14.5149L15.3552 10.3944L2.66287 1L1 5.98873Z" fill="#763E1A" stroke="#763E1A" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M32.0486 16.523L25.1503 14.5146L27.2289 17.6504L24.124 23.7016L28.2292 23.6498H34.361L32.0486 16.523Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.4702 14.5146L3.57189 16.523L1.27246 23.6498H7.39129L11.4965 23.7016L8.39161 17.6504L10.4702 14.5146Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.8241 17.9878L20.2658 10.3945L22.2664 4.99121H13.3545L15.3551 10.3945L15.7968 17.9878L15.9657 20.372L15.9787 26.2678H19.6422L19.6552 20.372L19.8241 17.9878Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
};
