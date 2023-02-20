import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { ProfileScreen } from '../';

const renderComponent = () =>
    render(
        <TestComponentWrapper>
            <ProfileScreen />
        </TestComponentWrapper>,
    );

describe('ProfileScreen test', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
