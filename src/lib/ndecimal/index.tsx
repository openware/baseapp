import React from 'react';
import { format } from 'react-string-format';
import numeral from 'numeral';

interface Props {
    /**
     * Number of digits after dot
     */
    fixed?: number;
    /**
     * Show number groups separator. Default: false
     */
    showGroup?: boolean;
    /**
     * Number group separator. Default: ","
     */
    groupSeparator?: string;
    /**
     * Float separator. Default: "."
     */
    floatSeparator?: string;
    /**
     * Number to format
     */
    children?: string | number;
    /**
     * Content placed at the beginning.
     */
    prefix?: React.ReactElement | string;
    /**
     * Content placed at the end.
     */
    ending?: React.ReactElement | string;
}

const CurrentComponent: React.FC<Props> = ({
    children,
    showGroup,
    fixed,
    groupSeparator = ',',
    floatSeparator = '.',
    prefix,
    ending,
}) => {
    let pattern = showGroup ? '0,0' : '0';
    if (fixed) {
        pattern += '.';
        for (let i = 0; i < fixed; i++) {
            pattern += '0';
        }
    }

    let formatedValue = numeral(children).format(pattern);

    if (groupSeparator !== ',') {
        formatedValue = formatedValue.replace(',', groupSeparator);
    }

    if (floatSeparator !== '.') {
        formatedValue = formatedValue.replace('.', floatSeparator);
    }

    if (prefix || ending) {
        if (prefix && ending) {
            return <>{format('{0} {1} {2}', prefix, formatedValue, ending)}</>;
        } else {
            if (prefix) {
                return <>{format('{0} {1}', prefix, formatedValue)}</>;
            } else {
                return <>{format('{0} {1}', formatedValue, ending)}</>;
            }
        }
    } else {
        return <>{formatedValue}</>;
    }
};

export const NDecimal = React.memo(CurrentComponent);
