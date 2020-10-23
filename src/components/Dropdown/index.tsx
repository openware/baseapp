import classnames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { convertToString } from '../../helpers';

type DropdownElem = number | string | React.ReactNode;

interface Props {
    /**
     * List of options
     */
    list: DropdownElem[];
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
}

/**
 *  Cryptobase Dropdown that overrides default dropdown with list of options.
 */

export const DropdownComponent: React.FC<Props> = ({ list, className, placeholder = '', onSelect }) => {
    const [selected, setSelected] = React.useState<string>('');

    const defaultPlaceholder = list[0];

    const handleSelect = useCallback(
        (elem: DropdownElem, index: number) => {
            onSelect && onSelect(index);
            setSelected(convertToString(elem));
        },
        [onSelect]
    );

    useEffect(() => {
        setSelected(placeholder || convertToString(defaultPlaceholder));
    }, [placeholder, defaultPlaceholder]);

    return (
        <div
            className={classnames('cr-dropdown', className, {
                'cr-dropdown--default': selected === placeholder,
            })}>
            <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {selected}
                    <ChevronIcon className="cr-dropdown__arrow" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {list.map((item, index) => (
                        <Dropdown.Item key={index} onSelect={() => handleSelect(item, index)}>
                            {item}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};
