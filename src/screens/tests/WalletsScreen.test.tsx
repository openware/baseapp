import { shallow } from 'enzyme';
import React from 'react';

import { TestComponentWrapper } from 'lib/test';
import { IntlProps } from '../../';
import { WalletsScreen } from '../WalletsScreen';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <WalletsScreen {...props} />
        </TestComponentWrapper>
    );

describe('WalletsScreen', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
