import classNames from 'classnames';
import React from 'react';

import './index.pcss';

export interface CryptoIconProps {
    code: string;
    imageUrl?: string;
    className?: string;
    children?: React.ReactNode;
}

/* eslint-disable @typescript-eslint/no-var-requires */
const findIcon = (code: string): string => {
    try {
        return require(`cryptocurrency-icons/svg/color/${code.toLowerCase()}.svg`).default as string;
    } catch (err) {
        return require('cryptocurrency-icons/svg/color/generic.svg').default as string;
    }
};
/* eslint-enable @typescript-eslint/no-var-requires */

export const CryptoIcon: React.FC<CryptoIconProps> = ({ code, className, imageUrl }) => {
    return (
        <img className={classNames('n-crypto-icon', className)} src={imageUrl || findIcon(code)} alt="crypto-icon" />
    );
};
