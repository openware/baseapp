import * as React from 'react';

import '@openware/cryptofont';
import cx from 'classnames';

interface CryptoIconProps {
    /**
     * Crypto currency code from
     * https://github.com/atomiclabs/cryptocurrency-icons/blob/master/manifest.json
     * with or without "-alt"
     */
    code: string;

    /**
     * Additional class name for styling. By default element receives `rc-crypto-font` class
     * @default empty
     */
    className?: string;
    /**
     * Anything you wish to attach an icon to
     * @default empty
     */
    children?: React.ReactNode;
}

export const CR_CURRENCY_ICON_CLASS_NAAME = 'cr-crypto-font';

const makeCryptoClass = (code: string) => `${CR_CURRENCY_ICON_CLASS_NAAME}-${code}`;

/**
 * Component to display crypto-currency icon as a standalone (styleable)
 * image or with a text next to it (usually, some float number).
 */
const CryptoIcon: React.FunctionComponent<CryptoIconProps> = props => {
    const { code, className = '', children } = props;
    return (
        <span className={cx('cr-crypto-icon', className)}>
            <span className={makeCryptoClass(code)}> {children}</span>
        </span>
    );
};

export {
    CryptoIcon,
    CryptoIconProps,
};
