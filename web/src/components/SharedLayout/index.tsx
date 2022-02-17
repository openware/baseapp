import { Layout } from '@openware/react-opendax';
import React, { FC } from 'react';
import {
    FOOTER_OPTIONS,
    NAVIGATIONS,
    LOGO_ICON,
    DEFAULT_USER_MENU,
    MOBILE_LOGO_ICON,
} from './SharedLayout.constants';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUserInfo,
    selectUserLoggedIn,
    logoutFetch,
} from '../../modules';

interface SharedLayoutProps {
    children: React.ReactNode;
}

const FooterProps = {
    options: FOOTER_OPTIONS,
    className: 'bg-main-background-color',
    dropdownBlockClassName: 'absolute z-50 bottom-8 w-40 bg-white rounded shadow r-2 select-none',
    dropdownOptionClassName: 'block text-gray-400 hover:text-gray-500 hover:bg-gray-50 rounded px-4 py-2',
    optionClassName: 'text-gray-400 hover:text-gray-500 px-5 relative',
    socialOptionClassName: 'text-gray-400 hover:text-gray-500 px-2 opacity-60 hover:opacity-100 delay-200',
    socialMoreButtonClassName: 'self-center ml-2 relative bg-gray-100 rounded flex py-1 px-2 cursor-pointer',
    socialMoreTextClassName: 'self-center text-gray-500 text-sm font-bold',
    socialMoreClassName: 'absolute flex flex-wrap flex-row flex-row bottom-8 right-0 w-52 z-50 p-4 bg-white rounded shadow r-2',
}

export const SharedLayout: FC<SharedLayoutProps> = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const userData = useSelector(selectUserInfo);
    const isLoggedIn = useSelector(selectUserLoggedIn);

    const logoutFunc = () => {
        dispatch(logoutFetch());
    }

    const profileFunc = () => {
        history.push('/profile');
    }

    const SidebarProps = {
        navigations: NAVIGATIONS,
        logo: LOGO_ICON,
        logoIcon: MOBILE_LOGO_ICON,
        isLoggedin: isLoggedIn,
        currentApp: 'Trade',
        userMenu: {
            userInfo: {
                uid: userData.uid,
                username: userData.username,
            },
            userMenuProps: {
                userMenu: DEFAULT_USER_MENU(profileFunc, logoutFunc),
            }
        }
    };

    return (
        <Layout
            footerProps={FooterProps}
            sidebarProps={SidebarProps}
        >
            {props.children}
        </Layout>
    );
};
