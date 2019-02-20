import { shallow } from 'enzyme';
import * as React from 'react';
import { EmailVerificationScreen } from '../';

describe('EmailVerificationScreen test', () => {
    it('should render', () => {
        const wrapper = shallow(<EmailVerificationScreen />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
