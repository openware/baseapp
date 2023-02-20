import { render } from '@testing-library/react';
import React from 'react';
import { CustomInput, CustomInputProps } from './';

const defaults: CustomInputProps = {
    type: '',
    label: '',
    defaultLabel: '',
    handleChangeInput: jest.fn(),
    inputValue: '',
    handleFocusInput: jest.fn(),
    classNameLabel: '',
    classNameInput: '',
    placeholder: '',
    autoFocus: false,
};

const renderComponent = (props: Partial<CustomInputProps> = {}) =>
    render(<CustomInput {...{ ...defaults, ...props }} />);

describe('CustomInput component', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
