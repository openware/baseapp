import { shallow } from 'enzyme';
import React from 'react';
import { TestComponentWrapper } from 'lib/test';
import { OrdersTabScreen } from '../';
import { IntlProps } from '../../';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <OrdersTabScreen />
        </TestComponentWrapper>
    );

describe('OrdersTabScreen test', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
