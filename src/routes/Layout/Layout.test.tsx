import { shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import * as messages from '../../translations/en';
import { Layout, LayoutProps } from './';

jest.mock('react-ga');

const defaults: LayoutProps = {
    colorTheme: 'basic',
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
    history: createBrowserHistory(),
};

// tslint:disable: no-shadowed-variable
const nodeWithIntlProp = ((node, { intl }) => {
    return React.cloneElement(node, { intl });
});

const intlProvider = new IntlProvider({ locale: 'en', messages }, {});
const { intl } = intlProvider.getChildContext();

const setup = (props: Partial<LayoutProps> = {}) =>
    shallow(nodeWithIntlProp(<Layout {...{ ...defaults, ...props }} />, { intl }), {
    context: { intl },
});

describe('Layout component', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });
});
