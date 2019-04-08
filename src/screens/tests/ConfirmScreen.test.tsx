import { shallow } from 'enzyme';
import * as React from 'react';
import { ConfirmScreen } from '../ConfirmScreen';

describe('ConfirmScreen test', () => {
    it('should render', () => {
        const wrapper = shallow(<ConfirmScreen />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
