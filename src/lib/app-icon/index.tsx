// https://icomoon.io/app/

import React from 'react';
import classNames from 'classnames';

export interface AppIconProps {
    name: AppIconName;
    className?: string;
    relativeSize?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, className, relativeSize }) => {
    const style: React.CSSProperties = {};
    if (relativeSize) {
        style.fontSize = `${relativeSize}em`;
    }

    return <span style={style} className={classNames(`icon-${name}`, className)}></span>;
};

const stringLitArray = <L extends string>(arr: L[]) => arr;
export const vedverIcons = stringLitArray([
]);

export type AppIconName = typeof vedverIcons[number];
