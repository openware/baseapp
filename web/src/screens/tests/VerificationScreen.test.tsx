import { shallow } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import * as React from 'react';
import { VerificationScreen } from '..';
import { IntlProps } from '../../';
import { extractToken } from '../VerificationScreen';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <VerificationScreen />
        </TestComponentWrapper>,
    );

describe('VerificationScreen test', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });

    const tokenProps = {
        location: {
            search: 'confirmation_token=123123',
        },
    };

    it('extract the token from search url', () => {
        expect(extractToken(tokenProps)).toEqual('123123');
    });
});
