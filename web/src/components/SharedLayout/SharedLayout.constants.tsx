import React from 'react';
import { SharedLayoutIcons } from '../../assets/images/sharedLayout/SharedLayout';
import { stringToHTML } from '../../helpers';
import { LogoIcon } from '../../assets/images/LogoIcon';

const navigations = window.env?.navigations ? JSON.parse(window.env.navigations) : undefined; 
const footerNavigation = window.env?.footerNavigation ? JSON.parse(window.env.footerNavigation) : undefined;
const footerSocials = window.env?.footerSocials ? JSON.parse(window.env.footerSocials) : undefined;
const logo_icons = window.env?.logo_icons ? JSON.parse(window.env.logo_icons) : undefined; 

const DEFAULT_FOOTER_OPTIONS = {
    navigations: [
        {
            name: 'About us',
            submenu: [
                {name: 'Terms', href: '/terms-of-service', target: '_self'},
                {name: 'Privacy', href: '/privacy-policy'},
                {name: 'Support', href: '/', target: "_blank"},
            ],
        }
    ],
    socials: [
        {
            name: 'Twitter',
            href: '/',
            icon: () => <SharedLayoutIcons name="twitter" />,
        },
        {
            name: 'Telegram',
            href: '/',
            icon: () => <SharedLayoutIcons name="telegram" />,
        },
        {
            name: 'Youtube',
            href: '/',
            icon: () => <SharedLayoutIcons name="youtube" />,
        },
        {
            name: 'Linkedin',
            href: '/',
            icon: () => <SharedLayoutIcons name="linkedin" />,
        },
        {
            name: 'Medium',
            href: '/',
            icon: () => <SharedLayoutIcons name="medium" />,
        },
        {
            name: 'Facebook',
            href: '/',
            icon: () => <SharedLayoutIcons name="facebook" />,
        },
        {
            name: 'Instagram',
            href: '/',
            icon: () => <SharedLayoutIcons name="instagram" />,
        },
        {
            name: 'Reddit',
            href: '/',
            icon: () => <SharedLayoutIcons name="reddit" />,
        }
    ],
    upIcon: () => <SharedLayoutIcons name="upIcon" />,
    downIcon: () => <SharedLayoutIcons name="downIcon" />,
    socialIconNumDisplay: 4,
}

export const DEFAULT_NAVIGATIONS = [
    {
        app: 'Trade',
        pathnames: [
            {
                name: 'Trade',
                icon: <SharedLayoutIcons name="trade" className='text-gray-500 flex-shrink-0 h-6 w-6' />,
                path: '/trading',
            },
            {
                name: 'Quick exchange',
                icon: <SharedLayoutIcons name="quick_exchange" className='text-gray-500 flex-shrink-0 h-6 w-6' />,
                path: '/quick-exchange',
            },
            {
                name: 'Wallets',
                icon: <SharedLayoutIcons name="wallets" className='text-gray-500 flex-shrink-0 h-6 w-6' />,
                path: '/wallets',
            },
            {
                name: 'Orders',
                icon: <SharedLayoutIcons name="orders" className='text-gray-500 flex-shrink-0 h-6 w-6' />,
                path: '/orders',
            },
            {
                name: 'History',
                icon: <SharedLayoutIcons name="history" className='text-gray-500 flex-shrink-0 h-6 w-6' />,
                path: '/history',
            },
        ],
    },
];

// parse svg element from window.env
export const LOGO_ICON = logo_icons?.logo ? stringToHTML(logo_icons?.logo) : <LogoIcon />;
export const MOBILE_LOGO_ICON = logo_icons?.mobile_logo ? stringToHTML(logo_icons?.mobile_logo) : <LogoIcon />;

export const NAVIGATIONS = navigations ? navigations.map(item => (
    {
        app: item.app,
        pathnames: item.pathnames ? item.pathnames.map(p => ({
            name: p.name,
            icon: <SharedLayoutIcons name={p.icon_name} className='text-gray-500 flex-shrink-0 h-6 w-6' />,
            path: p.path,
        })) : undefined,
    }
)) : DEFAULT_NAVIGATIONS;

export const FOOTER_OPTIONS = footerNavigation ? {
    navigations: footerNavigation,
    socials: footerSocials?.map(item => (
        {
            name: item.name,
            href: item.href,
            icon: () => <SharedLayoutIcons name={item.icon_name} />,
        }
    )),
    upIcon: () => <SharedLayoutIcons name="upIcon" />,
    downIcon: () => <SharedLayoutIcons name="downIcon" />,
    socialIconNumDisplay: 4,
} : DEFAULT_FOOTER_OPTIONS;

export const DEFAULT_USER_MENU = (profileFunc, logoutFunc) => [
    {
        icon: <SharedLayoutIcons name="user" />,
        label: 'Profile',
        onClick: () => profileFunc(),
    },
    {
        icon: <SharedLayoutIcons name="logout" />,
        label: 'Logout',
        onClick: () => logoutFunc(),
    },
];
