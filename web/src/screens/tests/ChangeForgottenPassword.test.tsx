import { shallow } from 'enzyme';
import React from 'react';
import { TestComponentWrapper } from 'lib/test';
import { IntlProps } from '../../';
import { ChangeForgottenPasswordScreen } from '../ChangeForgottenPasswordScreen';


const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <ChangeForgottenPasswordScreen />
        </TestComponentWrapper>
    );

describe('ChangeForgottenPasswordScreen test', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
