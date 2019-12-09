import { shallow } from 'enzyme';
import * as React from 'react';
import { CopyableTextField, CopyableTextFieldProps } from './';


const defaultProps: CopyableTextFieldProps = {
    value: '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4dfE',
    fieldId: 'copy_id',
};

const setup = (props: Partial<CopyableTextFieldProps> = {}) =>
    shallow(<CopyableTextField {...{ ...defaultProps, ...props }} />);

describe('CopyableTextField', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain cr-copyable-text-field className', () => {
        const wrapper = setup();
        expect(wrapper.find('.cr-copyable-text-field')).toHaveLength(1);
    });

    it('should render 1 input tag', () => {
        const wrapper = setup();
        const input = wrapper.find('input');
        expect(input.length).toBe(1);
    });

    it('should render 2 divs', () => {
        const wrapper = setup();
        const divs = wrapper.find('div');
        // tslint:disable-next-line:no-magic-numbers
        expect(divs.length).toBe(2);
    });

    it('should render correct className for input field', () => {
        const wrapper = setup();
        expect(wrapper.find('div').get(1).props.className)
            .toContain('cr-copyable-text-field__input');
    });
});
