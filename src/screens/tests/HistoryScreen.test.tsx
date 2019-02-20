import { shallow } from 'enzyme';
import * as React from 'react';
import { HistoryScreen } from '../';

describe('HistoryScreen test', () => {
    it('should render', () => {
        const wrapper = shallow(<HistoryScreen />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
