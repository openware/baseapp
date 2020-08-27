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

    if (name === 'trade') {
        name = 'bar_chart';
    }

    return <span style={style} className={classNames(`icon-${name}`, className)}></span>;
};

const stringLitArray = <L extends string>(arr: L[]) => arr;
export const vedverIcons = stringLitArray([
    'arrow-back-ios',
    'arrow-down',
    'arrow-forward-ios',
    'arrow-up',
    'bar_chart',
    'camera',
    'cross',
    'edit',
    'expand',
    'expand-less',
    'expand-more',
    'menu',
    'moon',
    'more-horizontal',
    'more-vertical',
    'person',
    'person_add',
    'search',
    'settings',
    'sort',
    'sort-asc',
    'sort-desc',
    'star',
    'star-outline',
    'sun',
    'wallet',
    'bell',
    // custom
    'trade',
]);

export type AppIconName = typeof vedverIcons[number];
