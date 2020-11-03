import { shallow } from 'enzyme';
import * as React from 'react';

import { TestComponentWrapper } from 'lib/test';
import { IntlProps } from '../../';
import { ConfirmScreen } from '../ConfirmScreen';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <ConfirmScreen {...props} />
        </TestComponentWrapper>
    );

describe('ConfirmScreen test', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
