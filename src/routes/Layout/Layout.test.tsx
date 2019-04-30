import { shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import { Layout, LayoutProps } from './';

const defaults: LayoutProps = {
    currentMarket: undefined,
    user: {
        email: '',
        level: 0,
        otp: false,
        role: '',
        state: '',
        uid: '',
    },
    isLoggedIn: false,
    logout: jest.fn(),
    userFetch: jest.fn(),
    walletsReset: jest.fn(),
    walletsFetch: jest.fn(),
    history: createBrowserHistory(),
};

const setup = (props: Partial<LayoutProps> = {}) =>
    shallow(<Layout {...{...defaults, ...props }} />);

describe('Layout component', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });
});
