import { shallow } from 'enzyme';
import * as React from 'react';
import { SummaryField, SummaryFieldProps } from './';

const defaultProps: SummaryFieldProps = {
    message: 'Message',
    content: <div>Content</div>,
};

const setup = (props: Partial<SummaryFieldProps> = {}) => shallow(<SummaryField {...{ ...defaultProps, ...props }} />);

describe('SummaryField', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        const wrapper = setup();
        expect(wrapper.hasClass('cr-summary-field')).toBeTruthy();
    });

    it('should pass along supplied className', () => {
        const className = 'some-class';
        const wrapper = setup({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('should render correct message', () => {
        const wrapper = setup();
        const { children, className } = wrapper.find('span').first().props();
        expect(children).toContain('Message');
        expect(className).toContain('cr-summary-field-message');
    });
});
