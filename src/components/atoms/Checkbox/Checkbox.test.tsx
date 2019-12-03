import {shallow, ShallowWrapper} from 'enzyme';
import * as React from 'react';
import { Checkbox, CheckboxProps } from './Checkbox';

const defaultProps: CheckboxProps = {
  disabled: false,
  label: 'text',
};

const setup = (props: Partial<CheckboxProps> = {}) =>
  shallow(<Checkbox {...{ ...defaultProps, ...props }} />);

describe('Checkbox', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(wrapper.hasClass('cr-checkbox')).toBeTruthy();
    });

    it('should pass along supplied className', () => {
        const className = 'some-class';
        wrapper = setup({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('should have correct className when disabled is true', () => {
        wrapper = setup({ disabled: true });
        expect(wrapper.hasClass('cr-checkbox__disabled')).toBeTruthy();
    });

    it('should have correct className when slider is true', () => {
        wrapper = setup({ slider: true });
        expect(wrapper.find('span').first().hasClass('slider')).toBeTruthy();
    });

    it('checkitem element should have correct class', () => {
        const { className } = wrapper.find('span').first().props();
        expect(className).toContain('cr-checkbox__checkitem');
    });

    it('checkitem element should have correct class', () => {
        const labelProps = wrapper.find('span').last().props();
        const { children } = labelProps;
        const { className } = labelProps;
        expect(children).toContain('text');
        expect(className).toContain('cr-checkbox__label');
    });
});
