import { shallow } from 'enzyme';
import * as React from 'react';
import { OrdersTabScreen } from '../';

describe('OrdersTabScreen test', () => {
    it('should render', () => {
        const wrapper = shallow(<OrdersTabScreen />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
