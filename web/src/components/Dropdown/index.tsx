import classnames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { convertToString } from '../../helpers';

type DropdownElem = number | string | React.ReactNode;

export interface DropdownComponentProps {
    /**
     * List of options
     */
    list: DropdownElem[];
    /**
     * List of options
     */
    iconsList?: React.ReactNode[];
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
    className?: string;
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
    selectedValue?: string;
}

/**
 *  Cryptobase Dropdown that overrides default dropdown with list of options.
 */

export const DropdownComponent = (props: DropdownComponentProps) => {
    const [selected, setSelected] = useState<string | undefined>('');
    const [selectedIcon, setSelectedIcon] = useState<React.ReactNode | undefined>('');

    const { list, className, placeholder, clear, iconsList, onSelect } = props;
    const defaultPlaceholder = list[0];

    const cx = useMemo(
        () =>
            classnames('cr-dropdown', className, {
                'cr-dropdown--default': selected === placeholder,
            }),
        [selected, placeholder, className],
    );

    useEffect(() => {
        if (clear !== false) {
            setSelected(placeholder || convertToString(defaultPlaceholder));
        }
    }, [placeholder, defaultPlaceholder, clear]);

    useEffect(() => {
        if (typeof props.selectedValue !== 'undefined' && props.selectedValue !== '') {
            setSelected(props.selectedValue);
            iconsList && setSelectedIcon(iconsList[list.indexOf(props.selectedValue)]);
        } else if (props.selectedValue === '') {
            setSelected(placeholder || convertToString(defaultPlaceholder));
            iconsList && setSelectedIcon(iconsList[list.indexOf(props.selectedValue)]);
        }
    }, [iconsList, props.selectedValue]);

    const handleSelect = useCallback(
        (elem: DropdownElem, index: number) => {
            onSelect && onSelect(index);
            setSelected(convertToString(elem));
            iconsList && setSelectedIcon(iconsList[index]);
        },
        [iconsList, onSelect],
    );

    const renderElem = useCallback(
        (elem: DropdownElem, index: number) => {
            return (
                <Dropdown.Item key={index} onSelect={() => handleSelect(elem, index)}>
                    {iconsList ? (
                        <div>
                            {iconsList[index]}
                            {elem}
                        </div>
                    ) : (
                        elem
                    )}
                </Dropdown.Item>
            );
        },
        [iconsList, handleSelect],
    );

    useEffect(() => {
        if (clear !== false) {
            setSelected(placeholder || convertToString(defaultPlaceholder));
            iconsList && setSelectedIcon(iconsList[list.indexOf(placeholder)]);
        }
    }, [placeholder, iconsList, defaultPlaceholder, clear]);

    const renderSelectedItem = useMemo(() => {
        if (selected) {
            return iconsList ? (
                <div>
                    {selectedIcon}
                    {selected}
                </div>
            ) : (
                selected
            );
        }

        return placeholder;
    }, [iconsList, selected]);

    return (
        <div className={cx}>
            <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {renderSelectedItem}
                    <ChevronIcon className="cr-dropdown__arrow" />
                </Dropdown.Toggle>
                <Dropdown.Menu>{list.map(renderElem)}</Dropdown.Menu>
            </Dropdown>
        </div>
    );
};
