import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { VerificationScreen } from '..';
import { extractToken } from '../VerificationScreen';

const defaultProps = {
    location: {
        search: 'confirmation_token=123123',
    },
};

const renderComponent = () =>
    render(
        <TestComponentWrapper>
            <VerificationScreen {...defaultProps} />
        </TestComponentWrapper>,
    );

describe('VerificationScreen test', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('extract the token from search url', () => {
        expect(extractToken(defaultProps)).toEqual('123123');
    });
});
