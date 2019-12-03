import {shallow, ShallowWrapper} from 'enzyme';
import * as React from 'react';
import { Button } from '../../components/atoms/Button/Button';
import { Modal, ModalProps } from './';

const defaults: ModalProps = {
    show: true,
    header: <div>Title</div>,
    content: <div>Some content</div>,
    footer: <Button label={'Ok'} onClick={jest.fn()} />,
};

const setup = (props: Partial<ModalProps> = {}) =>
    shallow(<Modal {...{ ...defaults, ...props }} />);

describe('Basic Modal', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(wrapper.hasClass('cr-modal')).toBeTruthy();
    });

    it('should pass along supplied className', () => {
        const className = 'new-class';
        const wrapper = setup({ className });//tslint:disable-line
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('should handle false value in show prop', () => {
        expect(wrapper.props()).not.toBeNull();
        wrapper = setup({ show: false });
        expect(wrapper.props()).toEqual({});
    });
});
