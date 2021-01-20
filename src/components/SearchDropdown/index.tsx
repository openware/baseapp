import * as React from 'react';
import Select, { ValueType } from 'react-select';

export interface OptionsInterface {
    label: string;
    value: string;
}

interface OwnProps {
    options: OptionsInterface[];
    onSelect: (option: ValueType<OptionsInterface, false>) => void;
    placeholder: string;
    className?: string;
    classNamePrefix?: string;
}

export const SearchDropdown: React.FC<OwnProps> = ({ className, onSelect, options, placeholder, classNamePrefix }) => (
    <Select
        className={className}
        classNamePrefix={classNamePrefix || 'cr-search-dropdown'}
        options={options}
        onChange={onSelect}
        placeholder={placeholder}
    />
);
