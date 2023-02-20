import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { spy } from 'sinon';
import { PercentageButton, PercentageButtonProps } from '.';

const onClickSpy = spy();
const defaultProps: PercentageButtonProps = {
    value: 100,
    className: 'cr-button-percentage-100',
    onClick: onClickSpy,
};

const renderComponent = (props: Partial<PercentageButtonProps> = {}) =>
    render(<PercentageButton {...{ ...defaultProps, ...props }} />);

describe('Close Button', () => {
    it('should render', () => {
        expect(renderComponent({ onClick: onClickSpy }).container).toMatchSnapshot();
    });

    it('should call onClick callback', () => {
        renderComponent({ onClick: onClickSpy });
        fireEvent.click(screen.getByRole('button'));
        expect(onClickSpy.calledOnce).toBeTruthy();
    });
});
