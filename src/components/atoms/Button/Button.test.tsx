import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';
import { Button, ButtonProps } from './Button';

const defaults: ButtonProps = {
    label: 'Active',
    onClick: spy(),
};

const setup = (props: Partial<ButtonProps> = {}) =>
    shallow(<Button {...{ ...defaults, ...props }} />);

describe('Button', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(wrapper.hasClass('cr-button')).toBeTruthy();
    });

    it('should pass along supplied className', () => {
        const className = 'some-class';
        wrapper = setup({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('should pass along supplied type', () => {
        const type = 'submit';
        wrapper = setup({ type });
        expect(wrapper.prop('type')).toEqual('submit');
    });

    it('should set disable className when disabled', () => {
        wrapper = setup({ disabled: true });
        expect(wrapper.prop('disabled')).toBeTruthy();
        expect(wrapper.hasClass('cr-button--disabled')).toBeTruthy();
    });

    it('should set no-margin className', () => {
        wrapper = setup({ noMargin: true });
        expect(wrapper.hasClass('cr-button--no-margin')).toBeTruthy();
    });

    it('should render button with label in UPPER_CASE', () => {
        const expected = defaults.label.toLocaleUpperCase();
        const btn = wrapper.find('input');
        expect(btn.prop('value')).toBe(expected);
    });

    it('should call handler on onClick event with label value', () => {
        wrapper.simulate('click');
        expect((defaults.onClick as SinonSpy).callCount).toBe(1);
        expect(
            (defaults.onClick as SinonSpy).calledOnceWith(defaults.label),
        ).toBeTruthy();
    });
});
