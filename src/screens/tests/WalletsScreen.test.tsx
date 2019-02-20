import { shallow } from 'enzyme';
import * as React from 'react';
import { WalletsScreen } from '../';

describe('WalletsScreen test', () => {
    it('should render', () => {
        const wrapper = shallow(<WalletsScreen />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
