import { shallow } from 'enzyme';
import * as React from 'react';
import { SignUpScreen } from '../';

describe('SignUpScreen test', () => {
    it('should render', () => {
        const wrapper = shallow(<SignUpScreen />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
