import { shallow } from 'enzyme';
import * as React from 'react';
import { SignInScreen } from '../';

describe('SignInScreen test', () => {
    it('should render', () => {
        const wrapper = shallow(<SignInScreen />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
