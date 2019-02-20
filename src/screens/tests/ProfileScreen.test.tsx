import { shallow } from 'enzyme';
import * as React from 'react';
import { ProfileScreen } from '../';

describe('ProfileScreen test', () => {
    it('should render', () => {
        const wrapper = shallow(<ProfileScreen />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
