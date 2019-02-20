import { shallow } from 'enzyme';
import * as React from 'react';
import { ForgotPasswordScreen } from '../';

describe('ForgotPasswordScreen test', () => {
    it('should render', () => {
        const wrapper = shallow(<ForgotPasswordScreen />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
