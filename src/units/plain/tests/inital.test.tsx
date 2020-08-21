import * as React from 'react';
import { shallow } from 'enzyme';
import { JestTestComponentProps, JestTestComponent } from '../components/test';

const defaultProps: JestTestComponentProps = {
    text: 'Hello world!',
    title: '',
};

const wrapper = (props: Partial<JestTestComponentProps> = {}) => {
    return shallow<JestTestComponentProps>(<JestTestComponent {...defaultProps} {...props} />);
};

describe('Initial', () => {
    it('case 1', () => {
        expect(wrapper({ title: 'tooltip' })).toMatchSnapshot();
    });
});
