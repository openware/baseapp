import { mount } from 'enzyme';
import * as React from 'react';
import { AlertIcon } from './AlertIcon';

describe('AlertIcon', () => {
    it('should render success icon', () => {
        const wrapper = mount(<AlertIcon type="success" />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toHaveLength(1);
        wrapper.unmount();
    });

    it('should render error icon', () => {
        const wrapper = mount(<AlertIcon type="error" />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toHaveLength(1);
        wrapper.unmount();
    });

    it('should have success className', () => {
        const wrapper = mount(<AlertIcon type="success" />);
        const className = wrapper.find('div').props().className;
        expect(className).toContain('cr-alert-icon cr-alert-icon--success');
        wrapper.unmount();
    });

    it('should have error className', () => {
        const wrapper = mount(<AlertIcon type="error" />);
        const className = wrapper.find('div').props().className;
        expect(className).toContain('cr-alert-icon cr-alert-icon--error');
        wrapper.unmount();
    });
});
