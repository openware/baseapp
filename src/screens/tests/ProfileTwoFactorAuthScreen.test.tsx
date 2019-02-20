import { shallow } from 'enzyme';
import * as React from 'react';
import { ProfileTwoFactorAuthScreen } from '../';

describe('ProfileTwoFactorAuthScreen test', () => {
    it('should render', () => {
        const wrapper = shallow(<ProfileTwoFactorAuthScreen />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
