import { shallow } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import * as React from 'react';
import { IntlProps } from '../../';
import { ConfirmScreen } from '../ConfirmScreen';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <ConfirmScreen />
        </TestComponentWrapper>,
    );

describe('ConfirmScreen test', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
