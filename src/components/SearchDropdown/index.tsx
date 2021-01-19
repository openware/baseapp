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
}

export const SearchDropdown: React.FC<OwnProps> = ({ className, onSelect, options, placeholder }) => {
    const customStyles = {
        placeholder: provided => ({
            ...provided,
            color: 'var(--input-placeholder-color)',
            fontWeight: 500,
            fontSize: 14,
            opacity: 0.5,
        }),
        control: (provided, state) => ({
            ...provided,
            height: 49,
            borderColor: state.isFocused ? 'var(--primary-cta-color)' : 'var(--input-border-color)',
            boxShadow: 'none !important',
            borderRadius: 4,
            background: 'var(--body-background-color)',
            '&:hover': {
                border: '1px solid var(--primary-cta-color)',
                outline: 'none',
                boxShadow: 'none',
            },
        }),
        menu: provided => ({
            ...provided,
            zIndex: 10,
            background: 'var(--dropdown-background-color)',
        }),
        option: provided => ({
            ...provided,
            background: 'inherit',
            color: 'var(--dropdown-text-color)',
            '&:hover': {
                background: 'var(--dropdown-background-color-hover)',
            },
        }),
        singleValue: provided => ({
            ...provided,
            fontWeight: 500,
            color: 'var(--primary-text-color)',
        }),
        input: provided => ({
            ...provided,
            color: 'var(--primary-text-color)',
        })
    };

    return (
        <Select
            className={className}
            options={options}
            onChange={onSelect}
            placeholder={placeholder}
            styles={customStyles}
        />
    );
};
