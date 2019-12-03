import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { Alert, AlertProps } from './Alert';

const defaultProps: AlertProps = {
    description: '34.233 BTC',
    title: 'Successful deposit',
    type: 'success',
};

const setup = (props: Partial<AlertProps> = {}) =>
    shallow(<Alert {...{ ...defaultProps, ...props }} />);

describe('Alert', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
       expect(wrapper).toMatchSnapshot();
    });

    it('should render success message', () => {
        wrapper = setup({ type: 'success' });
        const container = wrapper.find('.cr-alert');
        expect(container.hasClass('cr-alert--success')).toBeTruthy();
    });

    it('should render error message', () => {
        wrapper = setup({ type: 'error' });
        const container = wrapper.find('.cr-alert');
        expect(container.hasClass('cr-alert--error')).toBeTruthy();
    });
});
