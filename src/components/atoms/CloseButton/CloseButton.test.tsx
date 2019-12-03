import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { spy } from 'sinon';
import { CloseButton, CloseButtonProps } from './CloseButton';

const onClickSpy = spy();
const defaultProps: CloseButtonProps = {
    onClick: onClickSpy,
};

const setup = (props: Partial<CloseButtonProps> = {}) =>
    shallow(<CloseButton {...{ ...defaultProps, ...props }} />);

describe('Close Button', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        onClickSpy.resetHistory();
        wrapper = setup({ onClick: onClickSpy });
    });

    it('should render', () => {
       expect(wrapper).toMatchSnapshot();
    });

    it('should call onClick callback', () => {
       wrapper.find('.cr-close-button').simulate('click');
       expect(onClickSpy.calledOnce).toBeTruthy();
    });
});
