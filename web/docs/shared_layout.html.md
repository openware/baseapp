## Shared layout

path to default values: web/src/components/SharedLayout/SharedLayout.constants.tsx

**Tower config**<br/>
Configs should be in **stringify version**

* **logo and mobile_logo** - icon inside sidebar:<br />
```json
    {
        logo: `Put your logo in svg (can be empty)`,
        mobile_logo: `Put your logo in svg (can be empty)`,
    }
```

* **navigations** - list of sidebar options:
```json
[
    {
        app: 'Trade',
        pathnames: [
            {
                name: 'Trade',
                icon_name: 'trade',
                path: '/trading',
            },
            {
                name: 'Quick exchange',
                icon_name: 'quick_exchange',
                path: '/quick-exchange',
            },
            {
                name: 'Wallets',
                icon_name: 'wallets',
                path: '/wallets',
            },
            {
                name: 'Orders',
                icon_name: 'orders',
                path: '/orders',
            },
            {
                name: 'History',
                icon_name: 'history',
                path: '/history',
            },
        ],
    },
    {
        app: 'new app',
        pathnames: [
            {
                name: 'Trade',
                icon_name: 'trade',
                path: '/trading',
            },
            ...
        ],
    },
];
```

* **footerNavigation** - list of footer options;
```json
[
    {
        name: 'About us',
        submenu: [
            {name: 'Terms', href: '/terms-of-service', target: '_self'},
            {name: 'Privacy', href: '/privacy-policy'},
            {name: 'Support', href: '/', target: "_blank"},
        ],
    },
    {
        ...
    }
]
```

* **footerSocials** - list of social links for footer
```json
[
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
    },
    {
        ...
    }
],
```