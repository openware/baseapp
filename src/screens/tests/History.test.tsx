import { shallow } from 'enzyme';
import React from 'react';
import { TestComponentWrapper } from 'lib/test';
import { IntlProps } from '../../';
import { HistoryScreen } from '../History';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <HistoryScreen />
        </TestComponentWrapper>
    );

describe('HistoryScreen', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
