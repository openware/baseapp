import classnames from 'classnames';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { convertToString } from '../../helpers';
import { BeneficiariesBlockchainItemProps } from './BeneficiariesCrypto/BeneficiariesBlockchainItem';
import { selectUserIsMember } from '../../modules';

type DropdownElem = number | string | React.ReactNode;

export interface DropdownBeneficiaryProps {
    /**
     * List of options
     */
    list: DropdownElem[] | any;
    /**
     * Selection callback function
     * @default empty
     */
    onSelect?: (index: number) => void;
    /**
     *  By default class name 'cr-dropwdown'
     *  This property gives an additional class name
     *  @default empty
     */
    className?: string,
    /**
     * Value for placeholder of Dropdown components
     * @default empty
     */
    placeholder?: string;
    /**
     * Value for disabling contentEditable property
     * @default false
     */
    disableContentEditable?: boolean;
    /**
     * Value for clear selected item
     * @default false
     */
    clear?: boolean;
    selectedValue?: BeneficiariesBlockchainItemProps;
}

const defaultSelected = {
    blockchainKey: '',
    protocol: '',
    name: '',
    id: '',
    fee: '',
    minWithdraw: '',
}

/**
 *  Cryptobase Dropdown that overrides default dropdown with list of options.
 */

export const DropdownBeneficiary = (props: DropdownBeneficiaryProps) => {
    const isMember: boolean = useSelector(selectUserIsMember);
    const [selected, setSelected] = useState<BeneficiariesBlockchainItemProps | undefined>(defaultSelected);

    const { list, className, placeholder, clear, onSelect } = props;
    const defaultPlaceholder = list[0];

    const cx = useMemo(() => classnames('cr-dropdown', className, {
        'cr-dropdown--default': defaultSelected.protocol === placeholder,
    }), [selected, placeholder, className]);

    useEffect(() => {
        if (clear !== false) {
            setSelected(placeholder || convertToString(defaultPlaceholder));
        }
    }, [placeholder, defaultPlaceholder, clear]);

    useEffect(() => {
        if (typeof props.selectedValue !== 'undefined' && props.selectedValue.id !== '') {
            setSelected(props.selectedValue);
        } else if (props.selectedValue.id === '') {
            setSelected(placeholder || convertToString(defaultPlaceholder));
        }
    }, [props.selectedValue]);

    const handleSelect = useCallback((elem: DropdownElem | any, index: number) => {
        if (elem.props?.disabled) {
            return;
        }

        onSelect && onSelect(index);
        setSelected(elem.props);
    }, []);

    const renderElem = useCallback((elem: DropdownElem, index: number) => {
        // @ts-ignore
        if (elem?.props?.isHidden && isMember) {
            return null;
        }

        return  (
            <Dropdown.Item
                key={index}
                onSelect={() => handleSelect(elem, index)}
            >
                <div>{elem}</div>
            </Dropdown.Item>
        );
    }, []);

    const renderSelectedItem = useMemo(() => {
        if (selected.protocol && selected.name && selected.id) {
            return <div><span>{selected.protocol.toUpperCase()}</span> {selected.name}({selected.id.toUpperCase()})</div>;
        }

        return placeholder;
    }, [selected]);

    return (
        <div className={cx}>
            <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {renderSelectedItem}
                    <ChevronIcon className="cr-dropdown__arrow" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {list.map(renderElem)}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};
