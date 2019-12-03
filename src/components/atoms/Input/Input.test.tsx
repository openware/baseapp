import { shallow } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';
import { Input, InputProps } from './Input';


const defaultProps: InputProps = {
    onChangeValue: () => undefined,
    type: 'text',
    value: 'value',
};

const setup = (props: Partial<InputProps> = {}) =>
    shallow(<Input {...{ ...defaultProps, ...props }} />);

describe('Input', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        const wrapper = setup();
        expect(wrapper.hasClass('cr-input')).toBeTruthy();
    });

    it('should pass along supplied className', () => {
        const className = 'some-class';
        const wrapper = setup({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('should have correct className when type is number', () => {
        defaultProps.type = 'number';
        const wrapper = setup();
        expect(wrapper.hasClass('cr-input__number')).toBeTruthy();
    });

    it('should have correct placeholder', () => {
        const placeholder = 'I am Placeholder';
        const wrapper = setup({ placeholder });
        const { children } = wrapper.props();
        expect(children.props.placeholder).toEqual(placeholder);
    });

    it('should handle onChangeValue callback', () => {
        const onChangeValue = spy();
        const wrapper = setup({ onChangeValue });
        wrapper.find('input').simulate('change', {target: {value: 'My new value'}});
        expect((onChangeValue as SinonSpy).calledOnceWith('My new value')).toBeTruthy();
    });

    it('should handle input "-"', () => {
        const wrapper = setup();
        const wrapperBefore = wrapper;
        const event = new KeyboardEvent('keyPress', {key : '-'});
        wrapper.find('input').simulate('keyPress', event);
        expect(wrapperBefore).toEqual(wrapper);
    });

    it('should handle input "."', () => {
        const wrapper = setup({ value: '1.2' });
        const wrapperBefore = wrapper;
        const event = new KeyboardEvent('keyPress', {key : '.'});
        wrapper.find('input').simulate('keyPress', event);
        expect(wrapperBefore).toEqual(wrapper);
    });

    it('should autoComplete input', () => {
        const wrapper = setup();
        expect(wrapper.props().children.props.autoComplete).toEqual('');
        wrapper.setProps({ type: 'password' });
        expect(wrapper.props().children.props.autoComplete).toEqual('current-password');
    });

    it('should handle onKeyPress event', () => {
        const onKeyPress = spy();
        const wrapper = setup({ onKeyPress });
        const wrapperBefore = wrapper;
        const event = new KeyboardEvent('keyPress', { key: 'Enter' });
        wrapper.find('input').simulate('keyPress', event);
        expect(wrapperBefore).toEqual(wrapper);
    });
});
