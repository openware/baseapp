import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { ProfileTwoFactorAuthScreen } from '../';
import { IntlProps } from '../../';

const renderComponent = (props: Partial<IntlProps> = {}) =>
    render(
        <TestComponentWrapper>
            <ProfileTwoFactorAuthScreen />
        </TestComponentWrapper>,
    );

describe('ProfileTwoFactorAuthScreen test', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
