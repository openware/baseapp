import { shallow } from 'enzyme';
import * as React from 'react';
import { Loader } from './Loader';

describe('Loader', () => {
    it('should render', () => {
        const wrapper = shallow(<Loader />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        const wrapper = shallow(<Loader />);
        expect(wrapper.hasClass('cr-loader')).toBeTruthy();
    });


    it('should have correct className and size with another props', () => {
        const wrapper = shallow(<Loader {...{className: 'test'}}/>);
        expect(wrapper.hasClass('cr-loader test')).toBeTruthy();
    });
});
