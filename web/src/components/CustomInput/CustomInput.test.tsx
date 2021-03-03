import * as React from 'react';
import { CustomInput, CustomInputProps } from './';

import { shallow } from 'enzyme';

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

const setup = (props: Partial<CustomInputProps> = {}) =>
    shallow(<CustomInput {...{ ...defaults, ...props }} />);

describe('CustomInput component', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('renders without crashing', () => {
        const wrapper = setup();
        expect(wrapper).toBeDefined();
    });
});
